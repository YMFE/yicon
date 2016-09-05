Array.from = Array.from || function arrayFrom(value) {
  const arr = [];
  value.forEach(v => arr.push(v));
  return arr;
};

Element.prototype.remove = Element.prototype.remove || function elementRemove() {
  this.parentElement.removeChild(this);
};

NodeList.prototype.remove = NodeList.prototype.remove || function nodeRemove() {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};
