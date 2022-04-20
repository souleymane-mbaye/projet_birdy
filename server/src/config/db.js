var Datastore = require('nedb');

db = {} 

db.users = new Datastore('./data/databases/birdyUsersdb.mongodb')
db.messages = new Datastore('./data/databases/birdyMessagesdb.mongodb')

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

// messages.find({}, (err, docs) => {
//   if (err) {
//     console.log("Erreur get all mes");
//     console.log("Messages",docs);
//   } else {
//   }
// });

// vider la base de données
// db.messages.remove({}, { multi: true }, function (err, numRemoved) {});

// .route("/user/:user_id(\\d+)")



exports.default = db;