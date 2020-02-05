"use strict";

import { Viewport } from "/src/viewport.js";
import { Vec2 } from "/src/vec2.js";

const field = new Image();
field.src = "/field.png";

window.onload = () => {
  const canvas = document.getElementById("canvas");
	const canvasContext = canvas.getContext("2d");
  canvasContext.imageSmoothingEnabled = false;
  const vp = new Viewport();
  setInterval(() => {
  	canvas.width = innerWidth;
  	canvas.height = innerHeight;
    const pos = vp.fromViewport(new Vec2(1, 1));
    canvasContext.drawImage(field, pos.x, pos.y);
  }, 16);
};
