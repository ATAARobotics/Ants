"use strict";

const options = document.getElementById("options-panel");
export function registerOptionButtons(project) {
  const hideButton = document.getElementById("hide-options");
  hideButton.addEventListener("click", () => options.style.display = "none");
}

const nameElement = document.createElement("p");
nameElement.innerText = "Path Name:";
nameElement.className = "label";
const rotationElement = document.createElement("p");
rotationElement.innerText = "Node Rotation:";
rotationElement.className = "label";
export function openOptionPanel(configuring) {
  const toDelete = [];
  for (const element of document.getElementsByClassName("delete")) {
    toDelete.push(element);
  }
  for (const element of toDelete) {
    element.parentElement.removeChild(element);
  }
  options.style.display = "block";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Path name";
  nameInput.value = configuring.path.name;
  nameInput.className = "action delete";
  nameInput.addEventListener("keyup", () => configuring.path.name = nameInput.value);
  options.appendChild(nameElement);
  options.appendChild(nameInput);
  const rotationInput = document.createElement("input");
  rotationInput.type = "range";
  rotationInput.value = configuring.node.rotation;
  rotationInput.className = "action delete";
  rotationInput.min = -Math.PI;
  rotationInput.max = Math.PI;
  rotationInput.step = 0.001;
  rotationInput.addEventListener("mousemove", () => configuring.node.rotation = parseFloat(rotationInput.value));
  configuring.node.rotationElement = rotationInput;
  options.appendChild(rotationElement);
  options.appendChild(rotationInput);
  const shootDiv = document.createElement("label");
  shootDiv.className = "action input-container delete";
  const shootInput = document.createElement("input");
  shootInput.type = "checkbox";
  shootInput.className = "hidden";
  const shootDisplay = document.createElement("span");
  shootDisplay.className = "input-display";
  shootDisplay.innerText = "Shoot";
  shootInput.checked = configuring.node.shoot;
  shootDisplay.addEventListener("mouseup", () => configuring.node.shoot = !shootInput.checked);
  shootDiv.appendChild(shootInput);
  shootDiv.appendChild(shootDisplay);
  options.appendChild(shootDiv);
}
