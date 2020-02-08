"use strict";

import { Vec2 } from "./vec2.js";
import { RenderTarget } from "./renderTarget.js";
import { Project } from "./project.js";
import { Path } from "./path.js";

function loadJson(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200 || rawFile.status === 0) {
      const object = JSON.parse(rawFile.responseText);
      if (object) {
        callback(object);
      } else {
        alert("Error: JSON Config parse failed: " + file);
      }
    } else if (rawFile.status !== 200) {
      alert("Error: JSON Config not found: " + file);
    }
  };
  rawFile.send();
}

let units = {};
loadJson("./exports/units.json", data => units = data);

function download(filename, data) {
  const element = document.createElement('a');
  element.setAttribute('href', data);
  element.setAttribute('download', filename);

  element.click();
}

function upload(callback) {
  const element = document.createElement("input");
  element.setAttribute("type", "file");
  element.setAttribute("accept", ".ants");

  element.click();

  element.addEventListener("change", ev => {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = readerEvent => {
      const content = readerEvent.target.result;
      callback(content);
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function generateAuto(format, project) {
  let fileString = "";
  const writeCommand = (verb, nouns) => {
    fileString += format.commandPrefix + verb + format.verbNounSeparator;
    let first = true;
    for (const noun of nouns) {
      if (!first) {
        fileString += format.verbSeparator;
      }
      fileString += format.nouns[noun.type].filePrefix + noun.value.toString() + format.nouns[noun.type].fileSuffix;
    }
    fileString += format.commandSuffix;
  };
  if (format.version) {
    fileString += format.version + "\n";
  }
  const forwardVerb = format.verbs[format.driveForwardVerb];
  const backwardVerb = format.verbs[format.driveBackwardVerb];
  const rotationVerb = format.verbs[format.rotateVerb];
  const forwardUnit = forwardVerb.parameters[0].types[0];
  const backwardUnit = backwardVerb.parameters[0].types[0];
  const rotationUnit = rotationVerb.parameters[0].types[0];
  for (const path of project.paths) {
    fileString += format.pathStartPrefix + (format.pathStartName ? path.name : "") + format.pathStartSuffix;
    let first = true;
    let currentRotation = 0;
    let currentPosition = new Vec2(0, 0);
    for (const node of path.nodes) {
      let rotation = (Math.atan2(currentPosition.y-node.position.y, currentPosition.x-node.position.x) + Math.PI) /
        units.radians.ratio * units[rotationUnit].ratio;
      const lastRotation = currentRotation;
      currentRotation = rotation;
      if (format.relativeRotate) {
        rotation -= lastRotation;
      }
      if (format.reverseRotate) {
        rotation *= -1;
      }
      let dist = Math.sqrt((currentPosition.x-node.position.x)**2 + (currentPosition.y-node.position.y)**2) * units.field.ratio;
      if (!format.driveBackwardNegative) {
        dist = Math.abs(dist);
      }
      if (dist > 0) {
        dist /= units[forwardUnit].ratio;
      } else {
        dist /= units[backwardUnit].ratio;
      }
      if (!first) {
        writeCommand(format.rotateVerb, [{"type": rotationUnit, "value": rotation}]);
        if (dist > 0) {
          writeCommand(format.driveForwardVerb, [{"type": forwardUnit, "value": dist}]);
        } else {
          writeCommand(format.driveBackwardVerb, [{"type": backwardUnit, "value": dist}]);
        }
      }
      currentPosition = node.position;
      // currentRotation = node.rotation;
      first = false;
    }
    fileString += format.pathEndPrefix + (format.pathEndName ? path.name : "") + format.pathEndPrefix;
  }
  return fileString;
}

const field = new Image();
field.src = "./field.png";

function generateSvg(project) {
  let fileString = "";
  fileString += `<svg height="600" width="1200">\n`;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 600;
  canvas.getContext("2d").drawImage(field, 0, 0, 1200, 600);
  fileString += `\t<image x="0" y="0" width="1200" height="600"
     xlink:href="${canvas.toDataURL()}" />\n`;
  for (const path of project.paths) {
    let pathpoints = "";
    for (const node of path.nodes) {
      pathpoints += (node.position.x+0.5)*1200 + ",";
      pathpoints += (0.25-node.position.y)*1200 + ",";
    }
    fileString += `\t<polyline points="${pathpoints}" style="fill:none;stroke:black;stroke-width:3" />\n`;
  }
  fileString += `</svg>\n`;
  return fileString;
}

function saveProject(project) {
  const pathsList = [];
  for (const path of project.paths) {
    const pathDict = {"nodes": [], "name": path.name};
    for (const node of path.nodes) {
      const nodeDict = {
        "position": {"x": node.position.x, "y": node.position.y},
        "rotation": node.rotation,
        "actions":  []
      };
      // TODO: Actions
      pathDict.nodes.push(nodeDict);
    }
    pathsList.push(pathDict);
  }
  return pathsList;
}

export function registerButtons(project, updateProject) {
  document.getElementById("new-project").addEventListener("click", () => {
    updateProject(new Project(project.mouseState, project.viewport));
  });
  document.getElementById("export").addEventListener("click", () => {
    const type = document.getElementById("type-selector").value;
    let name = document.getElementById("project-name").value;
    switch (type) {
    case "save":
      download(name + ".ants", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveProject(project))));
      break;
    case "bitmap":
      const tmpCanvas = document.createElement("canvas");
      const target = new RenderTarget(tmpCanvas);
      target.canvas.width = 1200;
      target.canvas.height = 600;
      target.size.x = 1200;
      target.size.y = 600;
      target.viewport.size = 1200;
      project.draw(target);
      download(name + ".png", target.canvas.toDataURL());
      break;
    case "vector":
      download(name + ".svg", "data:image/svg+xml," + encodeURIComponent(generateSvg(project)));
      break;
    case "pdf":
    case "print":
      alert("Not Implemented Yet!");
      break;
    default:
      loadJson("./exports/" + type + ".json", data =>
        download(name + ".auto", 'data:text/x-autofile;charset=utf-8,' + encodeURIComponent(generateAuto(data, project))));
    }
  });
  document.getElementById("import").addEventListener("click", () => {
    upload(file => {
      try {
        const projectObject = JSON.parse(file);
        project = new Project(project.mouseState, project.viewport);
        for (const path of projectObject) {
          const newPath = new Path(path.nodes[0].position, path.name);
          let first = true;
          for (const node of path.nodes) {
            if (!first) {
              const newNode = newPath.addNode(node.position);
              newNode.rotation = node.rotation;
              // TODO: Actions
            }
            first = false;
          }
          project.paths.push(newPath);
        }
        updateProject(project);
      } catch (error) {
        alert("Error in parsing auto file: " + error.toString());
      }
    });
  });
  document.getElementById("preview").addEventListener("click", () => {
    alert("Not implemented yet!");
  });
}
