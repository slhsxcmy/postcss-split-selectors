/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  opts; // suppress warning

  return {
    postcssPlugin: "postcss-split-selectors",

    Once(root) {
      // split selectors by comma
      root.walk((node) => {
        if (!!node.selectors && node.selectors.length > 1) {
          node.selectors.reverse().forEach((selector) => {
            node.cloneAfter({ selector }); // cloneAfter to recurse
          });

          node.remove();
        }
      });
    },
  };
};

module.exports.postcss = true;
