## GitHub - Readme Table of Contents

Simple browser extension that adds a table of contents to GitHub Readmes, Wikis, and Gists.

Quickly find what you are looking for.

![Screenshot](img/screenshots/screenshot-github.png)

## Install

🚀 **[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/github-readme-table-of-co/hlkhpeomjgelmljaknhoboeohhgmmgcn)**.

🚀 **[Install from Mozilla Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/github-readme-toc/)**.

🚀 **[Install Userscript](https://github.com/arthurhammer/github-readme-toc/raw/master/dist/github-toc.user.js)**.

(Currently does not work in Safari due to Safari's enforcement of Content Security Policies for extensions and scripts.)

## Build

    # Install development dependencies
    npm install

    # Build unpackaged extensions
    gulp build

    # Build packaged extensions for distribution
    gulp dist

(You don't have to run `gulp build` before `gulp dist` manually.)

The builds live in the `dist` folder.

To try the extension out, test it on some of the [files linked in the `test` folder](https://github.com/arthurhammer/github-readme-toc/blob/master/test/Readme.md).

## Changelog

### 0.2.1

- Add Firefox version
- Add userscript version
