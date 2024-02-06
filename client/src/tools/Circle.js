import Tool from './Tool';

export default class Circle extends Tool {
  constructor(canvas, socket, sessionID) {
    super(canvas, socket, sessionID);
    this.listen();
  }

  listen(e) {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseUpHandler(e) {
    this.mouseDown = false;

    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.sessionID,
      figure: {
        type: 'circle',
        x: this.centerX,
        y: this.centerY,
        radius: this.radius,
        fillColor: this.ctx.fillStyle,
        strokeColor: this.ctx.strokeStyle
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let currentX = e.pageX - e.target.offsetLeft;
      let currentY = e.pageY - e.target.offsetTop;

      let deltaX = currentX - this.startX;
      let deltaY = currentY - this.startY;

      this.centerX = this.startX + deltaX / 2;
      this.centerY = this.startY + deltaY / 2;

      this.radius = Math.sqrt(deltaX**2 + deltaY**2) / 2;
      this.draw(this.centerX, this.centerY, this.radius);
    }
  }

  draw(x, y, radius) {
    const img = new Image();
    img.src = this.saved;

    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  static staticDraw(ctx, x, y, radius, fillColor, strokeColor) {
    const buffFillStyle = ctx.fillStyle;
    const buffStrokeStyle = ctx.strokeStyle;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = buffFillStyle;
    ctx.strokeStyle = buffStrokeStyle;
  }
};
