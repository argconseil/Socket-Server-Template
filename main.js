const http = require("http");
const express = require("express");
const app = express();

app.use(express.static("public"));

const serverPort = process.env.PORT || 3000;
const server = http.createServer(app);
const WebSocket = require("ws");

let keepAliveId;
let randomNumberId; // ID pour l'envoi des chiffres aléatoires

const wss =
  process.env.NODE_ENV === "production"
    ? new WebSocket.Server({ server })
    : new WebSocket.Server({ port: 5001 });

server.listen(serverPort);
console.log(`Server started on port ${serverPort} in stage ${process.env.NODE_ENV}`);

wss.on("connection", function (ws, req) {
  console.log("Connection Opened");
  console.log("Client size: ", wss.clients.size);

  if (wss.clients.size === 1) {
    console.log("first connection. starting keepalive");
    keepServerAlive();
    startSendingRandomNumbers(); // Commencer l'envoi des chiffres aléatoires
  }

  ws.on("message", (data) => {
    let stringifiedData = data.toString();
    if (stringifiedData === 'pong') {
      console.log('keepAlive');
      return;
    }
    broadcast(ws, stringifiedData, false);
  });

  ws.on("close", (data) => {
    console.log("closing connection");
   disconnetClients();
      clearInterval(keepAliveId);
      clearInterval(randomNumberId); // Stopper l'envoi des chiffres aléatoires
  });
});

// Fonction pour envoyer un chiffre aléatoire toutes les 3 secondes en format JSON
const startSendingRandomNumbers = () => {
  randomNumberId = setInterval(() => {
    //const randomNum = Math.floor(Math.random() * (500 - 10 + 1)) + 10;

    const randomNum = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    
    const message = {
      type: "randomNumber",
      value: randomNum,
      timestamp: new Date().toISOString()
    };
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message)); // Envoi en format JSON
        //console.log("height envoyé");
      }
    });
  }, 1000); // Toutes les 1 secondes
};

// Implémenter la fonction broadcast car ws ne l'a pas
const broadcast = (ws, message, includeSelf) => {
  if (includeSelf) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } else {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};

/**
 * Envoyer un message "ping" à tous les clients connectés toutes les 50 secondes
 */
const keepServerAlive = () => {
  keepAliveId = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('ping');
        //console.log("ping envoyé");
      }
    });
  }, 50000);
};

const disconnetClients = () => {
  disconnet = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        ws.close
        //console.log("fermeture opéré pour");
      }
    });
  }, 50000);
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});
