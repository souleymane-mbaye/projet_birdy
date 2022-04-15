const express = require("express");
const Users = require("./entities/users.js");
const upload = require("multer")();
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

function init(db) {
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

  router.post("/user/login", async (req, res) => {
    try {
      const { login, password } = req.body;
      // Erreur sur la requête HTTP
      if (!login || !password) {
        res.status(400).json({
          status: 400,
          message: "Requête invalide : login et password nécessaires",
        });
        return;
      }
      if (!(await users.exists(login))) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur inconnu",
        });
        return;
      }
      let userid = await users.checkpassword(login, password);
      if (userid) {
        // Avec middleware express-session
        req.session.regenerate(function (err) {
          if (err) {
            res.status(500).json({
              status: 500,
              message: "Erreur interne",
            });
          } else {
            // C'est bon, nouvelle session créée
            req.session.userid = userid;
            console.log("Logout", req.session);
            res.status(200).json({
              status: 200,
              message: "Login et mot de passe accepté",
            });
          }
        });
        return;
      }
      // Faux login : destruction de la session et erreur
      req.session.destroy((err) => {});
      res.status(403).json({
        status: 403,
        message: "login et/ou le mot de passe invalide(s)",
      });
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
  
  router.delete("/user/:userid/logout", (req, res) => {

    if(req.params.userid!=res.session.userid) {

      res.status(401).json({
        status: 401,
        message: "Utilisateur non connecté",
      });
      return;
    }

    // console.log("Params",req.params,"\nSession",req.session);
    req.session.destroy((err) => {
      if (err) {
        res.status(401).send("Erreur de deconnexion");
      } else {
        res.status(200).send("fermeture session");
      }
    });
  });

  // permutation avec la suivante entraine une erreur
  router.get("/user/infos", (req, res) => {
    try {
      users
        .getAll()
        .then((nb) => res.status(200).send(nb))
        .catch((e) => res.status(402).send(e));
      return;
    } catch (e) {
      res.status(500).send(e);
    }
  });

  router
    .route("/user/:user_id")
    .get(async (req, res) => {
      try {
        const user = await users.get(req.params.user_id);
        if (!user) res.sendStatus(404);
        else res.send(user);
      } catch (e) {
        res.status(500).send(e);
      }
    })
    .delete(async (req, res) => {
      try {
        users
          .remove(req.params.user_id)
          .then((numRemoved) => {
            if (numRemoved) {
              res.send(`delete user ${req.params.user_id}`);
            } else {
              res.status(403).send(`userid non reconnu`);
            }
          })
          .catch((err) => res.status(500).send(err));
      } catch (e) {
        res.status(500).send(e);
      }
    });

  router.post("/user", async (req, res) => {
    const { login, password, confirmpassword, lastname, firstname } = req.body;
    if (!login || !password || !confirmpassword || !lastname || !firstname) {
      res.status(400).send("Missing fields");
      return;
    }

    if (password != confirmpassword) {
      res.status(402).send("Confirmpassword error");
      return;
    }

    if (await users.exists(login)) {
      res.status(401).json({
        status: 401,
        message: "Login déjà pris",
      });
      return;
    }

    users
      .create(login, password, lastname, firstname)
      .then((user_id) => res.status(201).send({ id: user_id }))
      .catch((err) => res.status(500).send(err));
  });

  router.post(
    "/:userid/upload/profil",
    upload.single("file"),
    async (req, res) => {

      if(req.params.userid!=res.session.userid) {
  
        res.status(401).json({
          status: 401,
          message: "Utilisateur non connecté",
        });
        return;
      }
      
      user = await users.existsID(req.params.userid)
      if (!user) {
        res.status(401).json({
          status: 401,
          message: "Userid inconnu",
        });
        return;
      }

      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      ) {
        res.status(401).json({
          status: 401,
          message: "Invalid file type",
        });
        return;
      }

      if (req.file.size > 900000000) {
        res.status(401).json({
          status: 401,
          message: "Max size",
        });
        return;
      }
      // const fileN = `${__dirname}/../../client/public/uploads/profil/${fileName}`
      // console.log("FilName",fileN,"\n\n");
      
      
      const fileName = user.login + ".jpg";
      if (!(await users.uploadAvatar(req.params.userid, fileName))) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur inconnu",
        });
        return;
      }

      await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../../client/public/uploads/profil/${fileName}`
        )
      );
      res.status(201).json({ message: "profil uploadé" });
    }
  );

  return router;
}
exports.default = init;
