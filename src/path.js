"use strict";

import { Vec2 } from "/src/vec2.js";

const nodeSize = 10;

class PathNode {
  constructor(x, y, r) {
    this.position = new Vec2(x, y);
    this.rotation = r;
    this.actions = [];
    this.tail = true;
  }
}

export class Path {
  constructor(context, vp, x, y) {
    this.canvasContext = context;
    this.viewport = vp;
    this.nodes = [new PathNode(x, y, 0)];
  }
  addNode(x, y) {
    const lastNode = this.nodes[this.nodes.length-1];
    lastNode.tail = false;
    const rotation = Math.atan2(lastNode.position.y-y, lastNode.position.x-x);
    const newNode = new PathNode(x, y, rotation);
    this.nodes.push(newNode);
    return newNode;
  }
  selectNode(x, y) {
    for (const node of this.nodes) {
      if (Math.sqrt((node.position.x-x)**2 + (node.position.y-y)**2) < nodeSize) {
        return node;
      }
    }
    return false;
  }
  draw() {
    let first = true;
    for (const node of this.nodes) {
      const pos = this.viewport.fromViewport(node.position);
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
