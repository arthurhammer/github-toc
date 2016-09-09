(function() {


var TableOfContents = (function() {

  var defaults = {
    // Where to insert the toc (selector or `Element`, first match)
    target: '#toc',
    // Where to look for headings (selector or `Element`, first match)
    content: 'body',
    // Which elements to create toc entries for (selector, not limited to `h1`-`h6`)
    headings: 'h1, h2, h3, h4, h5, h6',
    // Prefix to add to classes
    prefix: 'toc',
    // Wrap toc entry link elements with this element
    entryTagType: 'li',

    // Anchor id for a toc entry by which to identify the heading.
    // By default, an existing id on headings is expected.
    anchorId: function(i, heading, prefix) {
      return heading.id;
    },
    // Title for a toc entry
    title: function(i, heading, prefix) {
      return heading.textContent.trim();
    },
    // Class to add to a toc entry
    entryClass: function(i, heading, prefix) {
      var classPrefix = prefix ? (prefix + '-') : '';
      return  classPrefix + heading.tagName.toLowerCase();
    },

    // Creates the actual toc entry element.
    //   Default: `<entryTagType class="entryClass"><a href="#anchorId">title</a></entryTagType>`
    // By default, entries without an `anchorId` are skipped.
    entryElement: function(i, heading, data) {
      if (!data.anchorId) return null;

      var entry = document.createElement('a');
      entry.textContent = data.title;
      entry.href = '#' + data.anchorId;

      if (data.entryTagType) {
        var parent = document.createElement(data.entryTagType);
        parent.appendChild(entry);
        entry = parent;
      }

      if (data.entryClass) {
        entry.classList.add(data.entryClass);
      }

      return entry;
    }
  };

  function toc(options) {
    options = extend({}, TableOfContents.defaults, options);

    var target = getElement(options.target);
    var content = getElement(options.content);
    if (!target || !content) return null;

    var headings = content.querySelectorAll(options.headings);

    forEach(headings, function(i, h) {
      var anchorId = options.anchorId(i, h, options.prefix);

      var element = options.entryElement(i, h, {
        prefix: options.prefix,
        entryTagType: options.entryTagType,
        anchorId: anchorId,
        title: options.title(i, h, options.prefix),
        entryClass: options.entryClass(i, h, options.prefix)
      });

      if (element) {
        addAnchor(h, anchorId, options);
        target.appendChild(element);
      }
    });

    return target;
  }

  // TODO: Inserting elements can break CSS and other stuff
  // TODO: signature?
  function addAnchor(heading, anchorId, options) {
    if (!heading || !anchorId) return;

    if (anchorId !== heading.id) {
      var classPrefix = options.prefix ? (options.prefix + '-') : '';
      var anchorClass = classPrefix + 'anchor';
      var anchor = heading.querySelector(':scope > .' + anchorClass);
      if (!anchor) {
        anchor = document.createElement('span');
      }
      anchor.id = anchorId;
      anchor.classList.add(anchorClass);
      heading.insertBefore(anchor, heading.firstChild);
    }
  }

  function getElement(element) {
    // For now, only considers first match
    return (typeof element === 'string') ?
      document.querySelector(element) : element;
  }

  // from http://youmightnotneedjquery.com/#extend
  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
  }

  function forEach(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  }

  return {
    defaults: defaults,
    toc: toc
  };

})();

Node.prototype.prependChild = function(element) {
  return this.firstChild ? this.insertBefore(element, this.firstChild) : this.appendChild(element);
};

// Very rudamentary:
//   - New observer each call
//   - Caller responsible for storing and disconnecting observer
//   - `querySelector` against container instead of going through actual mutations
// For something more robust, see for example arrive.js.
HTMLElement.prototype.arrive = function(selector, existing, callback) {
  function checkMutations() {
    var didArriveData = 'finallyHere';
    var target = query(selector);

    if (target && !target.dataset[didArriveData]) {
      target.dataset[didArriveData] = true;
      callback.call(target, target);
    }
  }

  var observer = new MutationObserver(checkMutations);
  observer.observe(this, { childList: true, subtree: true });
  if (existing) checkMutations();

  return observer;
};

function toElement(str) {
  var d = document.createElement('div');
  d.innerHTML = str;
  return d.firstElementChild;
}

function query(selector, scope) {
  return (scope || document).querySelector(selector);
}

var extPrefix = 'github-toc';
var anchorIdGitHubPrefix = 'user-content-';

var defaults = {
  backlinks: true
};

var templates = { // Inserted with gulp
  toc      : '<!-- Container -->\n<span id="github-toc" class="select-menu js-menu-container js-select-menu">\n\n  <!-- Button -->\n  <span class="btn btn-sm select-menu-button js-menu-target css-truncate" title="Outline" role="button" aria-label="Show Outline" tabindex="0" aria-haspopup="true">\n    <svg aria-hidden="true" class="octicon octicon-book" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n      <path d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"></path>\n    </svg>\n    <span class="github-toc-title" class="js-select-button css-truncate-target"></span>\n  </span>\n\n  <!-- Menu -->\n  <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">\n    <div class="select-menu-modal">\n\n      <!-- Header -->\n      <div class="select-menu-header">\n        <span class="select-menu-title">Outline</span>\n        <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12">\n          <path d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path>\n        </svg>\n      </div>\n\n      <!-- Search Field -->\n      <div class="select-menu-filters">\n        <div class="select-menu-text-filter">\n          <input type="text" aria-label="Search headings" id="github-toc-filter-field" class="form-control js-filterable-field js-navigation-enable" placeholder="Search...">\n        </div>\n      </div>\n\n      <!-- Entries -->\n      <div class="select-menu-list" role="menu">\n        <div id="github-toc-entries" data-filterable-for="github-toc-filter-field" data-filterable-type="substring">\n        </div>\n        <div class="select-menu-no-results">Nothing to show</div>\n      </div>\n\n    </div>\n  </div>\n\n</span>\n',
  entry    : '<a class="github-toc-entry select-menu-item js-navigation-item js-navigation-open select-menu-item-text css-truncate-target" title="" href=""></a>\n',
  backlink : '<a href="#github-toc" class="github-toc-backlink github-toc-right">\n  <svg aria-hidden="true" class="octicon octicon-chevron-up" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n    <path d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5z"></path>\n  </svg>\n</a>\n'
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

})();