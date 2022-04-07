# Installation

To avoid publishing under a new name, this package is published as a [GitHub package](https://github.com/visitsb/vuex/packages/1347458).

This means that you will need to [have a GitHub account](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package) in order to install package.

## Prerequisites

```bash
# Login to GitHub.
# Replace USERNAME with your GitHub username, 
# TOKEN with your personal access token, and 
# PUBLIC-EMAIL-ADDRESS with your email address.
$ npm login --scope=@USERNAME --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC-EMAIL-ADDRESS

# Create .npmrc in same location as your package.json to install packages
$ echo '@visitsb:registry=https://npm.pkg.github.com' >> .npmrc
```

## NPM

```bash
$ npm install @visitsb/vuex --save
```

## Yarn

```bash
$ yarn add @visitsb/vuex --save
```

[Back](index.md)
