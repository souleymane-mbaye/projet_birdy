const express = require("express");
const Users = require("./entities/users.js");

function initF(db) {
  const router = express.Router();
  // On utilise JSON
  router.use(express.json());
  // simple logger for this router's requests
  // all requests to this router will first hit this middleware
  router.use((req, res, next) => {
    console.log("API: method %s, path %s", req.method, req.path);
    console.log("Params", req.params);
    console.log("Body", req.body);
    console.log('Session',req.session);

    next();
  });
  
  const users = new Users.default(db);

  router
    .route("/user/:user_id/friends")
    .get((req, res) => {
      users
        .getFriends(req.params.user_id)
        .then((friends) => res.status(200).json({friends}))
        .catch((e) => res.status(500).send(err));
    })
    .post(async (req, res) => {
      try {
        const { login } = req.body;
        // Erreur sur la requête HTTP
        if (!login) {
          res.status(400).json({
            status: 400,
            message: "Requête invalide : login du flower nécessaires",
          });
          return;
        }

        user_l = await users.exists(login);
        // console.log("User_l",user_l);
        if (!user_l) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur de login inconnu",
          });
          return;
        }

        user_d = await users.existsID(req.params.user_id);
        // console.log("User_d",user_d);
        if (!user_d) {
          res.status(401).json({
            status: 401,
            message: "User_id inconnu",
          });
          return;
        }

        if (user_l._id == user_d._id) {
          res.status(401).json({
            status: 401,
            message: "On ne peut se suivre soi même",
          });
          return;
        }

        if (user_l.followings.includes(user_d._id)) {
          res.status(401).json({
            status: 401,
            message: "login suit déjà user_id",
          });
          return;
        }

        users
          .addFriend(user_l._id,user_d._id)
          .then((id) => res.status(200).json({id:id}))
          .catch((e) => res.status(500).send(e));
      } catch(e) {
        res.status(500).send(e);
      }
    });

  router.get('/user/:userid/friends/:userid2', async (req, res) => {
    try {

      user_l = await users.existsID(req.params.userid);
      // console.log("User_l",user_l);
      if (!user_l) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur de userid1 inconnu",
        });
        return;
      }

      user_d = await users.existsID(req.params.userid2);
      // console.log("User_d",user_d);
      if (!user_d) {
        res.status(401).json({
          status: 401,
          message: "Userid2 inconnu",
        });
        return;
      }

      if (user_l._id == user_d._id) {
        res.status(401).json({
          status: 401,
          message: "Même utilisateur",
        });
        return;
      }
      
      friends =user_l.followings.filter(value => user_d.followings.includes(value));
      // console.log("Friends",friends);

      res.status(401).json({"id_friends":friends});
      return;
    } catch(e) {
      res.status(500).send(e);
    }
  });

  router.delete('/user/:userid/friends/:friendid', async (req, res) => {
    try {

      user_l = await users.existsID(req.params.userid);
      // console.log("User_l",user_l);
      if (!user_l) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur de userid inconnu",
        });
        return;
      }

      user_d = await users.existsID(req.params.friendid);
      // console.log("User_d",user_d);
      if (!user_d) {
        res.status(401).json({
          status: 401,
          message: "Friendid inconnu",
        });
        return;
      }

      if (user_l._id == user_d._id) {
        res.status(401).json({
          status: 401,
          message: "Même utilisateur",
        });
        return;
      }
      
      if (! user_l.followings.includes(user_d._id)) {
        res.status(401).json({
          status: 401,
          message: "userid ne suit pas friendid",
        });
        return;
      }

      console.log("suit bien");
      users
        .deleteFriend(user_l._id,user_d._id)
        .then((id) => res.status(200).json({id:id}))
        .catch((e) => res.status(500).send(e));
    } catch(e) {
      res.status(500).send(e);
    }
  });

  router.get('/:userid/infos', (req, res) => {
    // c'est la meme chose que friendGetRelationship ou j'ai pas compris
  });

  return router;
}
exports.default = initF;
