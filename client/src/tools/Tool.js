export default class Tool {
  constructor(canvas, socket, sessionID) {
    this.canvas = canvas;
    this.socket = socket;
    this.sessionID = sessionID;
    this.ctx = canvas.getContext('2d');
    this.destroyEvents();
  }

  set fillColor(color) {
    this.ctx.fillStyle = color
  }

  set strokeColor(color) {
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.ctx.lineWidth = width;
  }

  destroyEvents() {
    this.canvas.onmouseup = null;
    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
  }
};
