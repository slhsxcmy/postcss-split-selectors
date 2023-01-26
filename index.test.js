const postcss = require("postcss");

const plugin = require("./");

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it("works", async () => {
  await run(
    `
      .a {
        p0: v0;
      }
      .a, .b {
        .d {
          p1: v1;
        }
        p2: v2;
        .c, .d {
          p3: v3;
        }
        .c {
          p4: v4;
        }
      }
      .b {
        p5: v5;
      }
    `,
    `
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
    `,
    {}
  );
});
