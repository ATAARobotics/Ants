"use strict";

import { Vec2 } from "./vec2.js";

class MouseButtonState {
  constructor(x, y, held) {
    this.lastPosition = new Vec2(x, y); // the position when the button was pressed or released.
    this.held = held;
  }
}

export class MouseState {
  constructor(canvas, vp) {
    this.position = new Vec2(0, 0);
    this.held = [];
    this.handlers = [];
    for (let i = 0; i < 3; i++) {
      this.held.push(new MouseButtonState(0, 0, false));
    }
    this.downListener = canvas.addEventListener("mousedown", ev => {
      if (ev.button >= 0 && ev.button <= 2) {
        this.held[ev.button] = new MouseButtonState(ev.clientX, ev.clientY, true);
      }
      for (const handler of this.handlers) {
        handler();
      }
    });
    this.upListener = window.addEventListener("mouseup", ev => {
      if (ev.button >= 0 && ev.button <= 2) {
        this.held[ev.button] = new MouseButtonState(ev.clientX, ev.clientY, false);
      }
    });
    this.moveListener = window.addEventListener("mousemove", ev => {
      this.position = vp.toViewport(new Vec2(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop));
    });
    this.moveListener = window.addEventListener("wheel", ev => { // Move the mouse if scrolling, as it zooms the screen.
      this.position = vp.toViewport(new Vec2(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop));
    });
    this.contextMenuStopper = canvas.addEventListener("contextmenu", ev => {
      ev.preventDefault();
    });
  }
  onDown(handler) {
    this.handlers.push(handler);
    return this.handlers.length;
  }
}
