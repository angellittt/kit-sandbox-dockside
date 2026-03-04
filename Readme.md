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

# Build shared packages
$ pnpm build
```

### Docker & Containerization

We recommend getting familiar with Docker and Linux containers. If you are new to these technologies, check out this [free ebook](https://github.com/bobbyiliev/introduction-to-docker-ebook).

#### Running Locally with Docker

Both the `api` and `web` applications are dockerized. To start local development using Docker, run:

```sh
# Start API and Web containers in development mode
$ pnpm compose:dev:up
```

Access the web app at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:8000](http://localhost:8000).

#### Running in Production with Docker

To start the containers using a production-ready build, you can use:

```sh
# Start API and Web containers in production mode
$ pnpm compose:prod:up
```

Access the web app at [http://localhost](http://localhost) or [https://localhost](https://localhost), and the API at [http://localhost:8080](http://localhost:8080).

## Rationale

We believe that it's important to document the reason behind some of the key decisions we made in this project.

### Pnpm + TS + Turborepo

Overall, we aimed to create a codebase with as few dependencies as possible and minimal configuration. Our goal is for developers, even those with little or no experience with monorepos, to be able to clone the template and start coding immediately.

- **Pnpm:** Fast, efficient package management with great monorepo support.
- **Typescript:** Strong typing and tooling for safer code.
- **Turborepo:** Minimal configuration, easy setup, and less complexity than alternatives like NX.

### Docker

We want to ensure the code works everywhere and can be easily versioned. Developers will likely need to interact with a database server, so we want them to be able to simply add it to the Docker Compose files instead of installing it on their own systems.
