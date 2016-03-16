Node.prototype.prependChild = function(element) {
  return this.firstChild ? this.insertBefore(element, this.firstChild) : this.appendChild(element);
};

HTMLElement.prototype.arrive = function(selectors, existing, callback) {  // TODO
  function checkMutations() {
    var target = query(selectors);
    if (target) callback.call(target, target);
  }

  new MutationObserver(checkMutations)
  .observe(this, { childList: true, subtree: true });

  if (existing) checkMutations();
};

function toElement(str) {
  var d = document.createElement('div');
  d.innerHTML = str;
  return d.firstChild;
}

function query(selector, scope) {
  return (scope || document).querySelector(selector);
}
