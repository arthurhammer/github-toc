var TableOfContents = (function() {

    var defaults = {
        target: 'body', // Table of contents container (selector or Element)
        scope: 'body', // Headings container (selector or Element)
        selector: 'h1, h2, h3, h4, h5, h6', // Headings selector
        entryTagType: 'li',
        prefix: 'toc',
            title: function(i, heading) {
            return heading.textContent.trim();
        },
        entryClass: function(i, heading, prefix) {
            return prefix + '-' + heading.tagName.toLowerCase();
        },
        anchorID: function(i, heading, prefix) {
            // For now, existing id on headings is expected. Might handle missing ones later.
            return heading.id;
        },
        entryElement: function(i, heading, config) { // Creates the actual toc entry element
            var entry = document.createElement(config.entryTagType);
            var a = document.createElement('a');
            a.classList.add(config.entryClass);
            a.title = config.title;
            a.textContent = config.title;
            a.href = '#' + config.anchorID;
            entry.appendChild(a);
            return entry;
        }
    };

    function toc(options) {
        options = extend({}, defaults, options);

        var target = getElement(options.target);
        var scope = getElement(options.scope);
        if (!target || !scope) return null;
        var headings = scope.querySelectorAll(options.selector);

        for (var i = 0; i < headings.length; i++) {
            var h = headings[i];
            var anchorID = options.anchorID(i, h, options.prefix);
            if (!anchorID) continue; // TODO

            // 1) can break CSS and other stuff
            // 2) entryElement is called after and might modify the desired anchorID
            if (anchorID != h.id) {
                var anchor = document.createElement('span');
                anchor.id = anchorID;
                anchor.classList.add(options.prefix + '-anchor');
                h.insertBefore(anchor, h.firstChild);
            }

            var element = options.entryElement(i, h, {
                entryTagType: options.entryTagType,
                prefix: options.prefix,
                title: options.title(i, h),
                entryClass: options.entryClass(i, h, options.prefix),
                anchorID: anchorID
            });

            if (element) target.appendChild(element);
        }

        return target;
    }

    function getElement(element) {
        return (typeof element === 'string') ? document.querySelector(element) : element;
    }

    // from http://youmightnotneedjquery.com/#extend
    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i]) continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
            }
        }

        return out;
    }

    return {
        defaults: defaults,
        toc: toc
    };

})();
