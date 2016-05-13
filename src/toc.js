
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
