/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  opts; // suppress warning

  return {
    postcssPlugin: "postcss-split-selectors",

    Once(root) {
      // split selectors by comma
      // .a, .b {} -> .a {} .b {}
      root.walk((node) => {
        if (node.selectors && node.selectors.length > 1) {
          node.selectors.reverse().forEach((selector) => {
            node.cloneAfter({ selector }); // cloneAfter to recurse
          });

          node.remove();
        }
      });

      /*
                 root             root
              a1      a2    ->     a
            b1  c1  b2  c2        b c
      */
      // merge same selectors
      root.walk((node) => {
        node.raws.semicolon = true; // postcss strips final semicolon by default

        const isSameSelector = (node, next) =>
          (node.type === "rule" && next.selector === node.selector) ||
          (node.type === "atrule" &&
            next.name === node.name &&
            next.params === node.params);

        let next = node;
        while ((next = next.next())) {
          if (isSameSelector(node, next)) {
            node.append(...next.nodes);

            next = next.prev();
            next.next().remove();
          }
        }
      });
    },
  };
};

module.exports.postcss = true;
