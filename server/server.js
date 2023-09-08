const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Store active connections
const activeConnections = {};

// Define your routes here
app.get('/api/data', (req, res) => {
    // Handle the request and send a response
    res.json({ message: 'Hello from the server dude!' });
});

io.on('connection', (socket) => {
    // console.log(`User ${socket.id} connected`);

    // Store the user's socket
    activeConnections[socket.id] = socket;

    // Find a random partner to connect with
    const partnerSocket = findRandomPartner(socket);

    if (partnerSocket) {
        // Notify both users about the connection
        socket.emit('partnerConnected', partnerSocket.id);
        partnerSocket.emit('partnerConnected', socket.id);
        // console.log(`user ${socket.id} connected to user ${partnerSocket.id}`)
    }

    // Handle messages between users
    socket.on('message', (message) => {
        const partnerSocket = activeConnections[socket.partnerId];
        if (partnerSocket) {
            partnerSocket.emit('message', message);
        }
    });

    // Handle WebRTC signaling
    socket.on('signal', (data) => {
        const partnerSocket = activeConnections[socket.partnerId];
        if (partnerSocket) {
            partnerSocket.emit('signal', data);
        }
    });

    // Handle 'stream' event
    socket.on('stream', (streamData) => {
        const partnerSocket = activeConnections[socket.partnerId];
        if (partnerSocket) {
            partnerSocket.emit('stream', streamData);
        }
    });


    // Handle disconnections
    socket.on('disconnect', () => {
        // console.log(`User ${socket.id} disconnected`);


        const partnerSocket = activeConnections[socket.partnerId];
        if (partnerSocket) {
            partnerSocket.emit('partnerDisconnected');
        }

        // Remove the user's socket from active connections
        delete activeConnections[socket.id];
    });
});


function findRandomPartner(socket) {
    const activeIds = Object.keys(activeConnections).filter(id => id !== socket.id);
    if (activeIds.length > 0) {
        const randomId = activeIds[Math.floor(Math.random() * activeIds.length)];
        const partnerSocket = activeConnections[randomId];

        // Mark the sockets as partners
        socket.partnerId = randomId;
        partnerSocket.partnerId = socket.id;

        return partnerSocket;
    }

    return null;
}


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});
