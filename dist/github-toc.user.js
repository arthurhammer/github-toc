// ==UserScript==
// @name         Table of Contents for GitHub
// @description  Adds a table of contents to readmes in GitHub repos, gists and wikis.
// @version      0.2.2
// @author       Arthur Hammer
// @namespace    https://github.com/arthurhammer
// @license      MIT
// @homepage     https://github.com/arthurhammer/github-readme-toc
// @updateURL    https://github.com/arthurhammer/github-readme-toc/raw/master/dist/github-toc.user.js
// @downloadURL  https://github.com/arthurhammer/github-readme-toc/raw/master/dist/github-toc.user.js
// @supportURL   https://github.com/arthurhammer/github-readme-toc/issues
// @icon64       https://github.com/arthurhammer/github-readme-toc/raw/master/img/icons/icon128.png
// @match        https://github.com/*/*
// @match        https://gist.github.com/*/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function() {

function getPreferences(defaults, callback) {
    callback(defaults);
}

// Injected with gulp
var css = '/* Anchor for .select-menu-modal-holder */\n#toc-toc { position: relative; }\n/* Right-align menu on button */\n#toc-toc > .select-menu-modal-holder { right: 0; top: 20px;}\n/* Center button in file actions bar */\n.toc-center-btn  { margin: -4px 0; }\n\n.toc-h1 { padding-left:  10px !important; font-weight: bold; font-size: 1.1em; }\n.toc-h2 { padding-left:  30px !important; font-weight: bold; }\n.toc-h3 { padding-left:  50px !important; font-weight: normal; }\n.toc-h4 { padding-left:  70px !important; font-weight: normal; }\n.toc-h5 { padding-left:  90px !important; font-weight: normal; }\n.toc-h6 { padding-left: 110px !important; font-weight: normal; }\n\n.toc-entry.select-menu-item {\n    color: black;\n    border: none;\n    line-height: 1.0;\n}\n\n.toc-entry.select-menu-item.navigation-focus { color: white; }\n\n.toc-backlink { color: black; }\n.toc-backlink > svg { vertical-align: middle; }\n';

var style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

var templates = {
    // Injected with gulp
    toc:      '<span id="toc-toc" class="select-menu js-menu-container js-select-menu">\n    <span class="btn btn-sm select-menu-button js-menu-target css-truncate" title="Outline" role="button" aria-label="Show Outline" tabindex="0" aria-haspopup="true">\n        <svg aria-hidden="true" class="octicon octicon-book" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n            <path d="M2 5h4v1H2v-1z m0 3h4v-1H2v1z m0 2h4v-1H2v1z m11-5H9v1h4v-1z m0 2H9v1h4v-1z m0 2H9v1h4v-1z m2-6v9c0 0.55-0.45 1-1 1H8.5l-1 1-1-1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h5.5l1 1 1-1h5.5c0.55 0 1 0.45 1 1z m-8 0.5l-0.5-0.5H1v9h6V3.5z m7-0.5H8.5l-0.5 0.5v8.5h6V3z"></path>\n        </svg>\n        <span class="toc-title" class="js-select-button css-truncate-target"></span>\n    </span>\n    <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">\n        <div class="select-menu-modal">\n            <div class="select-menu-header">\n                <span class="select-menu-title">Outline</span>\n                <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12">\n                    <path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z"></path>\n                </svg>\n            </div>\n            <div class="select-menu-list" role="menu">\n                <div class="select-menu-no-results">Nothing to show</div>\n            </div>\n        </div>\n    </div>\n</span>\n',
    entry:    '<a class="toc-entry select-menu-item js-navigation-item js-navigation-open" href="">\n    <span class="select-menu-item-text css-truncate-target" title=""></span>\n</a>\n',
    backlink: '<a href="#toc-toc" class="toc-backlink right">\n    <svg aria-hidden="true" class="octicon octicon-chevron-up" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n        <path d="M10 9l-1.5 1.5-3.5-3.75L1.5 10.5 0 9l5-5 5 5z" />\n    </svg>\n</a>\n'
};

var preferences = {
    backlinks: true
};

function onReadme(readme) {
    if (!readme || readme.classList.contains("toc")) return;
    readme.classList.add("toc");

    var toc = toElement(templates.toc);
    var entryContainer = toc.getElementsByClassName("select-menu-list")[0];

    var headings = readme
        .getElementsByClassName("markdown-body")[0]
        .querySelectorAll("h1, h2, h3, h4, h5, h6");

    for (var i = 0; i < headings.length; i++) {
        var h = headings[i];
        var title = h.textContent.trim();
        var entry = toElement(templates.entry);

        entry.classList.add("toc-" + h.tagName.toLowerCase());
        entry.href = h.firstElementChild.href;
        entry.firstElementChild.title = title;
        entry.firstElementChild.textContent = title;

        insertBackLink(h);
        fixAnchorLink(entry);
        entryContainer.appendChild(entry);
    }

    insertToc(toc, readme);
}

// Insert toc into page. Tries destinations (Repo, Gist, Wiki) until success.
function insertToc(toc, readme) {
    var target;

    // GitHub repo front page
    // Append to: #readme > h3
    target = readme.querySelector(":scope > h3");
    if (target) {
        toc.classList.add("right");
        toc.firstElementChild.classList.add("toc-center-btn");
        target.appendChild(toc);
        return;
    }

    // GitHub repo detail and Gist page
    // Prepend to: .container .file > .file-header > .file-actions
    target = readme.closest(".file");
    if (target) {
        target = target.querySelector(".file-header > .file-actions");
        if (target) {
            toc.firstElementChild.classList.add("toc-center-btn");
            target.insertBefore(toc, target.firstChild);
            return;
        }
    }

    // Wiki
    // Prepend to: #wiki-wraper > gh-header > gh-header-show > gh-header-actions
    target = readme.closest("#wiki-wrapper");
    if (target) {
        var parent = target.querySelector(".gh-header > .gh-header-show");
        target = parent.querySelector(".gh-header-actions");

        // Header-actions don"t exist if not logged in
        if (!target) {
            target = parent;
            toc.classList.add("gh-header-actions");
        }

        target.insertBefore(toc, target.firstChild);
        return;
    }
}

function insertBackLink(heading) {
    if (! preferences.backlinks) return;
    var backlink = toElement(templates.backlink);
    heading.addEventListener("mouseenter",  function() { heading.appendChild(backlink); });
    heading.addEventListener("mouseleave", function() { backlink.remove(); });
}

// Clicking anchor link seems to jump to it only first time in some browsers (Chrome)
function fixAnchorLink(element) {
    element.addEventListener("click", function() {
        var githubPrefix = "user-content-";
        var targetId = element.href.substring(element.href.indexOf("#") + 1);
        document.getElementById(githubPrefix + targetId).scrollIntoView();
    });
}

function toElement(str) {
    var d = document.createElement("div");
    d.innerHTML = str;
    return d.firstChild;
}

HTMLElement.prototype.arriveById = function(id, callback) {
    new MutationObserver(function() {
        var target = document.getElementById(id);
        if (target) callback.call(target, target);
    })
    .observe(this, { childList: true, subtree: true });

    return this;
};

// Main entry point: Fetch prefs and go.
//
// Each version of this extension (Chrome, Firefox, userscript) provides
// an implementation for the `getPreferences` function.
getPreferences(preferences, function(data) {
    preferences = data;

    // Setup toc on inital page load
    onReadme(document.getElementById("readme"));
    onReadme(document.getElementById("wiki-body"));

    // Detect new readmes on ajax navigation.
    document.body.arriveById("readme", onReadme);
    document.body.arriveById("wiki-body", onReadme);
});


})();