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


let openingValue = Math.floor(Math.random() * 100); // Valeur d'ouverture initiale
let currentNumber = openingValue; // Initialisation avec la valeur d'ouverture
let direction = Math.random() < 0.5 ? 1 : -1; // Direction initiale aléatoire: 1 pour monter, -1 pour descendre

const intervalId = setInterval(() => {
  // Définir une fluctuation progressive contrôlée, ici entre -5 et +5
  const fluctuation = Math.floor(Math.random() * 11) - 5; // Variation entre -5 et +5

  // Appliquer la fluctuation à la valeur actuelle
  currentNumber += fluctuation * direction;

  // Limiter la valeur entre 0 et 100
  if (currentNumber > 100) {
    currentNumber = 100; // Limite supérieure
    direction = -1; // Inverser pour redescendre
  }

  if (currentNumber < 0) {
    currentNumber = 0; // Limite inférieure
    direction = 1; // Inverser pour remonter
  }

  // Si la valeur dépasse de plus de 50 unités la valeur d'ouverture, inverser la direction
  if (currentNumber > openingValue + 50) {
    direction = -1; // Inverser pour redescendre
  } else if (currentNumber < openingValue - 50) {
    direction = 1; // Inverser pour remonter
  }

  // Créer l'objet JSON à envoyer
  const jsonMessage = JSON.stringify({ number: currentNumber });

  // Envoyer le message JSON au client
  ws.send(jsonMessage); 
  console.log(`Nombre progressif envoyé: ${currentNumber} en JSON: ${jsonMessage}`);
}, 500); // 500 ms = 0,5 secondes

  

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
