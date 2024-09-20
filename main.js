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
let target = Math.floor(Math.random() * 100); // Cible initiale aléatoire
let step = 1; // Pas de progression (peut être ajusté)

const intervalId = setInterval(() => {
  // Si la cible est atteinte ou dépassée, choisir une nouvelle cible
  if (currentNumber === target) {
    target = Math.floor(Math.random() * 100); // Nouvelle cible
    console.log(`Nouvelle cible définie: ${target}`);
  }

  // Si on est en dessous de la valeur d'ouverture, la progression doit remonter vers elle
  if (currentNumber < target) {
    currentNumber += step; // Monter progressivement
  } else if (currentNumber > target) {
    currentNumber -= step; // Descendre progressivement
  }

  // S'assurer que la valeur d'ouverture est toujours touchée dans la descente ou montée
  if (target < openingValue && currentNumber > openingValue) {
    currentNumber -= step; // Redescendre progressivement vers l'ouverture
  } else if (target > openingValue && currentNumber < openingValue) {
    currentNumber += step; // Remonter progressivement vers l'ouverture
  }

  // Créer l'objet JSON à envoyer
  const jsonMessage = JSON.stringify({ number: currentNumber });

  // Envoyer le message JSON au client
  ws.send(jsonMessage);
  console.log(`Nombre progressif envoyé: ${currentNumber} en JSON: ${jsonMessage}`);
}, 500); // Intervalle de 500 ms
  

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
