const http = require('http');
const WebSocket = require('ws');

// Créer un serveur HTTP de base
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Serveur WebSocket en écoute\n');
});

// Utilisation du port attribué par Heroku
const port = process.env.PORT || 5001;

// Création du serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connecté');

  ws.on('message', function incoming(message) {
    console.log('Message reçu:', message);

    if (message === 'disconnect') {
      ws.close(1000, 'Déconnexion demandée');
    }
  });

  ws.on('close', function close(code, reason) {
    console.log(`Connexion fermée. Code: ${code}, Raison: ${reason}`);
  });
});

// Démarrage du serveur HTTP sur le port attribué
server.listen(port, () => {
  console.log(`Serveur WebSocket en écoute sur le port ${port}`);
});
