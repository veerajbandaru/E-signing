const canvas = document.getElementById("signature-pad");
const ctx = canvas.getContext("2d");

let writingMode = false;
let lastPositionX, lastPositionY;

let undoStack = [];
let redoStack = [];

canvas.addEventListener("pointerdown", handlePointerDown, { passive: true });
canvas.addEventListener("pointerup", handlePointerUp, { passive: true });
canvas.addEventListener("pointermove", handlePointerMove, { passive: true });

// Handle touch events
canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

function handleTouchStart(event) {
  if (event.targetTouches.length == 1) {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const mouseEvent = new MouseEvent("pointerdown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }
}

function handleTouchEnd(event) {
  if (event.changedTouches.length == 1) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const mouseEvent = new MouseEvent("pointerup", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }
}

function handleTouchMove(event) {
  if (event.targetTouches.length == 1) {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const mouseEvent = new MouseEvent("pointermove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }
}

function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack = []; // Clear the redo stack
}

function restoreState() {
  if (undoStack.length) {
    const previousState = new Image();
    previousState.src = undoStack.pop();
    previousState.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(previousState, 0, 0);
    };
  }
}

function handlePointerDown(event) {
  writingMode = true;
  ctx.beginPath();
  const [positionX, positionY] = getCursorPosition(event);
  ctx.moveTo(positionX, positionY);
  lastPositionX = positionX;
  lastPositionY = positionY;
  
  // Save the state before starting to draw
  saveState();
}

function handlePointerUp() {
  writingMode = false;
}

function handlePointerMove(event) {
  if (!writingMode) return;
  const [positionX, positionY] = getCursorPosition(event);
  ctx.lineTo(positionX, positionY);
  ctx.stroke();
  lastPositionX = positionX;
  lastPositionY = positionY;
}

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const positionX = event.clientX - rect.left;
  const positionY = event.clientY - rect.top;
  return [positionX, positionY];
}

// Set some canvas properties
ctx.lineWidth = 3;
ctx.lineJoin = ctx.lineCap = "round";

// Clear button functionality
document.getElementById("clear-button").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Undo button functionality
document.getElementById("undo-button").addEventListener("click", () => {
  restoreState();
});
