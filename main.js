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


 let currentNumber = Math.floor(Math.random() * 100); // Commence avec un nombre aléatoire de départ

const intervalId = setInterval(() => {
  // Générer une fluctuation raisonnable entre -5 et +5
  const fluctuation = Math.floor(Math.random() * 11) - 5;

  // Ajouter la fluctuation au nombre actuel pour créer une progression plus linéaire
  currentNumber += fluctuation;

  // S'assurer que le nombre reste entre 0 et 100
  if (currentNumber > 100) currentNumber = 100;
  if (currentNumber < 0) currentNumber = 0;

  // Créer l'objet JSON à envoyer
  const jsonMessage = JSON.stringify({ number: currentNumber });
  
  // Envoyer le message JSON au client
  ws.send(jsonMessage); 
  console.log(`Nombre aléatoire envoyé: ${currentNumber} en JSON: ${jsonMessage}`);
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
