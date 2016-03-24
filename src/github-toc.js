var extPrefix = 'github-toc';
var anchorIdGitHubPrefix = 'user-content-';

var templates = {
  // Inserted with gulp
  toc      : '@@import src/html/toc.html',
  entry    : '@@import src/html/entry.html',
  backlink : '@@import src/html/backlink.html'
};

var classes = {
  centerButton : extPrefix + '-center-btn',
  wikiActions  : 'gh-header-actions',
  floatRight   : 'right'
};

var selectors = {
  tocContainer  : '#' + extPrefix + '-container',
  tocEntries    : '#' + extPrefix + '-entries',
  readme        : '#readme .markdown-body, #wiki-wrapper .markdown-body, #files .markdown-body',
  headingAnchor : ':scope > a.anchor, :scope > ins > a.anchor', // Relative to heading
  // Toc targets
  repo          : '#readme > h3',
  repoAlt       : '.file > .file-header > .file-actions',
  wiki          : '#wiki-wrapper > .gh-header .gh-header-actions',
  wikiAlt       : '#wiki-wrapper > .gh-header',
};

var insertTocFuncs = {
  // Repo main page
  repo: function(toc, target) {
    toc.classList.add(classes.floatRight);
    toc.firstElementChild.classList.add(classes.centerButton);
    return target.appendChild(toc);
  },
  // Repo sub page (viewing, creating, editing files) and gists
  repoAlt: function(toc, target) {
    toc.firstElementChild.classList.add(classes.centerButton);
    return target.prependChild(toc);
  },
  // Wiki main and sub page (viewing, editing existing pages)
  wiki: function(toc, target) {
    return target.prependChild(toc);
  },
  // Wiki main and sub page without actions bar (logged out or creating new pages)
  wikiAlt: function(toc, target) {
    toc.classList.add(classes.wikiActions);
    return target.prependChild(toc);
  }
};

var defaults = {
  backlinks: true
};

var observer = document.body.arrive(selectors.readme, true, function(readme) {

  if (!readme || readme.classList.contains(extPrefix)) return;
  readme.classList.add(extPrefix);

  var existing = query(selectors.tocContainer);
  if (existing) existing.remove();

  var tocContainer = toElement(templates.toc);
  if (!insertToc(tocContainer)) return;

  TableOfContents.toc({
    target: selectors.tocEntries,
    content: readme,
    prefix: extPrefix,
    anchorId: getAnchorId,
    entryElement: makeEntry
  });

  // Include headings:
  //   h2 > a.anchor       (normal)
  //   ins > h2 > a.anchor (inserted in rich diff)
  //   h2 > ins > a.anchor (modified in rich diff)
  // Exclude:
  //   del > h2 > a.anchor (deleted in rich diff)
  //   h2 > del > a.anchor (modified in rich diff)
  function getAnchorId(_, heading) {
    if (heading.parentNode.tagName.toLowerCase() === 'del' ) return null;
    var anchor = query(selectors.headingAnchor, heading);
    return (anchor && anchor.id) ? anchor.id.split(anchorIdGitHubPrefix)[1] : null;
  }

  function makeEntry(_, heading, data) {
    if (!data.anchorId) return;
    var entry = toElement(templates.entry);
    entry.classList.add(data.entryClass);
    entry.href = '#' + data.anchorId;
    entry.firstElementChild.title = data.title;
    entry.firstElementChild.textContent = data.title;
    if (defaults.backlinks) heading.appendChild(toElement(templates.backlink));
    return entry;
  }

  function insertToc(toc) {
    var targets = ['repo', 'repoAlt', 'wiki', 'wikiAlt'];

    return targets.some(function(key) {
      var target = query(selectors[key]);
      return target ? insertTocFuncs[key](toc, target) : false;
    });
  }

});

// For now, only used by Firefox
function destroy() {
  if (observer) observer.disconnect();
}
