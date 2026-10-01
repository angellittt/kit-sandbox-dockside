# SBOMs (Software Bill of Materials)

**What this is:** every deploy produces a CycloneDX SBOM, a machine-readable list of every package that ships. Client IT teams can use it to see exactly what runs in their environment. This guide has two parts: a [dev section](#for-developers) (how it works, toggles, local runs, porting to another repo) and a [client IT section](#for-client-it-teams) you can copy and send as is.

**Format:** CycloneDX 1.6 JSON, file extension `.cdx.json`.

---

## For developers

### The two SBOM kinds

They stay as separate files on purpose. They answer different questions.

| Kind                              | What it lists                                                                                                                 | Made by                  | Where it runs                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------ |
| **Artifact** (client deliverable) | What actually ships. API: the built Docker image (npm deps plus the base image's OS packages). Web: production npm deps only. | Syft (API), cdxgen (web) | `deploy-api.yml`, `fe-web-deployment.yml`, every environment |
| **Source** (internal)             | The full `pnpm-lock.yaml`, dev deps included, for build-time supply chain visibility.                                         | cdxgen                   | `sbom-source.yml`, every PR and every push to `main`         |

Why the web SBOM comes from the lockfile: the Vite bundle merges packages into a few JS files, so scanning `dist/` can't tell which packages are inside. The lockfile can.

### Where the code lives

| Path                                                                        | What it does                                                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`.github/actions/sbom-image`](.github/actions/sbom-image/action.yml)       | Composite action. Syft scans an image, uploads the SBOM, optionally attaches it to the image in the registry. |
| [`.github/actions/sbom-lockfile`](.github/actions/sbom-lockfile/action.yml) | Composite action. cdxgen reads a lockfile (mode `full` or `prod`), uploads the SBOM.                          |
| [`.github/workflows/sbom-source.yml`](.github/workflows/sbom-source.yml)    | Source SBOM on PRs and `main`. Also runs the tests for the lockfile action.                                   |

Both actions take inputs for everything (image, name, path, mode) and have no paths from this repo hardcoded, so they can move to a shared org actions repo later with just a move and a tag. Third-party actions inside them are pinned by commit SHA, and the Syft, cdxgen and oras versions are pinned as input defaults.

**cdxgen is locked, not just pinned.** `npx cdxgen@<version>` pins cdxgen itself, but its ~150 dependencies resolve fresh on every run. So this repo installs cdxgen from `pnpm-lock.yaml` through the private [`packages/sbom-tools`](packages/sbom-tools/package.json) workspace package, and the web deploy passes that binary to the action as `cdxgen-bin`. No app depends on `packages/sbom-tools`, so `turbo prune` keeps it out of the Docker images. `sbom-source.yml` still uses `npx` because it runs without a `pnpm install`, with read-only permissions, and ships nothing.

**How `prod` mode works:** cdxgen reads the whole lockfile, then [`prune-bom.mjs`](.github/actions/sbom-lockfile/prune-bom.mjs) walks cdxgen's dependency graph starting from the `dependencies` (and `optionalDependencies`) in the project's `package.json`. Anything not reachable from there is dropped. The result matches what `pnpm deploy --prod` would install. We don't use cdxgen's own `--required-only` flag: for pnpm lockfiles it marks every transitive dependency as optional, so it drops them all (you get `express` but not `body-parser`).

### Never blocks a deploy

The artifact SBOM steps use `continue-on-error: true`. If Syft, cdxgen or the upload fails, the step shows a warning and the deploy carries on. The source SBOM workflow is informational and isn't a required check.

### Toggles

Repo variables (Settings > Secrets and variables > Actions > Variables). No YAML edits needed.

| Variable                  | Default | Effect                                                                                                |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `SBOM_ARTIFACT_ENABLED`   | on      | Set to `false` to skip the SBOM step in both deploy workflows.                                        |
| `SBOM_SOURCE_ENABLED`     | on      | Set to `false` to skip `sbom-source.yml`.                                                             |
| `SBOM_ACR_ATTACH_ENABLED` | on      | Set to `false` to stop attaching the API SBOM to its image in ACR as an OCI referrer (`oras attach`). |

"On by default" means the step runs unless the variable is exactly `false`, so a repo with no variables set gets SBOMs.

`SBOM_ACR_ATTACH_ENABLED` uses the same OIDC identity the deploy already uses. It needs push rights on the registry (the `AcrPush` role from `infra/template/github_actions_identity.tf` covers it).

### Where to find an SBOM

Every SBOM is uploaded as a GitHub Actions artifact on its workflow run (Actions tab > the run > Artifacts). Names:

- `sbom-api-<environment>-<commit sha>`
- `sbom-web-<environment>-<commit sha>`
- `sbom-source-<commit sha>`

Each run's job summary also shows the component count for each SBOM. Artifacts follow the repo's retention setting (90 days by default). The API SBOM also lives in ACR next to its image, so it doesn't expire. The web SBOM has no copy outside the artifact yet, so download it within the retention window if you need to keep it (see Azure Blob retention under future extensions).

### Running locally

Needs Node and a `pnpm install` (for the locked cdxgen in `packages/sbom-tools`). cdxgen only reads the lockfile:

```bash
# Writes sbom/source.cdx.json (full lockfile) and sbom/web.cdx.json (web prod deps)
pnpm sbom

# Tests for the lockfile action's prune step and wrapper script
pnpm test:sbom
```

`pnpm sbom` runs the same script the composite action runs, so a local SBOM matches CI for the same commit. The `sbom/` folder is git-ignored.

For the API image SBOM, build the image and scan it with [Syft](https://github.com/anchore/syft) (same version as the `syft-version` default in the action):

```bash
docker build --target production -t api:local -f apps/api/Dockerfile .
syft scan api:local --output cyclonedx-json@1.6=sbom/api.cdx.json
```

### Porting to an existing repo

1. Copy `.github/actions/sbom-image/` and `.github/actions/sbom-lockfile/` into the repo. They don't depend on anything else here.
2. In the API deploy workflow, after the image is pushed, add:

   ```yaml
   - name: Generate image SBOM
     if: vars.SBOM_ARTIFACT_ENABLED != 'false'
     continue-on-error: true
     uses: ./.github/actions/sbom-image
     with:
       image: <registry>/<image>:${{ github.sha }}
       name: api-<environment>-${{ github.sha }}
       attach-to-registry: ${{ vars.SBOM_ACR_ATTACH_ENABLED != 'false' }}
   ```

3. In the web deploy workflow, after the build, add the `sbom-lockfile` action with `mode: prod` and `workspace: <path to the web app>` (leave `workspace` empty in a single-package repo). Put it after the deploy step, so nothing it runs can change the build output before upload. The runner needs Node. To lock cdxgen's dependencies too, add `@cyclonedx/cdxgen` at an exact version to a package no app depends on, and pass its binary as `cdxgen-bin`.
4. Copy `.github/workflows/sbom-source.yml` for the source SBOM.
5. Optional: add the `sbom` and `test:sbom` scripts to the root `package.json`, and `/sbom/` to `.gitignore`.
6. Copy this file and update the artifact names and paths.

Works with npm, pnpm and Yarn lockfiles (cdxgen reads all three).

### Future extensions (not built)

- **cosign keyless attestation to ACR:** sign the SBOM and store the attestation next to the image, so a client can verify it came from our pipeline. Note: keyless signing writes the repo identity (org, repo, workflow) to the public Sigstore transparency log. Check that's fine for the client first.
- **GitHub artifact attestations** (`actions/attest-sbom`) aren't available on the org's current GitHub Team plan for private repos.
- **Dependency-Track upload:** push each SBOM to a Dependency-Track server for ongoing vulnerability tracking across releases.
- **Azure Blob retention:** copy SBOMs to a storage account when you need to keep them longer than the Actions artifact retention.
- **Vulnerability scanning and license checks** are a separate follow-up (Grype).

---

## For client IT teams

_This section is written to be sent on its own._

### What you get

For every deployment of the application, we produce a Software Bill of Materials (SBOM): a machine-readable list of every third-party package in what we deployed, with versions, package URLs (purls) and licenses where known.

- **Format:** [CycloneDX](https://cyclonedx.org/) 1.6, JSON (`.cdx.json`). Most SCA and vulnerability tools read it directly (Dependency-Track, Grype, OWASP tools, most commercial scanners).
- **API (backend):** one SBOM per deployed Docker image. It covers the Node.js packages and the operating system packages of the base image.
- **Web (frontend):** one SBOM per deployment, listing the production JavaScript dependencies the web app declares, and everything they pull in, as locked in the project's lockfile. It is built from the lockfile, not from the built site files.
- Each SBOM is tied to one exact source commit (the commit SHA is in the file name) and one environment.
- **How long we keep them:** API SBOMs are stored in the container registry next to their image, for as long as the image exists. Web SBOMs are kept for as long as our GitHub Actions artifact retention setting allows (90 days by default, but it can be set shorter). If you need a web SBOM for longer, ask for it soon after the deploy and keep your own copy.

### Artifact vs source SBOM

- The **artifact SBOM** is what's deployed in your environment. This is the one you want.
- The **source SBOM** is an internal build-time list that also includes developer tools that never ship (test runners, linters). Ask for it if your review covers the build pipeline, not only the running system.

### How to get an SBOM

**Option 1: from us.** Ask your contact for the SBOM of a given environment and deploy. We download it from the deploy run in GitHub Actions (artifact `sbom-api-<environment>-<commit sha>` or `sbom-web-<environment>-<commit sha>`).

**Option 2: straight from the container registry (API only).** The SBOM is attached to the image in Azure Container Registry as an OCI referrer. With [oras](https://oras.land/) and pull access to the registry:

```bash
az acr login --name <registry name>

# List SBOMs attached to an image
oras discover <registry name>.azurecr.io/api:<commit sha> \
  --artifact-type application/vnd.cyclonedx+json

# Download one (use the digest from the command above)
oras pull <registry name>.azurecr.io/api@<sbom digest> -o ./sbom
```

The SBOM is attached to the image digest, so it stays with that exact image even if tags move.
