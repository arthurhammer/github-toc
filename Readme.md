## Table of Contents for GitHub

Browser extension that adds a table of contents to readmes in GitHub repos, gists and wikis. Quickly find what you are looking for.

Available for [Google Chrome](https://chrome.google.com/webstore/detail/github-readme-table-of-co/hlkhpeomjgelmljaknhoboeohhgmmgcn), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-readme-toc/), and as a [userscript](https://github.com/arthurhammer/github-readme-toc/raw/master/dist/github-toc.user.js).

<img style="border: 1px solid lightgrey; border-radius: 5px;" src="img/screenshots/screenshot-github.png">

## Get It

🚀 **[Chrome Web Store](https://chrome.google.com/webstore/detail/github-readme-table-of-co/hlkhpeomjgelmljaknhoboeohhgmmgcn)**

🚀 **[Mozilla Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/github-readme-toc/)**

🚀 **[Userscript](https://github.com/arthurhammer/github-readme-toc/raw/master/dist/github-toc.user.js)**

A Safari extension is coming soon.

## Build Yourself

You need [`node`](https://nodejs.org/).

    # Install development dependencies
    npm install

    # Build unpackaged extensions
    npm run build

    # Build extensions packaged for distribution
    npm run dist

The builds live in the [`dist`](dist/) folder.

[`gulp`](http://gulpjs.com/) is used to run the tasks.

To try the extension out, test it on some of the [files linked in the `test` folder](test/Readme.md).

## Changelog

### 0.2.2

- Fixed several issues caused by updates to the GitHub website
- Various minor updates

### 0.2.1

- Added Firefox version
- Added userscript version
