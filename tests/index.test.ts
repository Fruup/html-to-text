import { expect, test } from "bun:test";
import { htmlToText } from "../src";

test("with inner tags", () => {
  const { output, map } = htmlToText("hello <div>world</div>!");

  expect(output).toEqual("hello world!");
  expect(map).toEqual([
    [0, 0],
    [11, 6],
    [22, 11],
  ]);
});

test("with starting tag", () => {
  const { output, map } = htmlToText("<div>hello</div> world!");

  expect(output).toEqual("hello world!");
  expect(map).toEqual([
    [5, 0],
    [16, 5],
  ]);
});

test("with escaped symbols", () => {
  const result = htmlToText("hello &lt;div&gt;world&lt;/div&gt;!");

  expect(result.output).toEqual("hello <div>world</div>!");
  expect(result.map).toEqual([[0, 0]]);
});
