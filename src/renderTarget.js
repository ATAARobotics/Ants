"use strict";

import { Vec2 } from "/src/vec2.js";
import { Viewport } from "/src/viewport.js";

export class RenderTarget {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.size = new Vec2(0, 0);
    this.viewport = new Viewport(this.size);
  }
  resize() {
    this.size.x = this.canvas.offsetWidth;
    this.size.y = this.canvas.offsetHeight;
    this.canvas.width = this.size.x;
    this.canvas.height = this.size.y;
  }
}
