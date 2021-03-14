import { queueProcessor } from "./queue-processor";

describe("queue-processor tests", function () {
  it("processes single item", async function () {
    const fn = jest.fn();
    const { add } = queueProcessor(fn);
    add(1);

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
        ],
      ]
    `);
  });

  it("processes multiple items", async function () {
    const fn = jest.fn();
    const { add } = queueProcessor(fn);
    add(1);
    add(2);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
        ],
        Array [
          2,
        ],
      ]
    `);
  });

  it("processes multiple items with thread sleep between", async function () {
    const fn = jest.fn();
    const { add } = queueProcessor(fn);
    add(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    add(2);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
        ],
        Array [
          2,
        ],
      ]
    `);
  });
});
