"use strict";

import { Vec2 } from "./vec2.js";

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
    newNode.previous = lastNode;
    this.nodes.push(newNode);
    return newNode;
  }
  selectNode(pos, tail, nodeSize) {
    let closest = false;
    let closestDist = nodeSize;
    for (const node of this.nodes) {
      const dist = Math.sqrt((node.position.x-pos.x)**2 + (node.position.y-pos.y)**2);
      if (dist < closestDist && (!tail || node.tail)) {
        closest = node;
        closestDist = dist;
      }
    }
    return [closest, closestDist];
  }
  draw(target) {
    let first = true;
    target.context.beginPath();
    target.context.strokeStyle = "#000000";
    target.context.lineWidth = 3;
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
    target.context.beginPath();
    target.context.strokeStyle = "#ff0000";
    target.context.lineWidth = 5;
    for (const node of this.nodes) {
      const pos = target.viewport.fromViewport(node.position);
      arrow(target.context, pos, node.rotation);
    }
    target.context.stroke();
  }
}

function arrow(ctx, pos, rot) {
  const size = 10;
  ctx.moveTo(pos.x+Math.sin(rot+Math.PI)/5*size, pos.y+Math.cos(rot+Math.PI)/5*size);
  ctx.lineTo(pos.x+Math.sin(rot-Math.PI/2)*size, pos.y+Math.cos(rot-Math.PI/2)*size);
  ctx.lineTo(pos.x+Math.sin(rot)/5*size, pos.y+Math.cos(rot)/5*size);
}
