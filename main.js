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

const intervalId = setInterval(() => {
  // Définir une fluctuation progressive contrôlée, ici entre -5 et +5
  const fluctuation = Math.floor(Math.random() * 11) - 5; // Variation entre -5 et +5

  // Appliquer la fluctuation à la valeur actuelle
  currentNumber += fluctuation;

  // Si on dépasse 100, on redescend progressivement
  if (currentNumber > 100) {
    currentNumber = 100; // Limite supérieure
    direction = -1; // Repartir vers la baisse
  }

  // Si on descend sous 0, on remonte progressivement
  if (currentNumber < 0) {
    currentNumber = 0; // Limite inférieure
    direction = 1; // Repartir vers la hausse
  }

  // Si on descend ou monte trop loin de la valeur d'ouverture, on revient progressivement vers elle
  if (currentNumber > openingValue + 50) {
    currentNumber -= Math.abs(fluctuation); // Revenir progressivement vers l'ouverture
  } else if (currentNumber < openingValue - 50) {
    currentNumber += Math.abs(fluctuation); // Revenir progressivement vers l'ouverture
  }

  // Créer l'objet JSON à envoyer
  const jsonMessage = JSON.stringify({ number: currentNumber });

  // Envoyer le message JSON au client
  ws.send(jsonMessage); 
  console.log(`Nombre progressif envoyé: ${currentNumber} en JSON: ${jsonMessage}`);
}, 500); // 3 secondes

  

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
