"use strict";

import { Vec2 } from "./vec2.js";

const nodeSize = 0.1;

class PathNode {
  constructor(pos, r) {
    this.position = new Vec2(pos.x, pos.y);
    this.rotation = r;
    this.actions = [];
    this.tail = true;
  }
}

export class Path {
  constructor(pos, name) {
    this.nodes = [new PathNode(pos, 0)];
    this.name = name;
  }
  addNode(pos) {
    const lastNode = this.nodes[this.nodes.length-1];
    lastNode.tail = false;
    const rotation = Math.atan2(lastNode.position.y-pos.y, lastNode.position.x-pos.x);
    const newNode = new PathNode(pos, rotation);
    this.nodes.push(newNode);
    return newNode;
  }
  selectNode(pos, tail) {
    let closest = false;
    let closestDist = nodeSize;
    for (const node of this.nodes) {
      const dist = Math.sqrt((node.position.x-pos.x)**2 + (node.position.y-pos.y)**2);
      if (dist < closestDist && (!tail || node.tail)) {
        closest = node;
        closestDist = dist;
      }
    }
    return closest;
  }
  draw(target) {
    let first = true;
    for (const node of this.nodes) {
      const pos = target.viewport.fromViewport(node.position);
      if (first) {
        target.context.moveTo(pos.x, pos.y);
        first = false;
      } else {
        target.context.lineTo(pos.x, pos.y);
      }
    }
    target.context.stroke();
  }
}
