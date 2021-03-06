import d3 from 'npm:d3';

d3.selection.prototype.enterUpdate = function({enter, update, exit, removeOnExit = true}) {

  let enterSel;
  if (enter) {
    enterSel = enter(this.enter());
  }

  if (update) {
    enterSel && update(enterSel);
    update(this);
  }

  if (exit) {
    exit(this.exit());
  } else if (removeOnExit) {
    this.exit().remove();
  }

  return this;
  
};

d3.selection.prototype.nodes = function(){
   var nodes = new Array(this.size()), i = -1;
   this.each(function() { nodes[++i] = this; });
   return nodes;
 }


d3.selection.prototype.eachWithArgs = function(callback, ...args) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.apply(node, args.concat([node.__data__, i, group]));
    }
  }

  return this;
}

d3.selection.prototype.selectOrCreate = function(selector, createFn) {
  let sel = this.select(selector);
  return (!sel.empty() && sel) || createFn.call(this);
}

d3.selection.prototype.closestParent = function(selector) {
    let candidates = Array.prototype.slice.apply(document.querySelectorAll(selector));
    for (let n = this.node(); n.parentElement; n = n.parentElement) {
      if (candidates.indexOf(n) !== -1) return d3.select(n);
    }
    return d3.select({});
};

/* return children elements undere point that matches querySelector */
d3.selection.prototype.selectUnderPoint = function(selector, [x, y]) {
  let candidates = Array.prototype.slice.apply(this.node().querySelectorAll(selector)),
      processed = [];
   
    for (let el = document.elementFromPoint(x, y); el && el != document.documentElement; el = document.elementFromPoint(x, y)) {
      if (el.tagName === "tspan") {
        el = el.parentElement;
      }
      processed.push({el, pointerEvents: el.style.pointerEvents});
      el.style.pointerEvents = 'none';
    }

  return d3.selectAll(
    processed
      .map( proc => (proc.el.style.pointerEvents = proc.pointerEvents, proc.el) )
      .filter( el => candidates.indexOf(el) !== -1 )
      .reverse()
    );

}
