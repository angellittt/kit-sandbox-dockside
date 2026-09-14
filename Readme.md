# Overview

This repository is a monorepo that contains both backend and frontend applications for the Handled / TTT Studios projects. It is structured to facilitate development, testing, and deployment of web apps using a single codebase.

### Directory structure

```
Fullstack-starter-template/
├── apps/
│   ├── api/            # Express backend (Node.js, TypeScript)
│   └── web/            # React frontend (Vite, TypeScript)
├── packages/
│   ├── eslint-config/  # Shared ESLint configuration
│   └── vitest-config/  # Shared Vitest configuration and coverage setup
├── infra/              # Terraform infrastructure as code (Azure)
└── .github/            # GitHub Actions workflows, templates, and CODEOWNERS
```

## Getting Started

### Prerequisites

#### Linux / macOS

```sh
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.14.0".

# Verify npm version:
npm -v # Should print "11.9.0".

# Install pnpm
$ npm install -g pnpm@latest-10

# Install turbo for better developer experience (optional)
$ pnpm add turbo --global

# Install all dependencies
$ pnpm i

# Install git hooks
$ pnpm prepare

# Build shared packages
$ pnpm build
```

#### Windows

```sh
# Download and install Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js:
choco install nodejs --version="24.14.0"

# Verify the Node.js version:
node -v # Should print "v24.14.0".

# Verify npm version:
npm -v # Should print "11.9.0".

# Install pnpm
$ npm install -g pnpm@latest-10

# Install turbo for better developer experience (optional)
$ pnpm add turbo --global

# Install all dependencies
$ pnpm i

# Install git hooks
$ pnpm prepare

# Build shared packages
$ pnpm build
```

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

We use eslint for linting the code. Please make sure you have the [eslint vscode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) installed. All rules are defined under the `eslint-config` package.
**Note**: If you want to add the linter rules under your app, you must install `jiti` as a dev dependency. See more info on [how to use typescript configuration files here](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)

```sh
# Runs linter in all apps/packages
$ pnpm lint
# Runs linter in all apps/packages and fixes all automatically fixable issues
$ pnpm lint:fix

```

### Formatting

We use prettier to format the code. Make sure you have the [prettier vscode extension](https://github.com/prettier/prettier-vscode) installed. Try the following commands:

```sh
# Runs formatter
$ pnpm format
# Runs formatter but only checks that files are already formatted (useful for CI)
$ pnpm format:check
```

### Git hooks

Before every commit, a pre-commit hook will run to ensure all files follow the linting and formatting rules.
Similarly, before pushing to remote, a pre-push hook will run tests for all projects.

On rare occasions, it may be necessary to bypass the git hooks:

```sh
# Bypass the pre-commit hook
git commit --no-verify
# Bypass the pre-push hook
git push --no-verify
```

**Warning**: Only bypass the hooks for tests you don't own — e.g. an unrelated app's suite is already broken on `main` and you don't know how to fix it. Never use `--no-verify` to skip a test that's failing because of your own change; fix it or ask for help instead.

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

Three GitHub Actions workflows run on this repository today:

| Workflow             | File                                                                               | Triggers                                   |
| -------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| Typecheck            | [`.github/workflows/typecheck.yml`](.github/workflows/typecheck.yml)               | PR opened, synchronised, or reopened       |
| Code Coverage Report | [`.github/workflows/code-coverage.yml`](.github/workflows/code-coverage.yml)       | PR opened, synchronised, or reopened       |
| React Doctor (web)   | [`.github/workflows/react-doctor-web.yml`](.github/workflows/react-doctor-web.yml) | PR touching `apps/web/**` or `packages/**` |

**Typecheck** runs `pnpm typecheck` (`tsc` across every app/package, plus the root level `eslint.config.ts`/`vitest.config.ts`, which aren't part of any workspace project). Unlike the other two checks, this one is blocking by design: mark it as a required status check in branch protection once it's run at least once on this branch.

**Code Coverage Report** runs the test suite, reads the coverage summary, and posts/updates a sticky PR comment with the line/statement/function/branch percentages. It warns below 70% but never fails the check — informational only, until the team is comfortable enough writing tests to enforce a floor.

**React Doctor (web)** runs [react-doctor](https://github.com/millionco/react-doctor) React performance/correctness linting on changed files. Non-blocking (`blocking: none`); it's a heads-up, not a gate. It's scoped to PRs touching `apps/web/**` or `packages/**` even though its actual scan target is fixed to `apps/web` — a `packages/**`-only PR triggers a deliberate no-op run rather than being silently skipped, since a shared package change can still affect `apps/web`'s render behavior.

As this template grows a deploy pipeline (build/push a Docker image, run migrations, deploy to an environment), add it here as another row rather than a separate doc — this table should stay the one place that lists every workflow and what fires it.

### Branch protection rules

No branch is protected on this repository yet — the rules below are the convention to apply to `main` (and to `qa`/`staging` once those environments and their deploy workflows exist):

- At least 1 approving review required before merging
- Approvals are dismissed when new commits are pushed to the PR
- Required status checks must pass before merging: Code Coverage Report; lint and format checks (once those workflows are added)
- Force pushes are blocked
- Branch deletion is blocked
- Administrators are not exempt from any of the above rules

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
