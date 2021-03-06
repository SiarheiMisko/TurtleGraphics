// Generated by CoffeeScript 1.9.0
var BORDERS, TAU, UNIT_STEP_DISTANCE, addInputBox, addParameterToCommand, addPathInSVG, changeColorOfPen, changePenWidth, checkX, checkY, clearGraphicsField, countOfCommands, countOfLines, currentAngle, deleteCommandFromAlgorithm, directionAngle, dragStart, getEnteredValue, goToPoint, hidden, hideTurtle, isAnyCommands, isNotPressed, isStackNotEmpty, makeGo, makePath, makePathByPoints, makeRotate, neededToBeDeleted, onClick, onDragOver, onDrop, penColor, penWidth, performCommand, performTheAlgorithm, pickUpOrLowerPen, popCommand, readAlgorithmStack, renderTurtle, showTurtle, showUnshowTurtle, tail, takeCommand, vector, x, y;

countOfCommands = 0;

countOfLines = 0;

hidden = false;

x = 320;

y = 210;

tail = true;

directionAngle = 90.0;

penColor = {
  r: 0,
  g: 0,
  b: 0
};

penWidth = 1;

vector = {
  x: 0,
  y: 1
};

currentAngle = 0;

TAU = 2 * Math.PI;

UNIT_STEP_DISTANCE = 30;

BORDERS = true;

dragStart = function(e) {
  e.dataTransfer.setData("text/html", e.target.innerText);
};

onDragOver = function(e) {
  e.preventDefault();
};

onDrop = function(e) {
  var recieveData, whatToEdit;
  recieveData = e.dataTransfer.getData('text/html');
  whatToEdit = document.getElementById('algorithm');
  countOfCommands++;
  whatToEdit.innerHTML = whatToEdit.innerHTML + ("<div id=command" + countOfCommands + "  onclick='onClick(event,id)'><b> " + recieveData + " </b></div>");
};

onClick = function(e, id) {
  var value;
  if (isNotPressed(e)) {
    e.target.innerHTML = addInputBox(e);
  } else {
    value = getEnteredValue(e);
    if (neededToBeDeleted(value)) {
      deleteCommandFromAlgorithm(e, id);
    } else {
      addParameterToCommand(e, value);
    }
  }
};

addInputBox = function(e) {
  return e.target.innerHTML = e.target.innerHTML + '<input type="text" placeholder="Enter arguments" id="FINDME">';
};

isNotPressed = function(e) {
  var checking;
  checking = e.target.innerHTML.indexOf('<input');
  checking++;
  if (checking === 0) {
    return true;
  } else {
    return false;
  }
};

getEnteredValue = function(e) {
  var inputBox;
  inputBox = document.getElementById('FINDME');
  if (inputBox.value !== "") {
    return inputBox.value;
  } else {
    return '1';
  }
};

addParameterToCommand = function(e, value) {
  var checking1, leftBoard;
  leftBoard = e.target.innerHTML.indexOf('<input');
  e.target.innerHTML = e.target.innerHTML.slice(0, leftBoard);
  checking1 = e.target.innerHTML.indexOf('#');
  if (checking1 !== -1) {
    e.target.innerHTML = e.target.innerHTML.slice(0, checking1);
  }
  return e.target.innerText = e.target.innerText + '#' + value;
};

neededToBeDeleted = function(value) {
  if (value === '0') {
    return true;
  } else {
    return false;
  }
};

deleteCommandFromAlgorithm = function(e, id) {
  var algorithm, endDelete, startDelete;
  algorithm = document.getElementById('algorithm');
  startDelete = algorithm.innerHTML.indexOf("<div id=\"" + id + "\"");
  endDelete = algorithm.innerHTML.indexOf("</div>", startDelete);
  algorithm.innerHTML = algorithm.innerHTML.slice(0, startDelete) + algorithm.innerHTML.slice(endDelete + 6);
};

clearGraphicsField = function() {
  var phield;
  phield = document.getElementById('Graphics field');
  phield.innerHTML = '        <svg id="myField" width="640px" height="420px"> <rect x="0" y="0" width="640" height="420" style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9" /> </svg>';
  if (!hidden) {
    showTurtle();
  }
};

performTheAlgorithm = function() {
  var algorithmStack, countCycle, cycle, i;
  if (!isAnyCommands()) {
    return;
  }
  cycle = document.getElementById("cycle");
  countCycle = +cycle.value;
  i = 0;
  while (i !== countCycle) {
    algorithmStack = readAlgorithmStack();
    while (isStackNotEmpty(algorithmStack)) {
      performCommand(takeCommand(algorithmStack));
      if (!hidden) {
        renderTurtle();
      }
      algorithmStack = popCommand(algorithmStack);
    }
    i++;
  }
};

readAlgorithmStack = function() {
  var algorithm;
  algorithm = document.getElementById('algorithm');
  return algorithm.innerText.slice(23);
};

isAnyCommands = function() {
  var algorithm;
  algorithm = document.getElementById('algorithm');
  if (algorithm.innerText.indexOf('!') !== (algorithm.innerText.length - 1)) {
    return true;
  } else {
    return false;
  }
};

performCommand = function(command) {
  var argumentsOfCommand, str;
  argumentsOfCommand = '0';
  if (command.indexOf('#') !== (-1)) {
    str = command.slice(0, command.indexOf('#'));
    argumentsOfCommand = command.slice(command.indexOf('#') + 1);
  } else {
    str = command.slice(0);
  }
  switch (str) {
    case 'Rotate':
      return makeRotate(argumentsOfCommand);
    case 'Go':
      return makeGo(argumentsOfCommand);
    case 'Pick up/Lower a pen':
      return pickUpOrLowerPen();
    case 'Color of pen':
      return changeColorOfPen(argumentsOfCommand);
    case 'Pen width':
      return changePenWidth(argumentsOfCommand);
    case 'Show/Unshow turtle':
      return showUnshowTurtle();
    case 'Go to point':
      return goToPoint(argumentsOfCommand);
  }
};

makeRotate = function(angle) {
  if (angle === '0') {
    currentAngle += 45 / 360;
  } else {
    currentAngle += +angle / 360;
  }
  currentAngle = currentAngle % 1;
  vector.x = Math.sin(TAU * currentAngle);
  vector.y = Math.cos(TAU * currentAngle);
  return vector;
};

makeGo = function(argumentsOfCommand) {
  var newPath, steps;
  if (argumentsOfCommand === '0') {
    steps = 1;
  } else {
    steps = +argumentsOfCommand;
  }
  countOfLines++;
  newPath = makePath(countOfLines, steps);
  return addPathInSVG(newPath);
};

pickUpOrLowerPen = function() {
  if (tail === true) {
    return tail = false;
  } else {
    return tail = true;
  }
};

changeColorOfPen = function(argumentsOfCommand) {
  if (argumentsOfCommand === '0') {
    argumentsOfCommand = '000';
  }
  penColor.r = argumentsOfCommand[0] * 100;
  penColor.g = argumentsOfCommand[1] * 100;
  return penColor.b = argumentsOfCommand[2] * 100;
};

changePenWidth = function(argumentsOfCommand) {
  if (argumentsOfCommand === '0') {
    argumentsOfCommand = '1';
  }
  return penWidth = +argumentsOfCommand;
};

showUnshowTurtle = function() {
  if (hidden) {
    hidden = false;
    return showTurtle();
  } else {
    hidden = true;
    return hideTurtle();
  }
};

renderTurtle = function() {
  var colorChest, field, newX, newY, startPoint, widthNarration;
  newX = 10 * vector.x + x;
  newY = 10 * vector.y + y;
  field = document.getElementById("Graphics field");
  startPoint = field.innerHTML.indexOf('<circle id="turtleChest"');
  if (tail) {
    colorChest = 'green';
    widthNarration = '4';
  } else {
    colorChest = 'seagreen';
    widthNarration = '1';
  }
  return field.innerHTML = field.innerHTML.slice(0, startPoint) + (" <circle id='turtleChest' cx='" + x + "' cy='" + y + "' r='10' stroke='black' stroke-width='2' fill='" + colorChest + "' /> <path id='turtleNarration' d='M " + x + " " + y + " L " + newX + " " + newY + " ' stroke='rgb(0,0,0)' stroke-width='" + widthNarration + "' fill='none'></path> </svg>");
};

showTurtle = function() {
  var colorChest, field, newX, newY, startPoint, widthNarration;
  newX = 10 * vector.x + x;
  newY = 10 * vector.y + y;
  field = document.getElementById("Graphics field");
  startPoint = field.innerHTML.indexOf('</svg>') - 1;
  if (tail) {
    colorChest = 'green';
    widthNarration = '4';
  } else {
    colorChest = 'seagreen';
    widthNarration = '1';
  }
  return field.innerHTML = field.innerHTML.slice(0, startPoint) + (" <circle id='turtleChest' cx='" + x + "' cy='" + y + "' r='10' stroke='black' stroke-width='2' fill='" + colorChest + "' /> <path id='turtleNarration' d='M " + x + " " + y + " L " + newX + " " + newY + " ' stroke='rgb(0,0,0)' stroke-width='" + widthNarration + "' fill='none'></path> </svg>");
};

hideTurtle = function() {
  var field, startPoint;
  field = document.getElementById("Graphics field");
  startPoint = field.innerHTML.indexOf('<circle id="turtleChest"');
  return field.innerHTML = field.innerHTML.slice(0, startPoint) + " </svg>";
};

goToPoint = function(argumentsOfCommand) {
  var newPath, newX, newY;
  if (argumentsOfCommand === '0') {
    x = 320;
    y = 210;
  }
  newX = +(argumentsOfCommand.slice(0, argumentsOfCommand.indexOf('.')));
  newY = +(argumentsOfCommand.slice(argumentsOfCommand.indexOf('.') + 1));
  if (BORDERS) {
    newX = checkX(newX);
    newY = checkY(newY);
  }
  if (tail) {
    countOfLines++;
    newPath = makePathByPoints(countOfLines, newX, newY);
    addPathInSVG(newPath);
  }
  x = newX;
  y = newY;
};

checkX = function(newX) {
  if (newX > 640) {
    return 640;
  } else {
    if (newX < 0) {
      return 0;
    }
  }
  return newX;
};

checkY = function(newY) {
  if (newY > 420) {
    return 420;
  } else {
    if (newY < 0) {
      return 0;
    }
  }
  return newY;
};

takeCommand = function(algorithmStack) {
  var index;
  index = algorithmStack.indexOf('\n');
  if (index === (-1)) {
    return algorithmStack;
  } else {
    return algorithmStack.slice(0, index);
  }
};

popCommand = function(algorithmStack) {
  var index;
  index = algorithmStack.indexOf('\n');
  if (index === (-1)) {
    return algorithmStack = "";
  } else {
    return algorithmStack.slice(index + 1);
  }
};

isStackNotEmpty = function(algorithmStack) {
  if (algorithmStack.length === 0) {
    return false;
  } else {
    return true;
  }
};

makePath = function(lineId, steps) {
  var PATH, d, newX, newY;
  d = "M " + x + " " + y + " ";
  if (tail === true) {
    d += "L ";
  } else {
    d += "M ";
  }
  newX = UNIT_STEP_DISTANCE * steps * vector.x + x;
  newY = UNIT_STEP_DISTANCE * steps * vector.y + y;
  if (BORDERS) {
    newX = checkX(newX);
  }
  newY = checkY(newY);
  d += newX + " " + newY + " ";
  x = newX;
  y = newY;
  return PATH = "<path id='line" + lineId + "' d='" + d + "' stroke='rgb(" + penColor.r + "," + penColor.g + "," + penColor.b + ")' stroke-width='" + penWidth + "' fill='none' /> ";
};

makePathByPoints = function(lineId, newX, newY) {
  var PATH, d;
  d = "M " + x + " " + y + " ";
  d += "L ";
  if (BORDERS) {
    newX = checkX(newX);
    newY = checkY(newY);
  }
  d += newX + " " + newY + " ";
  x = newX;
  y = newY;
  return PATH = "<path id='line" + lineId + "' d='" + d + "' stroke='rgb(" + penColor.r + "," + penColor.g + "," + penColor.b + ")' stroke-width='" + penWidth + "' fill='none' /> ";
};

addPathInSVG = function(newPath) {
  var adderString, startPoint, svgField;
  svgField = document.getElementById("Graphics field");
  if (hidden) {
    startPoint = svgField.innerHTML.indexOf("</svg>") - 1;
    adderString = "</svg>";
  } else {
    startPoint = svgField.innerHTML.indexOf('<circle id="turtleChest"');
    adderString = svgField.innerHTML.slice(startPoint);
  }
  return svgField.innerHTML = svgField.innerHTML.slice(0, startPoint) + newPath + adderString;
};
