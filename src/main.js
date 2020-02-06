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
  const vp = new Viewport();
  vp.size = innerHeight*2;
  setInterval(() => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const pos = vp.fromViewport(new Vec2(0, 0));
    const pos2 = vp.fromViewport(new Vec2(0, 0.5));
    const size = vp.size;
    canvasContext.drawImage(field, pos.x-size/2, pos.y-size/4, size, size/2);
    canvasContext.drawImage(field, pos2.x-size/2, pos2.y-size/4, size, size/2);
  }, 16);
  projectName.onkeyup = () => document.getElementById("title").innerText = `ANTS · ${projectName.value}`;
};
