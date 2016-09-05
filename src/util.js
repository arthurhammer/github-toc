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
