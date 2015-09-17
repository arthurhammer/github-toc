var templates = {
        toc:      '@@import src/html/toc.html',
        entry:    '@@import src/html/entry.html',
        backlink: '@@import src/html/backlink.html'
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
