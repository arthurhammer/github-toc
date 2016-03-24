// ==UserScript==
// @name         Table of Contents for GitHub
// @description  Adds a table of contents to repositories, gists and wikis on GitHub
// @version      0.2.3
// @author       Arthur Hammer
// @namespace    https://github.com/arthurhammer
// @license      MIT
// @homepage     https://github.com/arthurhammer/github-toc
// @updateURL    https://github.com/arthurhammer/github-toc/raw/master/dist/github-toc.user.js
// @downloadURL  https://github.com/arthurhammer/github-toc/raw/master/dist/github-toc.user.js
// @supportURL   https://github.com/arthurhammer/github-toc/issues
// @icon64       https://github.com/arthurhammer/github-toc/raw/master/img/icons/icon128.png
// @match        https://github.com/*/*
// @match        https://gist.github.com/*/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

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
    title: function(i, heading) {
      return heading.textContent.trim();
    },
    // Class to add to a toc entry
    entryClass: function(i, heading, prefix) {
      return (prefix ? prefix + '-' : '') + heading.tagName.toLowerCase();
    },

    // Creates the actual toc entry element.
    //   Default: `<entryTagType class="entryClass"><a href="#anchorId">title</a></entryTagType>`
    // By default, entries without an `anchorId` are skipped.
    entryElement: function(i, heading, data) {
      if (!data.anchorId) return null;

      var a = document.createElement('a');
      a.textContent = data.title;
      a.href = '#' + data.anchorId;

      var entry = data.entryTagType ? document.createElement(data.entryTagType) : a;
      if (entry !== a) entry.appendChild(a);
      if (data.entryClass) entry.classList.add(data.entryClass);

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
        entryTagType: options.entryTagType,
        prefix: options.prefix,
        title: options.title(i, h),
        entryClass: options.entryClass(i, h, options.prefix),
        anchorId: anchorId
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
      var anchorClass = (options.prefix ? options.prefix + '-' : '') + 'anchor';
      var anchor = heading.querySelector(':scope > .' + anchorClass) || document.createElement('span');
      anchor.id = anchorId;
      anchor.classList.add(anchorClass);
      heading.insertBefore(anchor, heading.firstChild);
    }
  }

  function getElement(element) {
    // For now, only considers first match
    return (typeof element === 'string') ? document.querySelector(element) : element;
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
  return d.firstChild;
}

function query(selector, scope) {
  return (scope || document).querySelector(selector);
}

// Inserted with gulp
var css = '#github-toc-container { position: relative; } /* Anchor for .select-menu-modal-holder */\n#github-toc-container > .select-menu-modal-holder { right: 0; top: 20px;} /* Right-align menu on button */\n.github-toc-center-btn  { margin: -4px 0; } /* Center button in file actions bar */\n\n.github-toc-h1 { padding-left:  10px !important; font-weight:   bold; font-size: 1.1em; }\n.github-toc-h2 { padding-left:  30px !important; font-weight:   bold; }\n.github-toc-h3 { padding-left:  50px !important; font-weight: normal; }\n.github-toc-h4 { padding-left:  70px !important; font-weight: normal; }\n.github-toc-h5 { padding-left:  90px !important; font-weight: normal; }\n.github-toc-h6 { padding-left: 110px !important; font-weight: normal; }\n\n.github-toc-entry.select-menu-item {\n    color: black !important;\n    border: none !important;\n    line-height: 1.0;\n}\n\n.github-toc-entry.select-menu-item.navigation-focus { color: white !important; }\n\n.github-toc-backlink { color: black !important; display: none; }\n.github-toc-backlink > svg { vertical-align: middle; }\n\nh1:hover > .github-toc-backlink,\nh2:hover > .github-toc-backlink,\nh3:hover > .github-toc-backlink,\nh4:hover > .github-toc-backlink,\nh5:hover > .github-toc-backlink,\nh6:hover > .github-toc-backlink { display: block; }\n';

var style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

var extPrefix = 'github-toc';
var anchorIdGitHubPrefix = 'user-content-';

var templates = {
  // Inserted with gulp
  toc      : '<span id="github-toc-container" class="select-menu js-menu-container js-select-menu">\n    <span class="btn btn-sm select-menu-button js-menu-target css-truncate" title="Outline" role="button" aria-label="Show Outline" tabindex="0" aria-haspopup="true">\n        <svg aria-hidden="true" class="octicon octicon-book" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n            <path d="M2 5h4v1H2v-1z m0 3h4v-1H2v1z m0 2h4v-1H2v1z m11-5H9v1h4v-1z m0 2H9v1h4v-1z m0 2H9v1h4v-1z m2-6v9c0 0.55-0.45 1-1 1H8.5l-1 1-1-1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h5.5l1 1 1-1h5.5c0.55 0 1 0.45 1 1z m-8 0.5l-0.5-0.5H1v9h6V3.5z m7-0.5H8.5l-0.5 0.5v8.5h6V3z"></path>\n        </svg>\n        <span class="github-toc-title" class="js-select-button css-truncate-target"></span>\n    </span>\n    <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">\n        <div class="select-menu-modal">\n            <div class="select-menu-header">\n                <span class="select-menu-title">Outline</span>\n                <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12">\n                    <path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z"></path>\n                </svg>\n            </div>\n            <div id="github-toc-entries" class="select-menu-list" role="menu">\n                <div class="select-menu-no-results">Nothing to show</div>\n            </div>\n        </div>\n    </div>\n</span>\n',
  entry    : '<a class="github-toc-entry select-menu-item js-navigation-item js-navigation-open" href="">\n    <span class="select-menu-item-text css-truncate-target" title=""></span>\n</a>\n',
  backlink : '<a href="#github-toc-container" class="github-toc-backlink right">\n    <svg aria-hidden="true" class="octicon octicon-chevron-up" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16">\n        <path d="M10 9l-1.5 1.5-3.5-3.75L1.5 10.5 0 9l5-5 5 5z" />\n    </svg>\n</a>\n'
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

})();