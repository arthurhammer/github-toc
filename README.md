# Table of Contents for GitHub

---

**Note**: GitHub finally [added this feature natively to the site](https://github.com/isaacs/github/issues/215#issuecomment-807688648)! As such, this project is not maintained anymore.

---

Browser extension that adds a table of contents to repositories, gists and wikis.

Available for [Google Chrome][Chrome], [Firefox][Firefox], [Safari][Safari] and as [userscript][Userscript].

![Screenshot](img/screenshots/safari1.png)

This is a simple browser extension that makes reading long files and pages on GitHub easier. If you regurlarly scroll around readmes and wikis looking for specific information, this is for you. Find what you are looking for, quickly.

Works almost anywhere on GitHub.

- Works with files in repos, gists, and wikis
- Supports any [GitHub markup](https://github.com/github/markup#markups)
- Supports editing and creating files and wiki pages directly on GitHub
- It's simple and unobtrusive

## Install

❤️ **[Chrome (Chrome Web Store)][Chrome]**

💚 **[Firefox (Mozilla Add-Ons)][Firefox]**

💙 **[Safari][Safari]**

💜 **[Userscript][Userscript]**

Note on Safari: The Safari extension is not (yet) hosted on Apple's Extension Gallery. To install, [download the extension `safari.safariextz` from the `dist` folder][Safari] and open it. Since the extension is not from the Gallery, Safari will ask you to trust it.

## Build

    npm run install
    npm run build

See [building](building.md) for more.

## Contribute

Contributions are welcome! 👍😀

## Changelog

See [CHANGELOG](CHANGELOG.md).

## License

[MIT](LICENSE).


[Chrome]: https://chrome.google.com/webstore/detail/table-of-contents-for-git/hlkhpeomjgelmljaknhoboeohhgmmgcn
[Firefox]: https://addons.mozilla.org/en-US/firefox/addon/github-toc/
[Userscript]: https://github.com/arthurhammer/github-toc/raw/master/dist/github-toc.user.js
[Safari]: https://github.com/arthurhammer/github-toc/releases/download/v0.2.3/safari.safariextz
