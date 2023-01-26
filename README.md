# postcss-split-selectors

[PostCSS] plugin that splits selectors by comma, then merges the same selectors under the same parent **ignoring adjacency**.

[postcss]: https://github.com/postcss/postcss

```css
.a {
  p0: v0;
}
.a,
.b {
  .d {
    p1: v1;
  }
  p2: v2;
  .c,
  .d {
    p3: v3;
  }
  .c {
    p4: v4;
  }
}
.b {
  p5: v5;
}
```

```css
.a {
  p0: v0;
  .d {
    p1: v1;
    p3: v3;
  }
  p2: v2;
  .c {
    p3: v3;
    p4: v4;
  }
}
.b {
  .d {
    p1: v1;
    p3: v3;
  }
  p2: v2;
  .c {
    p3: v3;
    p4: v4;
  }
  p5: v5;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-split-selectors
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-split-selectors'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
