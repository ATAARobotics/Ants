"use strict";

import { Vec2 } from "/src/vec2.js";

const nodeSize = 10;

class PathNode {
  constructor(pos, r) {
    this.position = new Vec2(pos.x, pos.y);
    this.rotation = r;
    this.actions = [];
    this.tail = true;
  }
}

export class Path {
  constructor(context, vp, pos) {
    this.canvasContext = context;
    this.viewport = vp;
    this.nodes = [new PathNode(pos, 0)];
  }
  addNode(pos) {
    const lastNode = this.nodes[this.nodes.length-1];
    lastNode.tail = false;
    const rotation = Math.atan2(lastNode.position.y-pos.y, lastNode.position.x-pos.x);
    const newNode = new PathNode(pos, rotation);
    this.nodes.push(newNode);
    return newNode;
  }
  selectNode(pos) {
    let closest = false;
    let closestDist = nodeSize;
    for (const node of this.nodes) {
      const dist = Math.sqrt((node.position.x-pos.x)**2 + (node.position.y-pos.y)**2);
      if (dist < closestDist) {
        closest = node;
        closestDist = dist;
      }
    }
    return closest;
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
