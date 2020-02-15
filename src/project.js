"use strict";

import { Path } from "./path.js";
import { Vec2 } from "./vec2.js";
import { openOptionPanel } from "./options.js";

const field = new Image();
field.src = "./field.png";

export class Project {
  constructor(mouseState, viewport) {
    this.mouseState = mouseState;
    this.paths = [];
    this.moving = false;
    this.selected = false;
    this.configuring = false;
  }
  draw(target) {
    const pos = target.viewport.fromViewport(new Vec2(0, 0));
    const size = target.viewport.size;
    target.context.drawImage(field, pos.x-size/2, pos.y-size/4, size, size/2);
    if (this.selected) {
      if (this.mouseState.held[0].held || this.mouseState.held[2].held) {
        this.selected.position.x = this.mouseState.position.x;
        this.selected.position.y = this.mouseState.position.y;
        const prev = this.selected.previous;
        if (prev) {
          const rotation = Math.atan2(prev.position.y-this.selected.position.y, prev.position.x-this.selected.position.x);
          prev.rotation = rotation;
          this.selected.rotation = rotation;
        }
      } else {
        this.selected = false;
      }
    } else {
      if (this.mouseState.held[0].held) {
        let snappedNode = false;
        let snappedPath = false;
        let snappedDist = 0.1;
        for (const id in this.paths) {
          const path = this.paths[id];
          const [node, newDist] = path.selectNode(this.mouseState.position, true, snappedDist);
          if (node && newDist < snappedDist) {
            snappedNode = node;
            snappedPath = path;
            snappedDist = newDist;
          }
        }
        let selectedPath;
        if (snappedNode && snappedNode.tail) {
          selectedPath = snappedPath;
        } else {
          selectedPath = new Path(this.mouseState.position, this.paths.length.toString());
          this.paths.push(selectedPath);
        }
        this.selected = selectedPath.addNode(this.mouseState.position);
        this.configuring = {"path": selectedPath, "node": this.selected};
        openOptionPanel(this.configuring);
      } else if (this.mouseState.held[2].held) {
        let snappedNode = false;
        let snappedPath = false;
        let snappedDist = 0.1;
        for (const id in this.paths) {
          const path = this.paths[id];
          const [node, newDist] = path.selectNode(this.mouseState.position, false, snappedDist);
          if (node && newDist < snappedDist) {
            snappedNode = node;
            snappedDist = newDist;
          }
        }
        if (snappedNode) {
          console.log("Right-click");
          this.selected = snappedNode;
          this.configuring = {"path": snappedPath, "node": snappedNode};
          openOptionPanel(this.configuring);
        }
      }
    }
    for (const path of this.paths) {
      path.draw(target, this.configuring.node);
    }
  }
}
