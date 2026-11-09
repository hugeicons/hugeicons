// Renders <hugeicons-icon> in jsdom, switches its icon, and posts the svg markup
// after each render. Runs in a worker thread so the test can kill a render that
// never finishes (a synchronous loop can't be interrupted from the same thread).
import { parentPort, workerData } from "node:worker_threads";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!doctype html><html><body></body></html>");
for (const key of ["window", "document", "Node", "Element", "HTMLElement", "SVGElement", "Event", "KeyboardEvent", "MouseEvent", "getComputedStyle"]) {
  globalThis[key] = key === "window" ? window : window[key];
}

await import("@angular/compiler");
const { NgZone, createComponent, ɵNoopNgZone: NoopNgZone } = await import("@angular/core");
const { createApplication } = await import("@angular/platform-browser");
const { provideAnimations, provideNoopAnimations } = await import(
  "@angular/platform-browser/animations"
);
const { HugeiconsIconComponent } = await import("../dist/fesm2022/hugeicons-angular.mjs");

const providers = {
  none: [],
  noop: [provideNoopAnimations()],
  animations: [provideAnimations()],
}[workerData.animations];

// No zone.js here; change detection is driven by app.tick() below
const app = await createApplication({
  providers: [{ provide: NgZone, useClass: NoopNgZone }, ...providers],
});
const hostElement = document.createElement("div");
document.body.appendChild(hostElement);

const ref = createComponent(HugeiconsIconComponent, {
  environmentInjector: app.injector,
  hostElement,
});
app.attachView(ref.hostView);

parentPort.postMessage({ ready: true });

const snapshots = [];
for (const icon of workerData.icons) {
  ref.setInput("icon", icon);
  app.tick();
  snapshots.push(hostElement.querySelector("svg").innerHTML);
}

parentPort.postMessage({ snapshots });
