"use strict";

import { Vec2 } from "/src/vec2.js";

export class Viewport {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 1;
  }
  toViewport(pos) {
    return new Vec2((pos.x-innerWidth/2)/this.size+this.x, (innerHeight/2-pos.y)/this.size+this.y);
  }
  fromViewport(pos) {
    return new Vec2((pos.x-this.x)*this.size+innerWidth/2, innerHeight/2-(pos.y-this.y)*this.size);
  }
}
