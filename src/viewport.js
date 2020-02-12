"use strict";

import { Vec2 } from "./vec2.js";

export class Viewport {
  constructor(canvasSize) {
    this.pos = new Vec2();
    this.size = 1;
    this.canvasSize = canvasSize;
    this.dragging = false;
  }
  toViewport(pos) {
    return new Vec2((pos.x-this.canvasSize.x/2)/this.size+this.pos.x, (this.canvasSize.y/2-pos.y)/this.size+this.pos.y);
  }
  fromViewport(pos) {
    return new Vec2((pos.x-this.pos.x)*this.size+this.canvasSize.x/2, this.canvasSize.y/2-(pos.y-this.pos.y)*this.size);
  }
  zoom(oldPosition, factor) {
    const lockPosition = this.toViewport(oldPosition);
    this.size *= factor;
    const newPosition = this.fromViewport(lockPosition);
    const diff = new Vec2(oldPosition.x-newPosition.x, oldPosition.y-newPosition.y);
    this.pos.x -= diff.x/this.size;
    this.pos.y += diff.y/this.size;
  }
  drag(mouseState) {
    const middleButton = mouseState.held[1];
    if (middleButton.held) {
      this.pos.x += middleButton.lastPosition.x - mouseState.position.x;
      this.pos.y += middleButton.lastPosition.y - mouseState.position.y;
    }
  }
}
