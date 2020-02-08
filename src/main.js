"use strict";

import { Vec2 } from "/src/vec2.js";
import { MouseState } from "/src/mouse.js";
import { Project } from "/src/project.js";
import { RenderTarget } from "/src/renderTarget.js";
import { registerButtons } from "/src/export.js";

/// Non-project specific stuff goes in this file, and a basic wrapper for easy canvas use.

window.addEventListener("load", () => {
  const canvas = new RenderTarget(document.getElementById("canvas"));
  const projectName = document.getElementById("project-name");
  const mouseState = new MouseState(canvas.canvas, canvas.viewport);
  let project = new Project(canvas.canvas, canvas.context, mouseState, canvas.viewport);
  canvas.viewport.size = Math.min(canvas.canvas.offsetWidth, canvas.canvas.offsetHeight*2);
  registerButtons(project);
  setInterval(() => {
    canvas.resize();
    canvas.viewport.drag(mouseState);
    project.draw(canvas);
  }, 16);
  projectName.addEventListener("keyup", () => document.getElementById("title").innerText = `ANTS · ${projectName.value || "Unnamed"}`);
  projectName.addEventListener("blur", () => {
    if (projectName.value.trim() === "") {
      projectName.value = "Unnamed";
    }
  });
  canvas.canvas.addEventListener("wheel", ev => canvas.viewport.zoom(new Vec2(ev.clientX-canvas.canvas.offsetLeft, ev.clientY-canvas.canvas.offsetTop), 2**(-ev.deltaY/100)));
  document.getElementById("recenter").addEventListener("click", () => {
    canvas.viewport.size = Math.min(canvas.canvas.offsetWidth, canvas.canvas.offsetHeight*2);
    canvas.viewport.pos.x = 0;
    canvas.viewport.pos.y = 0;
  });
});
