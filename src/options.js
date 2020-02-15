"use strict";

const options = document.getElementById("options-panel");
export function registerOptionButtons(project) {
  const hideButton = document.getElementById("hide-options");
  hideButton.addEventListener("click", () => options.style.display = "none");
}

const nameElement = document.createElement("p");
nameElement.innerText = "Path Name:";
export function openOptionPanel(configuring) {
  for (const element of document.getElementsByClassName("delete")) {
    element.parentElement.removeChild(element);
  }
  options.style.display = "block";
  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "Path name");
  nameInput.value = configuring.path.name;
  nameInput.className = "action delete";
  nameInput.addEventListener("keyup", () => configuring.path.name = nameInput.value);
  options.appendChild(nameElement);
  options.appendChild(nameInput);
}
