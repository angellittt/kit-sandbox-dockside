# Overview

This repository is a monorepo that contains both backend and frontend applications for the Handled / TTT Studios projects. It is structured to facilitate development, testing, and deployment of web apps using a single codebase.

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
```

## Rationale

We believe that it's important to document the reason behind some of the key decisions we made in this project.

### Pnpm + TS + Turborepo

Overall, we aimed to create a codebase with as few dependencies as possible and minimal configuration. Our goal is for developers, even those with little or no experience with monorepos, to be able to clone the template and start coding immediately.

- **Pnpm:** Fast, efficient package management with great monorepo support.
- **Typescript:** Strong typing and tooling for safer code.
- **Turborepo:** Minimal configuration, easy setup, and less complexity than alternatives like NX.
