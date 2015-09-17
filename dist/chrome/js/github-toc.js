var templates = {
        toc:      '<span id="" class="toc-toc select-menu js-menu-container js-select-menu">\n    <span class="btn btn-sm select-menu-button js-menu-target css-truncate" title="Outline" role="button" aria-label="Show Outline" tabindex="0" aria-haspopup="true">\n        <span class="octicon octicon-book"></span>\n        <span class="toc-title" class="js-select-button css-truncate-target"></span>\n    </span>\n    <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">\n        <div class="select-menu-modal">\n            <div class="select-menu-header">\n                <span class="select-menu-title">Outline</span>\n                <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>\n            </div>\n            <div class="select-menu-list" role="menu">\n                <div class="select-menu-no-results">Nothing to show</div>\n            </div>\n        </div>\n    </div>\n</span>\n',
        entry:    '<a class="select-menu-item js-navigation-item js-navigation-open" href="">\n    <span class="select-menu-item-text css-truncate-target" title=""></span>\n</a>\n',
        backlink: '<a href="" class="toc-backlink right">\n    <span class="octicon octicon-chevron-up"></span>\n</a>\n'
    },
    options = {
        backlinks: true
    },
    numTocs = 0;

chrome.storage.sync.get(options, function(items) {
    options = items;
    main();
});

function main() {
    // In Gists there can be multiple readmes with same id: use querySelectorAll
    toArray(
        document.querySelectorAll('#readme'),
        document.querySelectorAll('#wiki-body')
    )
    .forEach(onReadme);

    // Detect new readmes on ajax navigation
    // (there's also chrome.webNavigation.onHistoryStateUpdated)
    document.body
        .arrive('#readme', onReadme)
        .arrive('#wiki-body', onReadme);
}

function onReadme(readme) {
    if (readme.classList.contains('toc')) return;
    readme.classList.add('toc');

    var toc = toElement(templates.toc);
    toc.id = 'toc-' + (++numTocs);
    var container = toc.getElementsByClassName('select-menu-list')[0];

    var headings = toArray(
        readme
        .getElementsByClassName('markdown-body')[0]
        .querySelectorAll('h1, h2, h3, h4, h5, h6')
    );

    headings.forEach(insertBackLinks.bind(null, toc.id));
    headings = headings.map(toEntry);
    headings.forEach(fixAnchorLink);
    headings.forEach(container.appendChild.bind(container));

    insertToc(toc, readme);
}

// Insert toc into page. Tries destinations (Repo, Gist, Wiki) until success.
function insertToc(toc, readme) {
    var target;

    // GitHub repo front page
    target = readme.querySelector(':scope > h3');
    if (target) {
        toc.classList.add('right', 'toc-fix-btn');
        target.appendChild(toc);
        return;
    }

    // GitHub repo detail and Gist page
    target = readme.closest('.file');
    if (target) {
        target = target.querySelector('.file-header .file-actions');
        if (target) {
            toc.classList.add('toc-fix-btn');
            target.insertBefore(toc, target.firstChild);
            return;
        }
    }

    // Wiki
    target = readme.closest('#wiki-wrapper');
    if (target) {
        target = target.querySelector('.gh-header .gh-header-actions');
        if (target) {
            target.insertBefore(toc, target.firstChild);
            return;
        }
    }

    console.log("Found table-of-contentifyable file but did not find a nice place to insert the table :(");
}

function toEntry(heading) {
    var title = heading.textContent.trim();
    var href  = heading.firstElementChild.href;
    var level = heading.tagName.toLowerCase();
    var entry = toElement(templates.entry);

    // TODO: Does any of this need to be escaped?
    entry.classList.add('toc-' + level);
    entry.href = href;
    entry.firstElementChild.title = title;
    entry.firstElementChild.textContent = title;
    return entry;
}

function insertBackLinks(id, heading) {
    if (! options.backlinks) return;

    var backlink = toElement(templates.backlink);
    backlink.href = '#' + id;

    heading.addEventListener('mouseover',  function() { heading.appendChild(backlink); });
    heading.addEventListener('mouseleave', function() { backlink.remove(); });
}

// Clicking anchor link seems to jump to it only first time in Chrome.
function fixAnchorLink(element) {
    element.addEventListener('click', function() {
        var githubPrefix = 'user-content-';
        var targetID = element.href.substring(element.href.indexOf('#') + 1);
        var target = document.getElementById(githubPrefix + targetID);
        target.scrollIntoView();
    });
}

function toElement(str) {
    var d = document.createElement('div');
    d.innerHTML = str;
    return d.firstChild;
}

function toArray() {
    var array = [];
    for (var i = 0; i < arguments.length; i++) {
        // (Node lists may be live and length can change)
        var length = arguments[i].length;
        for (var j = 0; j < length; j++) {
            array.push(arguments[i][j]);
        }
    }
    return array;
}

// Watch for elements matching a selector to appear on the page. Checks the selector
// both on the anchor element ('matches') and all its descendants ('querySelectorAll').
// Callback is called for each matched element individually.
HTMLElement.prototype.arrive = function(selector, callback) {
    var matches =
        HTMLElement.prototype.matches               ||
        HTMLElement.prototype.webkitMatchesSelector ||
        HTMLElement.prototype.mozMatchesSelector    ||
        HTMLElement.prototype.msMatchesSelector;

    function checkMutations(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                var node = mutations[i].addedNodes[j];
                if (node instanceof HTMLElement) {
                    if (matches.call(node, selector)) {
                        callback.call(node, node);
                    }
                    var childMatches = node.querySelectorAll(selector);
                    for (var k = 0; k < childMatches.length; k++) {
                        callback.call(childMatches[k], childMatches[k]);
                    }
                }
            }
        }
    }

    new MutationObserver(checkMutations).observe(this, { childList: true, subtree: true });
    return this;
};

