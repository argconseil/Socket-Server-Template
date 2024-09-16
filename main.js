const http = require("http");
const express = require("express");
const app = express();


const WebSocket = require('ws');

// Création du serveur WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connecté');

  // Lorsque le serveur reçoit un message du client
  ws.on('message', function incoming(message) {
    console.log('Message reçu:', message);

    // Exemple de commande pour déconnecter un client
    if (message === 'disconnect') {
      ws.close(1000, 'Déconnexion demandée'); // Code 1000 : déconnexion normale
    }
  });

  // Lorsque la connexion est fermée
  ws.on('close', function close(code, reason) {
    console.log(`Connexion fermée. Code: ${code}, Raison: ${reason}`);
  });
});



app.get('/', (req, res) => {
    res.send('Hello World!');
  console.log('Serveur WebSocket en écoute sur le port 8080');
});
