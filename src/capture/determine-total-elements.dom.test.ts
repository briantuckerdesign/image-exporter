import { test, expect } from "bun:test";
import { determineTotalElements } from "./determine-total-elements";
import { defaultConfig } from "../config";

function div(scale?: string): HTMLElement {
  const el = document.createElement("div");
  if (scale !== undefined) el.dataset.scale = scale;
  return el;
}

/**
 * Bug #5: progress total must match the number of captures that will actually
 * happen. Each element captures at least once; a comma-list captures once per
 * scale. The old version skipped (counted 0 for) elements with no data-scale.
 */
test("element with no data-scale counts as 1", async () => {
  expect(await determineTotalElements([div()], defaultConfig)).toBe(1);
});

test("element with a single scale counts as 1", async () => {
  expect(await determineTotalElements([div("2")], defaultConfig)).toBe(1);
});

test("element with a multi-scale list counts once per scale", async () => {
  expect(await determineTotalElements([div("1,2,3")], defaultConfig)).toBe(3);
});

test("invalid scale falls back to one capture", async () => {
  expect(await determineTotalElements([div("nope")], defaultConfig)).toBe(1);
});

test("mixed elements sum correctly", async () => {
  const els = [div(), div("1,2"), div("nope")]; // 1 + 2 + 1
  expect(await determineTotalElements(els, defaultConfig)).toBe(4);
});

test("no data-scale uses config.scale array length", async () => {
  const config = { ...defaultConfig, scale: [1, 2] };
  expect(await determineTotalElements([div()], config)).toBe(2);
});
