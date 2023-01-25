const postcss = require("postcss");

const plugin = require("./");

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it("does something", async () => {
  await run(
    `
.a, .b {
  p1: v1;
  .c, .d {
    p2: v2;
  }
}
    `,
    `
.a {
  p1: v1;
  .c {
    p2: v2;
  }
  .d {
    p2: v2;
  }
}
.b {
  p1: v1;
  .c {
    p2: v2;
  }
  .d {
    p2: v2;
  }
}
    `,
    {}
  );
});
