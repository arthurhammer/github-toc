var templates = {
    // Injected with gulp
    toc:      '@@import src/html/toc.html',
    entry:    '@@import src/html/entry.html',
    backlink: '@@import src/html/backlink.html'
};

var preferences = {
    backlinks: true
};

function onReadme(readme) {
    if (!readme || readme.classList.contains('toc')) return;
    readme.classList.add('toc');

    var toc = toElement(templates.toc);
    var entryContainer = toc.getElementsByClassName('select-menu-list')[0];

    var headings = readme
        .getElementsByClassName('markdown-body')[0]
        .querySelectorAll('h1, h2, h3, h4, h5, h6');

    for (var i = 0; i < headings.length; i++) {
        var h = headings[i];
        var title = h.textContent.trim();
        var entry = toElement(templates.entry);

        entry.classList.add('toc-' + h.tagName.toLowerCase());
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
    target = readme.querySelector(':scope > h3');
    if (target) {
        toc.classList.add('right');
        toc.firstElementChild.classList.add('toc-center-btn');
        target.appendChild(toc);
        return;
    }

    // GitHub repo detail and Gist page
    // Prepend to: .container .file > .file-header > .file-actions
    target = readme.closest('.file');
    if (target) {
        target = target.querySelector('.file-header > .file-actions');
        if (target) {
            toc.firstElementChild.classList.add('toc-center-btn');
            target.insertBefore(toc, target.firstChild);
            return;
        }
    }

    // Wiki
    // Prepend to: #wiki-wraper > gh-header > gh-header-show > gh-header-actions
    target = readme.closest('#wiki-wrapper');
    if (target) {
        var parent = target.querySelector('.gh-header > .gh-header-show');
        target = parent.querySelector('.gh-header-actions');

        // Header-actions don't exist if not logged in
        if (! target) {
            target = parent;
            toc.classList.add('gh-header-actions');
        }

        target.insertBefore(toc, target.firstChild);
        return;
    }
}

function insertBackLink(heading) {
    if (! preferences.backlinks) return;
    var backlink = toElement(templates.backlink);
    heading.addEventListener('mouseenter',  function() { heading.appendChild(backlink); });
    heading.addEventListener('mouseleave', function() { backlink.remove(); });
}

// Clicking anchor link seems to jump to it only first time in some browsers (Chrome)
function fixAnchorLink(element) {
    element.addEventListener('click', function() {
        var githubPrefix = 'user-content-';
        var targetId = element.href.substring(element.href.indexOf('#') + 1);
        document.getElementById(githubPrefix + targetId).scrollIntoView();
    });
}

function toElement(str) {
    var d = document.createElement('div');
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
    onReadme(document.getElementById('readme'));
    onReadme(document.getElementById('wiki-body'));

    // Detect new readmes on ajax navigation.
    document.body.arriveById('readme', onReadme);
    document.body.arriveById('wiki-body', onReadme);
});

