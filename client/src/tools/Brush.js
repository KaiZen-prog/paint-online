import Tool from './Tool';

export default class Brush extends Tool{
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
        type: 'finish'
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let x = e.pageX - e.target.offsetLeft;
      let y = e.pageY - e.target.offsetTop;

      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.sessionID,
        figure: {
          type: 'brush',
          x: x,
          y: y
        }
      }))
    }
  }

  static draw(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};
