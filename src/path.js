"use strict";

import { Vec2 } from "/src/vec2.js";

const nodeSize = 10;

class PathNode {
  constructor(x, y, r) {
    this.pos = new Vec2(x, y);
    this.rotation = r;
    this.actions = [];
  }
}

export class Path {
  constructor(context, vp, x, y) {
    this.canvasContext = context;
    this.viewport = vp;
    this.nodes = [new PathNode(x, y, 0)];
  }
  addNode(x, y) {
    const lastPos = this.nodes[this.nodes.length-1].pos;
    const rotation = Math.atan2(lastPos.y-y, lastPos.x-x);
    this.nodes.push(new PathNode(x, y, rotation));
  }
  selectNode(x, y) {
    for (const node of this.nodes) {
      if (Math.sqrt((node.pos.x-x)**2 + (node.pos.y-y)**2) < nodeSize) {

      }
    }
  }
  draw() {
    let first = true;
    for (const node of this.nodes) {
      const pos = this.viewport.fromViewport(new Vec2(node.pos.x, node.pos.y));
      if (first) {
        this.canvasContext.moveTo(pos.x, pos.y);
        first = false;
      } else {
        this.canvasContext.lineTo(pos.x, pos.y);
      }
    }
    this.canvasContext.stroke();
  }
}
