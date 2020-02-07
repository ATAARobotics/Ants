"use strict";

import { Viewport } from "/src/viewport.js";
import { Vec2 } from "/src/vec2.js";
import { MouseState } from "/src/mouse.js";
import { Project } from "/src/project.js";

/// Non-project specific stuff goes in this file, and a basic wrapper for easy canvas use.

const field = new Image();
field.src = "/field.png";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const canvasContext = canvas.getContext("2d");
  const projectName = document.getElementById("project-name");
  canvasContext.imageSmoothingEnabled = false;
  const canvasSize = new Vec2(0, 0);
  const vp = new Viewport(canvasSize);
  const mouseState = new MouseState(canvas, vp);
  let project = new Project(canvas, canvasContext, mouseState, vp);
  vp.size = Math.min(canvas.offsetWidth, canvas.offsetHeight*2);
  setInterval(() => {
    canvasSize.x = canvas.offsetWidth;
    canvasSize.y = canvas.offsetHeight;
    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;
    const pos = vp.fromViewport(new Vec2(0, 0));
    const size = vp.size;
    canvasContext.drawImage(field, pos.x-size/2, pos.y-size/4, size, size/2);
    vp.drag(mouseState);
    project.draw();
  }, 16);
  projectName.addEventListener("keyup", () => document.getElementById("title").innerText = `ANTS · ${projectName.value || "Unnamed"}`);
  projectName.addEventListener("blur", () => {
    if (projectName.value.trim() === "") {
      projectName.value = "Unnamed";
    }
  });
  canvas.addEventListener("wheel", ev => vp.zoom(new Vec2(ev.clientX-canvas.offsetLeft, ev.clientY-canvas.offsetTop), 2**(-ev.deltaY/100)));
  document.getElementById("recenter").addEventListener("click", () => {
    vp.size = Math.min(canvas.offsetWidth, canvas.offsetHeight*2);
    vp.pos.x = 0;
    vp.pos.y = 0;
  });
});
