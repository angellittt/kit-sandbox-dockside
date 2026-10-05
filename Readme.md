# Overview

This repository is a monorepo that contains both backend and frontend applications for the Handled / TTT Studios projects. It is structured to facilitate development, testing, and deployment of web apps using a single codebase.

### Directory structure

```
Fullstack-starter-template/
├── apps/
│   ├── api/            # Express backend (Node.js, TypeScript)
│   └── web/            # React frontend (Vite, TypeScript)
├── packages/
│   ├── claude-hooks/   # Claude Code hooks (see "AI agent hooks")
│   ├── eslint-config/  # Shared ESLint configuration
│   ├── oxlint-config/  # Shared oxlint configuration and custom lint rules
│   └── vitest-config/  # Shared Vitest configuration and coverage setup
├── infra/              # Terraform infrastructure as code (Azure)
├── .claude/            # Claude Code settings, hooks and skills shared by the team
└── .github/            # GitHub Actions workflows, templates, and CODEOWNERS
```

## Getting Started

### Prerequisites

Every tool version (Node, pnpm, Terraform) is pinned in one file, [`mise.toml`](mise.toml). [mise](https://mise.jdx.dev) reads it and installs those exact versions, so your laptop, other laptops, and CI all run the same tools. CI uses the same file through `jdx/mise-action`.

#### 1. Install mise

```sh
# Linux / macOS
curl https://mise.run | sh
# or: brew install mise

# Windows
winget install jdx.mise
```

Then hook mise into your shell so the pinned versions are on your `PATH` whenever you are inside this repo (see [activation docs](https://mise.jdx.dev/getting-started.html#activate-mise)):

```sh
# bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
# zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

```powershell
# PowerShell (add to $PROFILE)
mise activate pwsh | Out-String | Invoke-Expression
```

On Windows, run the repo's shell scripts (`pnpm check:tool-versions`, `pnpm test:e2e`, git hooks) from Git Bash or WSL, since they are bash scripts.

If mise isn't active in a shell (an IDE terminal, a GUI git client), `pnpm install` still fails with a clear "Unsupported engine" error on the wrong Node or pnpm, because `package.json` sets `engines` and `pnpm-workspace.yaml` sets `engineStrict: true`. The pre-commit hook runs Terraform through `mise x --`, so it works even without activation.

#### 2. Install the pinned tools

```sh
# Trust this repo's mise.toml (first time only), then install everything in it.
# Downloads are checked against the checksums in mise.lock.
$ mise trust
$ mise install

# Verify
$ node -v       # matches mise.toml
$ pnpm -v       # matches mise.toml
$ terraform -v  # matches mise.toml
```

#### 3. Install dependencies

```sh
# Install turbo for better developer experience (optional)
$ pnpm add turbo --global

# Install all dependencies (also installs the git hooks)
$ pnpm i

# Build shared packages
$ pnpm build
```

#### Bumping a tool version

1. Change the version in `mise.toml`.
2. Refresh the checksums in `mise.lock`, then install:

   ```sh
   $ mise lock --platform linux-x64,linux-arm64,macos-arm64,macos-x64,windows-x64
   $ mise install
   ```

3. A few files can't read `mise.toml` and keep a copy of the version. Update them too:
   - root `package.json`: `packageManager` (pnpm) and `engines` (`node` as `^<node version>`, `pnpm` exact)
   - `ARG NODE_VERSION` / `ARG PNPM_VERSION` in `apps/api/Dockerfile`, `apps/web/Dockerfile` and `Dockerfile.test`
4. Run the drift check:

   ```sh
   # Fails if any copy drifted from mise.toml, a pnpm version is hardcoded
   # anywhere else, or a workflow sets up Node/pnpm on its own
   $ pnpm check:tool-versions
   ```

CI runs the same check, and its tests (`pnpm test:tool-versions`), in the Typecheck workflow. All workflows get their tools from `.github/actions/setup`, which also pins the mise version itself.

### Environment variables

Neither app requires an environment variable to run the default stack locally — `docker-compose-dev.yml` and `docker-compose.yml` work out of the box.

As an app needs configuration (an API base URL, a feature flag, a service credential), document it in a single root-level `.env.example` (with a `.env.test` counterpart for CI, using safe fixture values) rather than one file per app. `docker-compose-dev.yml` mounts that one shared `.env` into every service that needs it — keep it that way even as more variables get added, so there's one place to look instead of hunting through each app's folder.

### Docker & Containerization

We recommend getting familiar with Docker and Linux containers. If you are new to these technologies, check out this [free ebook](https://github.com/bobbyiliev/introduction-to-docker-ebook).

#### Local development with Docker

Both the `api` and `web` applications are dockerized. To start local development using Docker, run:

```sh
# Start API and Web containers in development mode
$ pnpm compose:dev:up
# Tears down all dev containers and their volumes
$ pnpm compose:dev:down
```

Access the web app at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:8000](http://localhost:8000).

To have containers auto-rebuild when `pnpm-lock.yaml` or a service's `package.json` changes, run Compose watch mode alongside `compose:dev:up` (in a separate terminal):

```sh
$ pnpm compose:dev:watch
```

#### Running with Docker

To start the containers using a production-ready build, you can use:

```sh
# Start API and Web containers
$ pnpm compose:up
# Tear down containers
$ pnpm compose:down
```

Access the web app at [http://localhost](http://localhost) or [https://localhost](https://localhost), and the API at [http://localhost:8080](http://localhost:8080).

### Local development without Docker

We do not recommend this approach, but we also understand that Docker has a learning curve. If you are unfamiliar with Docker and just want to develop locally:

```sh
# Run api and web applications locally
$ pnpm dev:no-docker
```

If you are familiar with Docker and still prefer this approach, please consider opening an issue on the [repository](https://github.com/tttstudios/Fullstack-starter-template) explaining what difficulties you are experiencing.

### Executing tests

In the workspace directory, you can execute the following commands:

```sh
# Test all applications and packages using turbo (faster due to turbo cache)
$ pnpm test
# Execute all tests
$ pnpm test:projects
# Execute all tests with watch mode
$ pnpm test:projects:watch
# Creates a test coverage report
$ pnpm test:report
# Creates a test coverage report and opens it on your browser
$ pnpm test:report:view
```

### Typechecking

```sh
# Typechecks all apps/packages, plus the root-level eslint.config.ts/vitest.config.ts
$ pnpm typecheck
```

This runs `tsc --noEmit` (or `tsc -b --noEmit` where an app uses TypeScript project references) across every app and package. It's a required, blocking check in CI (`typecheck.yml`) so a broken type can't merge unnoticed.

### Linting

Linting runs in two steps: [oxlint](https://oxc.rs/docs/guide/usage/linter) first, then ESLint.

- **oxlint** is a linter written in Rust, 50 to 100 times faster than ESLint. It runs most of our rules (core JS, TypeScript, import, promise, React, React hooks, JSX a11y) plus our own custom rules. Its config lives in `packages/oxlint-config` (`base.json`, `react.json`), and each app extends it from its own `.oxlintrc.json`.
- **ESLint** only runs the rules oxlint doesn't have yet: `eslint-plugin-security`, `turbo/no-undeclared-env-vars`, `prefer-arrow-functions`, `import-x/order`, `import-x/no-unresolved` and a few React Compiler rules. Its config lives in `packages/eslint-config`. [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint) turns off every ESLint rule that oxlint already runs, so no rule runs twice.

To turn off a rule on one line, use the comment for the tool that runs it:

- Rules oxlint runs: `// oxlint-disable-next-line <rule> -- <reason>`
- ESLint-only rules (listed above): `// eslint-disable-next-line <rule> -- <reason>`

Don't use `eslint-disable` for a rule oxlint runs. oxlint obeys it, but ESLint reports it as an unused directive and fails, and `pnpm lint:fix` deletes it.

Install the [oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) and [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VS Code extensions to see both in your editor.
**Note**: If you want to add the linter rules under your app, you must install `jiti` as a dev dependency. See more info on [how to use typescript configuration files here](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)

```sh
# Runs oxlint, then ESLint, in all apps/packages
$ pnpm lint
# Same, and fixes all automatically fixable issues
$ pnpm lint:fix
# Lints root-level files (e2e/, root configs)
$ pnpm lint:root
```

To move a rule from ESLint to oxlint, add it to `packages/oxlint-config/base.json` (or `react.json`). ESLint stops running it on its own. Check the [oxlint rule list](https://oxc.rs/docs/guide/usage/linter/rules) first.

#### Writing a custom lint rule

Team conventions can be lint errors instead of notes in a doc. Custom rules live in the `repo` plugin in `packages/oxlint-config/src/plugins/`. Example: `repo/no-direct-axios` makes the web app use the shared client in `src/lib/axios` instead of importing `axios` directly.

1. Add a rule file in `packages/oxlint-config/src/plugins/rules/`. Rules use the same API as ESLint rules (`meta` + `create`), wrapped in `defineRule` from `@oxlint/plugins`. Use `no-direct-axios.ts` as a template.
2. Add a test next to it in `rules/__tests__/`, using `RuleTester` from `oxlint/plugins-dev`. List code that should pass (`valid`) and code that should fail (`invalid`).
3. Register the rule in `src/plugins/repo-conventions.ts`.
4. Turn it on in the `.oxlintrc.json` of the app that should follow it, as `"repo/<rule-name>": "error"`. Use `overrides` to turn it off for files that are allowed to break it.
5. Run `pnpm --filter @repo/oxlint-config test` and `pnpm lint`.

Things to know:

- oxlint loads the plugin as TypeScript without a build step (Node's built-in type stripping). Keep the code plain TypeScript (no `enum` or `namespace`) and keep the `.ts` extension on relative imports.
- oxlint JS plugins are still in alpha and can't use type information. [Docs](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins).

### Formatting

We use prettier to format the code. Make sure you have the [prettier vscode extension](https://github.com/prettier/prettier-vscode) installed. Try the following commands:

```sh
# Runs formatter
$ pnpm format
# Runs formatter but only checks that files are already formatted (useful for CI)
$ pnpm format:check
```

### Git hooks

Git hooks are managed by [Lefthook](https://lefthook.dev) and configured in [`lefthook.yml`](lefthook.yml). `pnpm i` installs them. If you cloned the repo when it still used Husky, `pnpm i` also removes Husky's `core.hooksPath` setting for you.

The rule: **if CI would fail, the commit fails first.** Each hook calls the same pnpm script or turbo task CI calls, so a check is defined once. `pnpm check:hook-parity` (run by the hook and by the Lint workflow) fails if the hooks and the PR workflows stop running the same checks.

| Hook       | What runs                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pre-commit | In parallel: Prettier on staged files (fixes are re-staged), `pnpm verify --affected` (lint, typecheck and unit tests), `pnpm lint:root` when root-level files (`e2e/`, root configs, the shared ESLint config) are staged, `pnpm terraform:fmt`/`terraform:validate` when `infra/**/*.tf` changes, `pnpm check:tool-versions`/`test:tool-versions` when a file with a pinned version changes, and `pnpm check:hook-parity` when `lefthook.yml`, `package.json` or a workflow changes |
| pre-push   | `scripts/e2e-ci.sh` (the same script `e2e.yml` runs), unless the push only changes docs, `infra/` or `.github/`                                                                                                                                                                                                                                                                                                                                                                       |

`--affected` limits turbo to the packages you changed (staged or not) plus the packages that depend on them. Turbo's cache skips anything already checked, so a small change with a warm cache takes a few seconds. `pnpm verify` without `--affected` runs every check on every package.

Things to know:

- Hooks run every command through `mise x --`, so they use the versions in `mise.toml` even from GUI git clients that don't load your shell profile. `mise` itself still has to be on the `PATH` git sees (see [Prerequisites](#prerequisites)).
- Checks run on your working tree, not only the staged content. Unstaged edits in the same package are checked too.
- Pre-push E2E needs Docker running. The first run builds the images and takes a couple of minutes, later runs take under a minute.
- Hooks don't install in CI (`CI` is set) or when `LEFTHOOK=0`.

On rare occasions, it may be necessary to bypass the git hooks:

```sh
# Bypass the pre-commit hook
git commit --no-verify
# Bypass the pre-push hook
git push --no-verify
```

**Warning**: Only bypass the hooks for tests you don't own, e.g. an unrelated app's suite is already broken on `main` and you don't know how to fix it. Never use `--no-verify` to skip a test that's failing because of your own change; fix it or ask for help instead. AI agents in Claude Code are blocked from the common ways to bypass the hooks (see [AI agent hooks](#ai-agent-hooks)).

### AI agent hooks

When a check fails, AI agents sometimes take a shortcut: `git commit --no-verify`, an `it.skip`, an `eslint-disable`. Asking them not to in the docs isn't enough, so this repo ships [Claude Code hooks](https://code.claude.com/docs/en/hooks) that block those shortcuts. They are committed in [`.claude/settings.json`](.claude/settings.json), so they are active for everyone who runs Claude Code in this repo. The code is small and lives in [`packages/claude-hooks`](packages/claude-hooks), with tests.

| When                                  | What the hook does                                                                                                                                                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Before Claude runs a shell command    | **Blocks** anything that skips the git hooks: `--no-verify`, `git commit -n`, `LEFTHOOK=0` / `LEFTHOOK=false`, `LEFTHOOK_EXCLUDE=...`, `HUSKY=0`, changing `core.hooksPath`, `lefthook uninstall`. Also inside `&&` chains and `bash -c "..."` |
| After Claude edits or writes a file   | Runs Prettier (writes the fix), then oxlint and ESLint on that file, with the repo's own config. Errors go straight back to Claude so it fixes them before moving on                                                                           |
| After an edit adds a check suppressor | **Warns** Claude to justify or remove it: `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`, `.skip(`, `.only(`, `.fixme(`, `xit(`, `fit(`, `xdescribe(`, `fdescribe(`. A warning, not a block, since some are legitimate      |

When a command is blocked, Claude sees: "Bypassing checks is not allowed. Fix the failing check and commit again."

Things to know:

- The hooks are TypeScript run straight from source, so they need the Node version from `mise.toml`. `.claude/hooks/run-hook.sh` runs them through `mise exec` when mise is installed, and falls back to `node` from your `PATH` when it isn't.
- If the shell command hook can't start (for example `mise.toml` not trusted, or no mise and the `node` on your `PATH` is too old) or takes too long, the command is **blocked** with setup steps, instead of silently letting it through. `run-hook.sh` stops the hook itself a few seconds before Claude Code's own `timeout`, because a hook that Claude Code times out lets the command through.
- Only the shell command hook can block. The edit hooks run after the file is already written, so if they can't run, Claude gets the setup steps but the edit stays, unformatted and unlinted.
- Linting a file after an edit takes several seconds, mostly ESLint starting up. oxlint adds about half a second.
- Only Claude Code's tool calls are checked. Commands you type in your own terminal aren't affected; Lefthook still covers those.
- The command check is a best-effort parser, not a full shell. It catches the common forms, not every possible trick. The CI workflows are still the final gate.

### Creating a new package

```sh
# Create an empty dir
$ mkdir -p packages/<your-package>
# Cd into dir
$ cd packages/<your-package>
# Initialize package
$ pnpm init --init-type module
```

### Managing infrastructure

Please read infra/Readme.md

## CI/CD

These GitHub Actions workflows run on pull requests:

| Workflow             | File                                                                               | Triggers                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Typecheck            | [`.github/workflows/typecheck.yml`](.github/workflows/typecheck.yml)               | PR opened, synchronised, or reopened                                                                   |
| Lint                 | [`.github/workflows/lint.yml`](.github/workflows/lint.yml)                         | PR opened, synchronised, or reopened                                                                   |
| Terraform            | [`.github/workflows/terraform.yml`](.github/workflows/terraform.yml)               | PR opened, synchronised, or reopened                                                                   |
| Code Coverage Report | [`.github/workflows/code-coverage.yml`](.github/workflows/code-coverage.yml)       | PR opened, synchronised, or reopened                                                                   |
| React Doctor (web)   | [`.github/workflows/react-doctor-web.yml`](.github/workflows/react-doctor-web.yml) | PR touching `apps/web/**` or `packages/**`                                                             |
| Source SBOM          | [`.github/workflows/sbom-source.yml`](.github/workflows/sbom-source.yml)           | PR opened, synchronised, or reopened; push to `main`; daily schedule; manual run (`workflow_dispatch`) |

**Typecheck** runs `pnpm typecheck` (`tsc` across every app/package, plus the root level `eslint.config.ts`/`vitest.config.ts`, which aren't part of any workspace project). Unlike Code Coverage, React Doctor and Source SBOM, this one is blocking by design: mark it as a required status check in branch protection once it's run at least once on this branch.

**Lint** runs `pnpm lint` (ESLint in every workspace package), `pnpm lint:root` (ESLint on root-level files like `e2e/` and `playwright.config.ts`) and `pnpm format:check` (Prettier). **Terraform** runs `pnpm terraform:fmt` and `pnpm terraform:validate` against `infra/`, offline, so it needs no Azure credentials. Both are the CI twins of the pre-commit hook and are blocking: mark them as required status checks too.

**Code Coverage Report** runs the test suite, reads the coverage summary, and posts/updates a sticky PR comment with the line/statement/function/branch percentages. It warns below 70% but never fails the check — informational only, until the team is comfortable enough writing tests to enforce a floor.

**React Doctor (web)** runs [react-doctor](https://github.com/millionco/react-doctor) React performance/correctness linting on changed files. Non-blocking (`blocking: none`); it's a heads-up, not a gate. It's scoped to PRs touching `apps/web/**` or `packages/**` even though its actual scan target is fixed to `apps/web` — a `packages/**`-only PR triggers a deliberate no-op run rather than being silently skipped, since a shared package change can still affect `apps/web`'s render behavior.

**Source SBOM** writes a CycloneDX SBOM of the whole lockfile (dev deps included) and uploads it as a workflow artifact. Its **Vulnerability scan** job runs Grype on it and fails on fixable critical vulnerabilities (not a required check yet). The deploy workflows also produce an artifact SBOM (what actually ships) for every environment and scan it, report only. Nothing SBOM-related ever blocks a deploy. See [SBOM.md](SBOM.md) for toggles, suppressions, local runs, and the section to send to client IT teams.

As this template grows a deploy pipeline (build/push a Docker image, run migrations, deploy to an environment), add it here as another row rather than a separate doc — this table should stay the one place that lists every workflow and what fires it.

### Branch protection rules

No branch is protected on this repository yet — the rules below are the convention to apply to `main` (and to `qa`/`staging` once those environments and their deploy workflows exist):

- At least 1 approving review required before merging
- Approvals are dismissed when new commits are pushed to the PR
- All conversations must be resolved before merging (this is what makes CodeRabbit's comments count, see [Pull request reviews](#pull-request-reviews))
- Required status checks must pass before merging: Typecheck, Lint and Terraform
- Force pushes are blocked
- Branch deletion is blocked
- Administrators are not exempt from any of the above rules

## Pull request reviews

Every PR into `main` gets an AI review from [CodeRabbit](https://coderabbit.ai) first, then a human review. CodeRabbit is set up in [`.coderabbit.yaml`](.coderabbit.yaml).

### The flow

1. Open a PR. Drafts are skipped, so CodeRabbit reviews when you mark it ready for review.
2. CodeRabbit reviews it. If it finds something, it leaves comments and a "request changes" review. Once the [GitHub settings for `main`](#github-settings-for-main) are on, the open comments block the merge: every conversation has to be resolved first. Don't count on the "request changes" review alone to block it; the conversation rule is the gate.
3. The author handles each comment: fix it, or reply with why not, then resolve the conversation. Reply `@coderabbitai` in a thread to talk to it. Once the comments are handled, CodeRabbit approves.
4. At least 1 human approves.

CodeRabbit stays quiet about anything CI already checks (types, tests, lint and format). It only comments on what a human reviewer would otherwise have to catch: secrets, security issues, workflow permissions, weakened tests and loosened tooling rules.

### GitHub settings for `main`

In **Settings → Branches → Add branch ruleset** (or a classic branch protection rule) for `main`, turn on:

- **Require a pull request before merging**, with **Required approvals: 1**
- **Dismiss stale pull request approvals when new commits are pushed**
- **Require conversation resolution before merging**, so every CodeRabbit conversation has to be resolved

CodeRabbit also needs its GitHub app installed on the repo, from the company CodeRabbit subscription.

### CODEOWNERS

[`.github/CODEOWNERS`](.github/CODEOWNERS) has placeholder handles (`@your-github-handle`). Replace them with the real GitHub users or teams that own each folder, so GitHub asks the right people to review. If you also turn on **Require review from Code Owners**, the owner of each changed folder must approve.

### Adjusting `.coderabbit.yaml` per project

- **Review instructions**: add or edit entries in `reviews.path_instructions`. Each one is a glob plus plain-language rules for files that match, for example your project's own conventions in `apps/api/**`.
- **Skipped files**: add `!glob` entries to `reviews.path_filters` for generated or vendored files.
- **Tools**: every tool in CodeRabbit's schema is listed in `reviews.tools`, because a tool left out defaults to on. A tool is only on when CI doesn't already run it (for example gitleaks, semgrep, zizmor, actionlint, shellcheck, hadolint). If you add a tool to CI, turn it off in `reviews.tools` so findings aren't reported twice. If CI stops running one, turn it on. When CodeRabbit adds a tool to its schema, add it to the list too.
- **Project docs**: `knowledge_base.code_guidelines.filePatterns` lists the docs CodeRabbit reads as review rules (`AGENTS.md`, `CONTEXT.md`, `Readme.md`, `.claude/skills/**`). Add any other conventions doc your project keeps.
- **Tone and strictness**: `tone_instructions` and `reviews.profile` (`chill` or `assertive`).

The first line of the file points editors at CodeRabbit's JSON schema, so VS Code (with the YAML extension) autocompletes and validates keys.

## Rationale

We believe that it's important to document the reason behind some of the key decisions we made in this project.

### Pnpm + TS + Turborepo

Overall, we aimed to create a codebase with as few dependencies as possible and minimal configuration. Our goal is for developers, even those with little or no experience with monorepos, to be able to clone the template and start coding immediately.

- **Pnpm:** Fast, efficient package management with great monorepo support.
- **Typescript:** Strong typing and tooling for safer code.
- **Turborepo:** Minimal configuration, easy setup, and less complexity than alternatives like NX.

### Docker

We want to ensure the code works everywhere and can be easily versioned. Developers will likely need to interact with a database server, so we want them to be able to simply add it to the Docker Compose files instead of installing it on their own systems.

### Vitest

We want to encourage developers to write tests more often. Most frontend developers have experience with Vitest, while most backend developers are familiar with Jest. We chose Vitest because its API is fully compatible with Jest, and it is much easier to use with ESM modules.
