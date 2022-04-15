const path = require('path');
const api = require('./api.js');
const apifriends = require('./apifriends.js');
const apimessages = require('./apimessages.js');

console.log('Bonjour')


// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
db = require("./config/db.js");
const session = require("express-session");
const cors = require("cors");


// pour pouvoir recevoir des requetes
const corsOptions = {
  origin: process.env.CLIENT_URL,
  Credential: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  prefLightContinue: false,
};
app.use(cors(corsOptions));


app.use(session({
    secret: "technoweb rocks",
    resave: false,
    saveUninitialized: true,
    cookie: { userid:null }
}));

app.use('/api', api.default(db.default.users));
app.use('/apifriends', apifriends.default(db.default.users));
app.use('/apimessages', apimessages.default(db.default.users,db.default.messages));

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

