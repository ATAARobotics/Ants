"use strict";

import { Path } from "./path.js";
import { Vec2 } from "./vec2.js";

const field = new Image();
field.src = "./field.png";

export class Project {
  constructor(mouseState, viewport) {
    this.viewport = viewport;
    this.mouseState = mouseState;
    this.paths = [];
    this.selected = false;

    this.mouseState.onDown(() => {
      if (!this.selected) {
        let snappedNode = false;
        let snappedPath = false;
        for (const path of this.paths) {
          const node = path.selectNode(this.mouseState.position, true);
          if (node) {
            snappedNode = node;
            snappedPath = path;
            break;
          }
        }
        if (this.mouseState.held[0].held) {
          let selectedPath;
          if (snappedNode && snappedNode.tail) {
            selectedPath = snappedPath;
          } else {
            selectedPath = new Path(this.mouseState.position, this.paths.length.toString());
            this.paths.push(selectedPath);
          }
          this.selected = selectedPath.addNode(this.mouseState.position);
        } else if (this.mouseState.held[2].held) {

        }
      } else {
        this.selected = false;
      }
    });
  }
  draw(target) {
    const pos = target.viewport.fromViewport(new Vec2(0, 0));
    const size = target.viewport.size;
    target.context.drawImage(field, pos.x-size/2, pos.y-size/4, size, size/2);
    if (this.selected) {
      this.selected.position.x = this.mouseState.position.x;
      this.selected.position.y = this.mouseState.position.y;
    }
    for (const path of this.paths) {
      path.draw(target);
    }
  }
}
