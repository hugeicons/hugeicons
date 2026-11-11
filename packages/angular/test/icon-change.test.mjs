import { test } from "node:test";
import assert from "node:assert/strict";
import { Worker } from "node:worker_threads";

const chevronDown = [["path", { d: "M18 9L12 15L6 9", stroke: "currentColor", key: "0" }]];
const chevronUp = [["path", { d: "M18 15L12 9L6 15", stroke: "currentColor", key: "0" }]];
const duotone = [
  ["path", { d: "M2 12H22", stroke: "currentColor", key: "0" }],
  ["circle", { cx: "12", cy: "12", r: "4", fill: "currentColor", opacity: "0.4", key: "1" }],
];

/**
 * Renders each icon in turn in a worker. A render that never returns is a synchronous
 * loop, so the worker is killed and the test fails instead of hanging.
 */
function render(animations, icons, { setupMs = 30_000, renderMs = 2_000 } = {}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./render-worker.mjs", import.meta.url), {
      workerData: { animations, icons },
    });
    const fail = (error) => {
      clearTimeout(timer);
      worker.terminate();
      reject(error);
    };
    let timer = setTimeout(() => fail(new Error("worker setup timed out")), setupMs);
    worker.on("message", (message) => {
      clearTimeout(timer);
      if (message.ready) {
        timer = setTimeout(
          () => fail(new Error(`rendering ${icons.length} icons took over ${renderMs}ms`)),
          renderMs,
        );
      } else {
        worker.terminate();
        resolve(message.snapshots);
      }
    });
    worker.once("error", fail);
  });
}

for (const animations of ["none", "noop", "animations"]) {
  test(`changing the icon replaces its children (animations: ${animations})`, async () => {
    const [down, up, downAgain, layered] = await render(animations, [
      chevronDown,
      chevronUp,
      chevronDown,
      duotone,
    ]);

    assert.match(down, /^<path d="M18 9L12 15L6 9"[^>]*><\/path>$/);
    assert.match(up, /^<path d="M18 15L12 9L6 15"[^>]*><\/path>$/);
    assert.equal(downAgain, down);
    // the secondary (opacity) layer is drawn first
    assert.match(layered, /^<circle [^>]*opacity="0.4"[^>]*><\/circle><path d="M2 12H22"[^>]*><\/path>$/);
  });
}
