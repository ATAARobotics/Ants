"use strict";

import { Vec2 } from "/src/vec2.js";

class MouseButtonState {
  constructor(x, y, held) {
    this.lastPos = new Vec2(x, y); // the position when the button was pressed or released.
    this.held = held;
  }
}

export class MouseState {
  constructor(canvas) {
    this.currentPos = new Vec2();
    this.currentHeld = [false, false, false];
    this.downListener = canvas.addEventListener("mousedown", ev => {
      if (ev.button >= 0 && ev.button <= 2) {
        this.currentHeld[ev.button] = new MouseButtonState(ev.clientX, ev.clientY, true);
      }
    });
    this.upListener = canvas.addEventListener("mouseup", ev => {
      if (ev.button >= 0 && ev.button <= 2) {
        this.currentHeld[ev.button] = new MouseButtonState(ev.clientX, ev.clientY, false);
      }
    });
    this.moveListener = canvas.addEventListener("mousemove", ev => {
      this.currentPos.x = ev.clientX;
      this.currentPos.y = ev.clientY;
    });
    this.contextMenuStopper = canvas.addEventListener("contextmenu", ev => {
      ev.preventDefault();
    });
  }
}
