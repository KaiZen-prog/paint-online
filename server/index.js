const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                console.log(msg);
                connectionHandler(ws, msg)
                break
            case "draw":
                console.log(msg);
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: "Загружено"})
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})

app.get('/image', (req, res) => {
    const imagePath = path.resolve(__dirname, 'files', `${req.query.id}.jpg`);

    try {
        if (fs.existsSync(imagePath)) {
            const file = fs.readFileSync(imagePath);
            const data = `data:image/png;base64,` + file.toString('base64');
            res.json(data);
        } else {
            res.status(200).json('file not found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json('error');
    }
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
