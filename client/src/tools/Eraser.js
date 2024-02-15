import Brush from './Brush';

export default class Eraser extends Brush {
  constructor(canvas, socket, sessionID) {
    super(canvas, socket, sessionID);
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let x = e.pageX - e.target.offsetLeft;
      let y = e.pageY - e.target.offsetTop;

      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.sessionID,
        figure: {
          type: 'eraser',
          x: x,
          y: y,
          strokeColor: '#ffffff',
          lineWidth: this.ctx.lineWidth
        }
      }))
    }
  }

  static draw(ctx, x, y, lineWidth) {
    const buffLineWidth = ctx.lineWidth;
    const buffStrokeStyle = ctx.strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#ffffff';

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lineWidth = buffLineWidth;
    ctx.strokeStyle = buffStrokeStyle;
  }
};
