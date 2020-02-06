"use strict";

import { Path } from "/src/path.js";

export class Project {
  constructor(canvas, context, mouseState, viewport) {
    this.canvs = canvas;
    this.canvasContext = context;
    this.viewport = viewport;
    this.mouseState = mouseState;
    this.paths = [];
  }
  draw() {
    for (const path of this.paths) {
      path.draw();
    }
  }
}
