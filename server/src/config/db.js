var Datastore = require('nedb');

db = {}

db.users = new Datastore('../../data/birdyUsersdb.mongodb')
db.messages = new Datastore('../../data/birdyMessagesdb.mongodb')

db.users.loadDatabase(function (err) {    // Callback is optional
  if(err)
    console.log("Erreur de chargement de la base de données users");
  else
    console.log("Chargement de la base de données users (fichier) réussi")
});

db.messages.loadDatabase(function (err) {    // Callback is optional
  if(err)
    console.log("Erreur de chargement de la base de données messages");
  else
    console.log("Chargement de la base de données messages (fichier) réussi")
});


// vider la base de données
db.messages.remove({}, { multi: true }, function (err, numRemoved) {});

// .route("/user/:user_id(\\d+)")



exports.default = db;