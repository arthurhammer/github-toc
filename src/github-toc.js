var extPrefix = 'github-toc';
var anchorIdGitHubPrefix = 'user-content-';

var defaults = {
  backlinks: true
};

var templates = { // Inserted with gulp
  toc      : '@@import src/html/toc.html',
  entry    : '@@import src/html/entry.html',
  backlink : '@@import src/html/backlink.html'
};

var classes = {
  centerButton : extPrefix + '-center-btn',
  floatRight   : extPrefix + '-right',
  wikiActions  : 'gh-header-actions'
};

var selectors = {
  tocContainer  : '#' + extPrefix,
  tocEntries    : '#' + extPrefix + '-entries',
  headingAnchor : ':scope > a.anchor, :scope > ins > a.anchor',
};

var tocTargets = [
  { // Repo main page
    readme: '#readme .markdown-body',
    target: '#readme > h3',
    insert: function(toc, target) {
      toc.classList.add(classes.floatRight);
      toc.firstElementChild.classList.add(classes.centerButton);
      return target.appendChild(toc);
    }
  },
  { // Repo sub page (viewing, creating, editing files) and gists
    readme: '#files .markdown-body',
    target: '.file > .file-header > .file-actions',
    insert: function(toc, target) {
      return target.prependChild(toc);
    }
  },
  { // Wiki main and sub page (viewing, editing existing pages)
    readme: '#wiki-content .markdown-body:not(.wiki-custom-sidebar)',
    target: '#wiki-wrapper > .gh-header .gh-header-actions',
    insert: function(toc, target) {
      return target.prependChild(toc);
    }
  },
  { // Wiki main and sub page without actions bar (logged out or creating new pages)
    readme: '#wiki-content .markdown-body:not(.wiki-custom-sidebar)',
    target: '#wiki-wrapper > .gh-header',
    insert: function(toc, target) {
      toc.classList.add(classes.wikiActions);
      return target.prependChild(toc);
    }
  }
];

var readmeSelector = tocTargets
  .map(function(t) { return t.readme; })
  .join(', ');

var observer = document.body.arrive(readmeSelector, true, function(readme) {

  if (!readme || readme.classList.contains(extPrefix)) return;
  readme.classList.add(extPrefix);

  var existing = query(selectors.tocContainer);
  if (existing) {
    existing.remove();
  }

  var tocContainer = toElement(templates.toc);
  if (!insertToc(tocContainer)) return;

  TableOfContents.toc({
    target: selectors.tocEntries,
    content: readme,
    prefix: extPrefix,
    anchorId: anchorId,
    entryElement: entryElement,
  });

  // Include headings:
  //   h2 > a.anchor       (normal)
  //   ins > h2 > a.anchor (inserted in rich diff)
  //   h2 > ins > a.anchor (modified in rich diff)
  // Exclude:
  //   del > h2 > a.anchor (deleted in rich diff)
  //   h2 > del > a.anchor (modified in rich diff)
  function anchorId(_, heading) {
    var parentTag = heading.parentNode.tagName.toLowerCase();
    if (parentTag === 'del' ) return null;
    var anchor = query(selectors.headingAnchor, heading);
    if (!anchor || !anchor.id) return null;

    return anchor.id.split(anchorIdGitHubPrefix)[1];
  }

  function entryElement(_, heading, data) {
    if (!data.anchorId) return null;

    var entry = toElement(templates.entry);
    entry.classList.add(data.entryClass);
    entry.href = '#' + data.anchorId;
    entry.title = data.title;
    entry.textContent = data.title;

    if (defaults.backlinks) {
      var backlink = toElement(templates.backlink);
      heading.appendChild(backlink);
    }

    return entry;
  }

  function insertToc(toc) {
    return tocTargets.some(function(t) {
      var target = query(t.target);
      return target && t.insert(toc, target);
    });
  }

});

// For now, only used in Firefox
function destroy() {
  if (observer) observer.disconnect();
}
