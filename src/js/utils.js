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

