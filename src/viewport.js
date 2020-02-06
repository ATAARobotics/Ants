"use strict";

import { Vec2 } from "/src/vec2.js";

export class Viewport {
  constructor(canvasSize) {
    this.pos = new Vec2();
    this.size = 1;
    this.canvasSize = canvasSize;
  }
  toViewport(pos) {
    return new Vec2((pos.x-this.canvasSize.x/2)/this.size+this.pos.x, (this.canvasSize.y/2-pos.y)/this.size+this.pos.y);
  }
  fromViewport(pos) {
    return new Vec2((pos.x-this.pos.x)*this.size+this.canvasSize.x/2, this.canvasSize.y/2-(pos.y-this.pos.y)*this.size);
  }
  zoom(oldPosition, factor) {
    console.log(oldPosition);
    const lockPosition = this.toViewport(oldPosition);
    this.size *= factor;
    const newPosition = this.fromViewport(lockPosition);
    const diff = new Vec2(oldPosition.x-newPosition.x, oldPosition.y-newPosition.y);
    this.pos.x -= diff.x/this.size;
    this.pos.y += diff.y/this.size;
    const finalPosition = this.fromViewport(lockPosition);
  }
}
