const postcss = require("postcss");

const plugin = require("./");

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it("works with nested selectors", async () => {
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

it("works with multiple same siblings", async () => {
  await run(
    `
      .a {
        p0: v0;
      }
      .b {
        p1: v1;
      }
      .a {
        p2: v2;
      }
      .b {
        p3: v3;
      }
      .a {
        p4: v4;
      }
      .b {
        p5: v5;
      }
    `,
    `
      .a {
        p0: v0;
        p2: v2;
        p4: v4;
      }
      .b {
        p1: v1;
        p3: v3;
        p5: v5;
      }
    `,
    {}
  );
});

it("works on nested classes recursively", async () => {
  await run(
    `
      .a {
        .b {
          p0: v0;
        }
        .c {
          p1: v1;
        }
      }
      .a {
        .b {
          p2: v2;
        }
        .c {
          p3: v3;
        }
      }
    `,
    `
      .a {
        .b {
          p0: v0;
          p2: v2;
        }
        .c {
          p1: v1;
          p3: v3;
        }
      }
    `,
    {}
  );
});
