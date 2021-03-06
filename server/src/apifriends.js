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
    console.log("Session", req.session);

    next();
  });

  const users = new Users.default(db);

  router
    .route("/user/:userid/friends")
    .get(async (req, res) => {
      try {
        if (req.params.userid != req.session.userid) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur non connecté",
          });
          return;
        }

        const friends = await users.getFriends(req.params.userid);
        res.status(200).json({ friends });

        return;
      } catch (e) {
        // Toute autre erreur
        res.status(500).json({
          status: 500,
          message: "erreur interne",
          details: (e || "Erreur inconnue").toString(),
        });
      }
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
        //MODIFIER AVANT EXISTS
        user_l = await users.exists_login(login);
        if (!user_l) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur de login inconnu",
          });
          return;
        }
        console.log(req.params.userid,"ggggg", req.session.userid)
        
        if (req.params.userid != req.session.userid) {
          

          res.status(401).json({
            status: 401,
            message: "Utilisateur non connecté",

          });
          return;
        }
        //MODIFIER AVANT EXISTID
        user_d = await users.exists_id(req.params.userid);
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
        const id = await users.addFriend(user_l._id, user_d._id);
        res.status(200).json({ id: id });
        return;
      } catch (e) {
        // Toute autre erreur
        res.status(500).json({
          status: 500,
          message: "erreur interne",
          details: (e || "Erreur inconnue").toString(),
        });
      }
    });

  router.get("/user/:userid/friends/:userid2", async (req, res) => {
    try {
      const user_l = await users.existsID(req.params.userid);
      if (!user_l) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur de userid1 inconnu",
        });
        return;
      }

      const user_d = await users.existsID(req.params.userid2);
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

      friends = user_l.followings.filter((value) =>
        user_d.followings.includes(value)
      );

      res.status(401).json({ id_friends: friends });
      return;
    } catch (e) {
      // Toute autre erreur
      res.status(500).json({
        status: 500,
        message: "erreur interne",
        details: (e || "Erreur inconnue").toString(),
      });
    }
  });

  router.delete("/user/:userid/friends/:friendid", async (req, res) => {
    try {
      console.log("test1");
      console.log("req.params.userid != req.session.userid",req.params.userid," ,kkkk", req.session.userid);
      if (req.params.userid != req.session.userid) {
        console.log("test2");
        res.status(401).json({
          status: 401,
          message: "Utilisateur non connecté",
        });
        return;
      }
      console.log("test3");

      const user_l = await users.exists_id(req.params.userid);
      console.log("test4",user_l);
      if (!user_l) {
        console.log("test5");
        res.status(401).json({
          status: 401,
          message: "Utilisateur de userid inconnu",
        });
        return;
      }
      console.log("test6");
      const user_d = await users.exists_id(req.params.friendid);
      console.log("test7",user_d);
      if (!user_d) {
        console.log("test8");
        res.status(401).json({
          status: 401,
          message: "Friendid inconnu",
        });
        return;
      }
      console.log("test9 user_l._id == user_d._id",user_l._id,"hhhhh", user_d._id);
      if (user_l._id == user_d._id) {
        console.log("test10");
        res.status(401).json({
          status: 401,
          message: "Même utilisateur",
        });
        return;
      }
      console.log("test11");

      if (!user_l.followings.includes(user_d._id)) {
        console.log("test12");
        res.status(401).json({
          status: 401,
          message: "userid ne suit pas friendid",
        });
        return;
      }
      console.log("test13",user_l._id, user_d._id);
      //AREVOIR
      users.deleteFriend(user_l._id, user_d._id);
      res.status(200).json({ id: id });

      return;
    } catch (e) {
      console.log("test14");
      // Toute autre erreur
      res.status(500).json({
        status: 500,
        message: "erreur interne",
        details: (e || "Erreur inconnue").toString(),
      });
    }
  });

  router.get("/:userid/infos", (req, res) => {
    // c'est la meme chose que friendGetRelationship ou j'ai pas compris
  });

  return router;
}
exports.default = initF;
