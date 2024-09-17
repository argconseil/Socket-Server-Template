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
let direction = 1; // 1 pour monter, -1 pour descendre

const intervalId = setInterval(() => {
  // Définir une fluctuation progressive contrôlée, ici entre 1 et 3
  const fluctuation = Math.floor(Math.random() * 3) + 1;

  // Appliquer la fluctuation en fonction de la direction actuelle
  currentNumber += fluctuation * direction;

  // Si on dépasse 100, on inverse la direction et on redescend vers l'ouverture
  if (currentNumber > 100) {
    currentNumber = 100; // Limite supérieure
    direction = -1; // Repartir vers la baisse
  }

  // Si on redescend sous 0, on inverse la direction et on remonte vers l'ouverture
  if (currentNumber < 0) {
    currentNumber = 0; // Limite inférieure
    direction = 1; // Repartir vers la hausse
  }

  // Si on monte, mais qu'on approche de l'ouverture à la baisse
  if (direction === -1 && currentNumber <= openingValue) {
    direction = 1; // Remonter progressivement après être repassé par l'ouverture
  }

  // Si on descend, mais qu'on approche de l'ouverture à la hausse
  if (direction === 1 && currentNumber >= openingValue) {
    direction = -1; // Redescendre progressivement après avoir dépassé l'ouverture
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
