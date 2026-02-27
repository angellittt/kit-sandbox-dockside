# Overview

This repository is a monorepo that contains both backend and frontend applications for the Handled / TTT Studios projects. It is structured to facilitate development, testing, and deployment of web apps using a single codebase.

## Getting Started

### Prerequisites

#### MacOs / Linux

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

# Install turbo
$ pnpm add turbo --global
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

# Install turbo
$ pnpm add turbo --global
```
