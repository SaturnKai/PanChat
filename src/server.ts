import WebSocket, { WebSocketServer } from 'ws';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
const httpServer = app.listen(port);

const prisma = new PrismaClient();

const wss: WebSocketServer = new WebSocketServer({
    noServer: true,
});

httpServer.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (client) => {
        wss.emit('connection', client, req);
    });
});

wss.on('connection', async (client: WebSocket) => {
    const id = Math.random().toString(16).slice(11);
    console.log(`INFO: Client connected - ${id}`);

    const messages = await prisma.message.findMany();
    client.send(JSON.stringify({ event: 'id', id }));
    client.send(JSON.stringify({ event: 'messages', messages }));

    client.on('message', async (data: WebSocket.RawData) => {
        const payload = JSON.stringify({ event: 'message', user: id, content: data.toString() });
        wss.clients.forEach((c) => c.send(payload));

        await prisma.message.create({
            data: {
                userId: id,
                content: data.toString(),
            },
        });
    });
});
