const express = require("express");
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");

function init(db_users, db_messages) {
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

  const users = new Users.default(db_users);
  const messages = new Messages.default(db_messages);
  
  router
    .route("/user/:userid/messages")
    .put(async (req, res) => {
      try {
        if (req.params.userid != req.session.userid) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur non connecté",
          });
          return;
        }

        const { old_message_id, new_message } = req.body;
        // Erreur sur la requête HTTP
        if (!new_message || !old_message_id) {
          res.status(400).json({
            status: 400,
            message:
              "Requête invalide : new message/old message id nécessaires",
          });
          return;
        }

        const user = await users.existsID(req.params.userid);
        if (!user) {
          res.status(401).json({
            status: 401,
            message: "Userid inconnu",
          });
          return;
        }

        const old_message = await messages.existsID(old_message_id);
        if (!old_message) {
          res.status(401).json({
            status: 401,
            message: "Old message id inconnu",
          });
          return;
        }
        if (old_message.author_id != req.params.userid) {
          res.status(401).json({
            status: 401,
            message: "userid is not the author of old message",
          });
          return;
        }

        const id = await messages.update(old_message_id, new_message);
        res.status(201).send({ id: id });

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
    .delete(async (req, res) => {
      try {
        if (req.params.userid != req.session.userid) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur non connecté",
          });
          return;
        }

        const { message_id } = req.body;
        // Erreur sur la requête HTTP
        if (!message_id) {
          res.status(400).json({
            status: 400,
            message: "Requête invalide : message id nécessaires",
          });
          return;
        }

        const user = await users.existsID(req.params.userid);
        if (!user) {
          res.status(401).json({
            status: 401,
            message: "Userid inconnu",
          });
          return;
        }

        const message = await messages.existsID(message_id);
        if (!message) {
          res.status(401).json({
            status: 401,
            message: "message id inconnu",
          });
          return;
        }
        if (message.author_id != req.params.userid) {
          res.status(401).json({
            status: 401,
            message: "userid is not the author of message",
          });
          return;
        }

        const id = await messages.remove(message_id);
        res.status(201).send({ id: id });

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
        if (req.params.userid != req.session.userid) {
          res.status(401).json({
            status: 401,
            message: "Utilisateur non connecté",
          });
          return;
        }

        const { message } = req.body;
        // Erreur sur la requête HTTP
        if (!message) {
          res.status(400).json({
            status: 400,
            message: "Requête invalide : message nécessaires",
          });
          return;
        }

        const user = await users.existsID(req.params.userid);
        if (!user) {
          res.status(401).json({
            status: 401,
            message: "Userid inconnu",
          });
          return;
        }

        const id = await messages.create(
          req.params.userid,
          user.login,
          message
        );
        res.status(201).send({ id: id });

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

  router.get("/messages", (req, res) => {
    messages
      .getAll()
      .then((mes) => res.status(201).json({ messages: mes }))
      .catch((e) => res.status(401).send(e));
  });

  router.get("/user/:userid/messages/friends", async (req, res) => {
    try {
      if (req.params.userid != req.session.userid) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur non connecté",
        });
        return;
      }

      const user = await users.existsID(req.params.userid);
      if (!user) {
        res.status(401).json({
          status: 401,
          message: "Userid inconnu",
        });
        return;
      }

      friends = await users.getFriends(req.params.userid);
      console.log("Friends", friends);
      if (!friends) {
        res.status(401).json({
          status: 401,
          message: "Erreur interne",
        });
        return;
      }

      const mes = await messages.getUsersMessages(friends.followings);
      res.status(201).json({ messages: mes });

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

  router.get("/user/:userid/messages/:friendid", async (req, res) => {
    try {
      if (req.params.userid != req.session.userid) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur non connecté",
        });
        return;
      }

      const user = await users.existsID(req.params.userid);
      if (!user) {
        res.status(401).json({
          status: 401,
          message: "Userid inconnu",
        });
        return;
      }

      const friend = await users.existsID(req.params.friendid);
      if (!friend) {
        res.status(401).json({
          status: 401,
          message: "Friendid inconnu",
        });
        return;
      }
      
      if (! user.followings.includes(friend._id)) {
        res.status(401).json({
          status: 401,
          message: "userid ne suit pas friendid",
        });
        return;
      }

      const mes = await messages.getUsersMessages([req.params.friendid]);
      res.status(201).json({ messages: mes });

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

  router.get("/user/:userid/infos", async (req, res) => {
    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    messages
      .getUsersMessages([req.params.userid])
      .then((mes) => res.status(201).json({ nbMessages: mes.length }))
      .catch((e) => res.status(401).send(e));
  });

  router.get("/infos", async (req, res) => {
    messages
      .getAll()
      .then((mes) => res.status(201).json({ nbMessages: mes.length }))
      .catch((e) => res.status(401).send(e));
  });

  router.patch("/user/:userid/messages/like", async (req, res) => {
    const { message_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id nécessaires",
      });
      return;
    }

    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    message = await messages.existsID(message_id);
    if (!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu",
      });
      return;
    }

    messages
      .addLike(message_id, req.params.userid)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  });

  router.patch("/user/:userid/messages/unlike", async (req, res) => {
    const { message_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id nécessaires",
      });
      return;
    }

    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    message = await messages.existsID(message_id);
    if (!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu",
      });
      return;
    }

    if (!message.likes.includes(req.params.userid)) {
      res.status(401).json({
        status: 401,
        message: "userid n'a pas liké le message",
      });
      return;
    }

    messages
      .removeLike(message_id, req.params.userid)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  });

  router.patch("/user/:userid/messages/comment", async (req, res) => {
    const { message_id, comment_text } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_text) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id/commentaire nécessaires",
      });
      return;
    }

    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    message = await messages.existsID(message_id);
    if (!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu",
      });
      return;
    }

    // if(!message.likes.includes(req.params.userid)) {
    //   res.status(401).json({
    //     status:401,
    //     message: "userid n'a pas liké le message"
    //   })
    //   return;
    // }

    messages
      .addComment(message_id, req.params.userid, user.login, comment_text)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  });

  router.patch("/user/:userid/messages/edit-comment", async (req, res) => {
    const { message_id, comment_id, new_comment_text } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_id || !new_comment_text) {
      res.status(400).json({
        status: 400,
        message:
          "Requête invalide :message id/commentaire id/new commentaire nécessaires",
      });
      return;
    }

    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    message = await messages.existsID(message_id);
    if (!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu",
      });
      return;
    }

    const theComment = message.comments.find((comment) => {
      return comment._id == comment_id && comment.user_id == req.params.userid;
    });
    if (!theComment) {
      res.status(401).json({
        status: 401,
        message: `commentaire de id inexistant ou non écrit par user id`,
      });
      return;
    }
    console.log("Good");

    messages
      .editComment(message_id, comment_id, new_comment_text)
      .then((id) => res.status(201).json({ id: id }))
      .catch((err) => res.status(500).send("er"));
  });

  router.patch("/user/:userid/messages/delete-comment", async (req, res) => {
    const { message_id, comment_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id/commentaire id nécessaires",
      });
      return;
    }

    user = await users.existsID(req.params.userid);
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    message = await messages.existsID(message_id);
    if (!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu",
      });
      return;
    }

    const theComment = message.comments.find((comment) => {
      return comment._id == comment_id && comment.user_id == req.params.userid;
    });
    if (!theComment) {
      res.status(401).json({
        status: 401,
        message: `commentaire de id inexistant ou non écrit par user id`,
      });
      return;
    }

    messages
      .removeComment(message_id, comment_id)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  });

  return router;
}
exports.default = init;

// try {
//   if (req.params.userid != req.session.userid) {
//     res.status(401).json({
//       status: 401,
//       message: "Utilisateur non connecté",
//     });
//     return;
//   }

//   return;
// } catch (e) {
//   // Toute autre erreur
//   res.status(500).json({
//     status: 500,
//     message: "erreur interne",
//     details: (e || "Erreur inconnue").toString(),
//   });
// }
