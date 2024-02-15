import Tool from './Tool';

export default class Line extends Tool {
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
        type: 'line',
        startX: this.startX,
        startY: this.startY,
        endX: this.currentX,
        endY: this.currentY,
        fillColor: this.ctx.fillStyle,
        strokeColor: this.ctx.strokeStyle,
        lineWidth: this.ctx.lineWidth
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY );
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.currentX = e.pageX - e.target.offsetLeft;
      this.currentY = e.pageY - e.target.offsetTop;

      this.draw(this.currentX, this.currentY);
    }
  }

  draw(x,y) {
    const img = new Image();
    img.src = this.saved;

    img.onload = async function () {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY );
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }.bind(this);
  }

  static draw(ctx, startX, startY, endX, endY, fillColor, strokeColor, lineWidth) {
    const buffLineWidth = ctx.lineWidth;
    const buffFillStyle = ctx.fillStyle;
    const buffStrokeStyle = ctx.strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.moveTo(startX, startY );
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.lineWidth = buffLineWidth;
    ctx.fillStyle = buffFillStyle;
    ctx.strokeStyle = buffStrokeStyle;
  }
};
