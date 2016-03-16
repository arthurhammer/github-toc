// Inserted with gulp
var TEMPLATE = {
    TOC      : '@@import src/html/toc.html',
    ENTRY    : '@@import src/html/entry.html',
    BACKLINK : '@@import src/html/backlink.html'
};

var CLASS = {
    CENTER_BUTTON : 'toc-center-btn',
    WIKI_ACTIONS  : 'gh-header-actions'
};

var SELECTOR = {
    README          : '#readme .markdown-body, #wiki-wrapper .markdown-body',
    TOC_ENTRIES     : '#toc-entries',
    // Toc targets
    REPO            : '#readme > h3',
    GIST            : '.file > .file-header > .file-actions',
    WIKI            : '#wiki-wrapper > .gh-header .gh-header-actions',
    WIKI_LOGGED_OUT : '#wiki-wrapper > .gh-header > .gh-header-show',
};

// TODO
var EXT_PREFIX = 'github-toc';

var defaults = {
    backlinks: true
};

HTMLElement.prototype.arrive = function(selector, existing, callback) {
    function checkMutations() {
        var target = document.querySelector(selector);
        if (target) callback.call(target, target);
    }

    new MutationObserver(checkMutations)
        .observe(this, { childList: true, subtree: true });

    if (existing) checkMutations();
};

document.body.arrive(SELECTOR.README, true, function(readme) {
    if (!readme || readme.classList.contains('toc')) return;
    readme.classList.add('toc');
    if (!insertToc(toElement(TEMPLATE.TOC))) return;

    TableOfContents.toc({
        target: SELECTOR.TOC_ENTRIES,
        scope: readme,
        prefix: EXT_PREFIX,
        anchorID: function(_, heading) {
            return heading.firstElementChild ? heading.firstElementChild.href.split('#')[1] : null;
        },
        entryElement: makeEntry
    });

    function makeEntry(_, heading, config) { // TODO: if anchorID null skip element?
        var entry = toElement(TEMPLATE.ENTRY);
        entry.classList.add(config.entryClass);
        entry.href = '#' + config.anchorID;
        entry.firstElementChild.title = config.title;
        entry.firstElementChild.textContent = config.title;
        if (defaults.backlinks) heading.appendChild(toElement(TEMPLATE.BACKLINK));
        return entry;
    }

    function insertToc(toc) {
        var target;

        // Repo main page
        target = document.querySelector(SELECTOR.REPO);
        if (target) {
            toc.classList.add('right');
            toc.firstElementChild.classList.add(CLASS.CENTER_BUTTON);
            target.appendChild(toc);
            return true;
        }

        // Repo sub page (viewing and editing), Gist page
        target = document.querySelector(SELECTOR.GIST);
        if (target) {
            toc.firstElementChild.classList.add(CLASS.CENTER_BUTTON);
            target.insertBefore(toc, target.firstChild);
            return true;
        }

        // Wiki main and sub page (viewing and editing)
        target = document.querySelector(SELECTOR.WIKI);
        if (target) {
            target.insertBefore(toc, target.firstChild);
            return true;
        }

        // Wiki main and sub page when logged out
        target = document.querySelector(SELECTOR.WIKI_LOGGED_OUT);
        if (target) {
            toc.classList.add(CLASS.WIKI_ACTIONS);
            target.insertBefore(toc, target.firstChild);
            return true;
        }

        return false;
    }

    function toElement(str) {
        var d = document.createElement('div');
        d.innerHTML = str;
        return d.firstChild;
    }
});
