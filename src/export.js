"use strict";

function download(filename, data) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/x-autofile;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function generateAutoFileFromFormat(format, project) {
  let fileString = "";
  if (format.version) {
    fileString += format.version + "\n";
  }
  return fileString;
}

function generateAutoFileFromFile(formatType, project, whenDone) {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", "/exports/" + formatType + ".json", false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200 || rawFile.status === 0) {
      const format = JSON.parse(rawFile.responseText);
      const data = generateAutoFileFromFormat(format, project);
      whenDone(data);
    } else if (rawFile.status !== 200) {
      alert("Auto format not found: /exports/" + formatType + ".json");
    }
  };
  rawFile.send();
}

export function registerButtons(project) {
  const typeSelector =
  document.getElementById("new-project").addEventListener("click", () => {});
  document.getElementById("export").addEventListener("click", () => {
    const type = document.getElementById("type-selector").value;
    switch (type) {
    case "save":
      break;
    case "bitmap":
      break;
    case "vector":
      break;
    case "pdf":
    case "print":
      break;
    default:
      generateAutoFileFromFile(type, project, data => download(document.getElementById("project-name").value + ".auto", data));
    }
  });
  document.getElementById("import").addEventListener("click", () => {});
  document.getElementById("preview").addEventListener("click", () => {
    alert("Not implemented yet!");
  });
}
