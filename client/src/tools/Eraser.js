import Brush from './Brush';

export default class Eraser extends Brush {
  constructor(canvas) {
    super(canvas);
  }

  draw(x, y) {
    let currentStrokeStyle = this.ctx.strokeStyle;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.strokeStyle = currentStrokeStyle;
  }
};
