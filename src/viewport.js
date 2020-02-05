"use strict";

import { Vec2 } from "/src/vec2.js";

export class Viewport {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
  }
  toViewport(pos) {
    return new Vec2(pos.x/innerWidth*this.width+this.x, pos.y/innerHeight*this.height+this.y);
  }
  fromViewport(pos) {
    return new Vec2((pos.x-this.x)/this.width*innerWidth, (pos.y-this.y)/this.height*innerHeight);
  }
}
