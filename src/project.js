"use strict";

import { Path } from "/src/path.js";

export class Project {
  constructor(canvas, context, mouseState, viewport) {
    this.canvs = canvas;
    this.canvasContext = context;
    this.viewport = viewport;
    this.mouseState = mouseState;
    this.paths = [];
    this.selected = false;
  }
  draw() {
    if (this.mouseState.held[0].held || this.mouseState.held[2].held) {
      if (!this.selected) {
        let snappedNode = false;
        let snappedPath = false;
        for (const path of this.paths) {
          const node = path.selectNode();
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
            selectedPath = new Path(this.canvasContext, this.viewport, this.mouseState.position.x, this.mouseState.position.y);
            this.paths.push(selectedPath);
          }
          this.selected = selectedPath.addNode(this.mouseState.position.x, this.mouseState.position.y);
        } else if (this.mouseState.held[2].held) {

        }
      }
    }
    if (this.selected) {
      this.selected.position.x = this.mouseState.position.x;
      this.selected.position.y = this.mouseState.position.y;
    }
    for (const path of this.paths) {
      path.draw();
    }
  }
}
