## Build

You need [`node`](https://nodejs.org/)/[`npm`](https://www.npmjs.com/).

    # Clone or download zip file
    git clone git@github.com:arthurhammer/github-toc.git
    cd github-toc

    # Install development dependencies
    npm install

    # Build unpackaged extensions for testing and running locally
    npm run build

    # Build extensions packaged for distribution
    npm run dist

Packaged and unpackaged builds live in the [`dist`](dist/) folder. [`gulp`](http://gulpjs.com/) is used to run the tasks (installed with the other dependencies).

### Testing in the Browser

First, build the unpackaged extensions with `npm run build`. Then, install the extensions in the browsers as described below. Test it on the [cases described in the `test` folder](test/Readme.md).

#### Google Chrome

**Manually**:

- Open the extensions page in Chrome
- Choose `dist/chrome` under “Load unpacked extension...”

**Command line**:

- `npm run chrome` opens a new Chrome instance with the extension installed.

Chrome has to be closed for this to work. The path to Chrome is hard-coded, change if needed.

#### Firefox

**Manually**:

- Open `about:debugging` in Firefox
- Choose `dist/firefox/manifest.json` under "Load Temporary Add-on"

**Command line**:

- `npm run firefox` opens a new Firefox instance with the extension installed.

The path to Firefox is hardcoded, change if needed. Also see the documentation for Mozilla's [`web-ext`][web-ext] tool.

[web-ext]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext

#### Safari

- Open Extension Builder in Safari
- Add `dist/safari.safariextension` as existing extension
- Click “Install”

Note: Unless you have a valid Safari Extension certificate, the extension will automatically be removed whenever you quit Safari. You will also not be able to build the packaged extension for direct install. [The certificate requires a (paid) Apple Developer Program membership](https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/ExtensionsOverview/ExtensionsOverview.html#//apple_ref/doc/uid/TP40009977-CH15-SW26).

#### Userscript

Install `dist/github-toc.user.js` directly in the browser if supported or with your favorite userscript manager (such as [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey](https://tampermonkey.net)).
