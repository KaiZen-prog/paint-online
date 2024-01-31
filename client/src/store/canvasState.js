import {makeAutoObservable} from 'mobx';

class CanvasState {
  canvas = null;
  socket = null;
  sessionID = null;
  undoList = [];
  redoList = [];
  username = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSocket(socket) {
    this.socket = socket;
  }

  setSessionID(id) {
    this.sessionID = id;
  }

  setUsername(name) {
    this.username = name;
  }

  redraw(ctx, data) {
    let img = new Image();
    img.src = data;
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  undo() {
    let ctx = this.canvas.getContext('2d')
    if (this.undoList.length > 0) {
      let dataUrl = this.undoList.pop()
      this.redoList.push(this.canvas.toDataURL())
      this.redraw(ctx, dataUrl);
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  redo() {
    let ctx = this.canvas.getContext('2d')
    if (this.redoList.length > 0) {
      let dataUrl = this.redoList.pop()
      this.undoList.push(this.canvas.toDataURL())
      this.redraw(ctx, dataUrl);
    }
  }
}

export default new CanvasState();
