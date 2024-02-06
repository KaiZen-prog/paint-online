import '../styles/canvas.scss'
import {useState, useRef, useEffect} from 'react';
import  {Modal, Button} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Line from '../tools/Line';
import Circle from '../tools/Circle';
import axios from 'axios';

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext('2d')
    axios.get(`http://localhost:5000/image?id=${params.id}`)
        .then((response) => {
          if (response.data !== 'file not found') {
            const img = new Image();
            img.src = response.data;

            img.onload = () => {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.stroke();
            }
          }
        });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:5000/');
      canvasState.setSocket(socket);
      canvasState.setSessionID(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))

      socket.onopen = () => {
        console.log('Подключение установлено');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))

        socket.onmessage = (event) => {
          let msg = JSON.parse(event.data)
          switch (msg.method) {
            case "connection":
              console.log(`пользователь ${msg.username} присоединился`)
              break
            case "draw":
              drawHandler(msg)
              break
          }
        }
      }
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y, figure.strokeColor)
        break
      case "rect":
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeColor);
        ctx.beginPath()
        break
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.fillColor, figure.strokeColor);
        ctx.beginPath()
        break
      case "line":
        Line.draw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.fillColor, figure.strokeColor);
        ctx.beginPath()
        break
      case "finish":
        ctx.beginPath()
        break
    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  }

  const mouseUpHandler = () => {
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()});
  }

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  return (
    <div className="canvas-wrapper">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header >
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={() => mouseDownHandler()}
        onMouseUp={() => mouseUpHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  )
});

export default Canvas;
