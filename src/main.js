"use strict";

import { Viewport } from "/src/viewport.js";
import { Vec2 } from "/src/vec2.js";

const field = new Image();
field.src = "/field.png";

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const canvasContext = canvas.getContext("2d");
  const projectName = document.getElementById("project-name");
  canvasContext.imageSmoothingEnabled = false;
  const canvasSize = new Vec2(0, 0);
  const vp = new Viewport(canvasSize);
  vp.size = Math.min(canvas.offsetWidth, canvas.offsetHeight*2);
  setInterval(() => {
    canvasSize.x = canvas.offsetWidth;
    canvasSize.y = canvas.offsetHeight;
    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;
    const pos = vp.fromViewport(new Vec2(0, 0));
    const size = vp.size;
    canvasContext.drawImage(field, pos.x-size/2, pos.y-size/4, size, size/2);
  }, 16);
  projectName.onkeyup = () => document.getElementById("title").innerText = `ANTS · ${projectName.value}`;
  canvas.onwheel = ev => vp.zoom(new Vec2(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop), 2**(-ev.deltaY/100));
};
