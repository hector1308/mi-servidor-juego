const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server Online');
});

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        const messageString = message.toString();
        let data;
        try {
            data = JSON.parse(messageString);
        } catch (e) {
            return;
        }

        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });

    ws.on('error', () => {
        clients.delete(ws);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});