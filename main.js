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


 const intervalId = setInterval(() => {
  const randomNumber = Math.floor(Math.random() * 100) + 1; // Générer un nombre entre 1 et 100
  const jsonMessage = JSON.stringify({ number: randomNumber }); // Créer un objet JSON avec le nombre
  ws.send(jsonMessage); // Envoyer le message JSON au client
  console.log(`Nombre aléatoire envoyé: ${randomNumber} en JSON: ${jsonMessage}`);
}, 1000); // 3 secondes


  

  ws.on('message', function incoming(message) {
    // Conversion du buffer en string
    const messageStr = message.toString();
    console.log('Message reçu:', messageStr);

    // Exemple de commande pour déconnecter un client
    if (messageStr === 'disconnect') {
      clearInterval(intervalId);
      ws.close(1000, 'Déconnexion demandée'); // Code 1000 : déconnexion normale
    }
  });

  ws.on('close', function close(code, reason) {
        clearInterval(intervalId);
    console.log(`Connexion fermée. Code: ${code}, Raison: ${reason}`);
  });
});




// Démarrage du serveur HTTP sur le port attribué
server.listen(port, () => {
  console.log(`Serveur WebSocket en écoute sur le port ${port}`);
});
