"use strict";

const field = Image();
field.src = "field.png";

let canvasContext;

window.onload = () => {
  const canvas = document.getElementById("canvas");
	canvasContext = canvas.getContext("2d");
  canvasContext.imageSmoothingEnabled = false;
};

setInterval(() => {
  vpSize = {"x": innerWidth, "y": innerHeight};
	document.getElementById("mainCanvas").width = vpSize.x;
	document.getElementById("mainCanvas").height = vpSize.y;
  canvasContext.drawImage(field);
}, 16);
