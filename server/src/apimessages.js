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
    console.log('Session',req.session);

    next();
  });

  const users = new Users.default(db_users);
  const messages = new Messages.default(db_messages);
  
  router
  .route("/user/:userid/messages")
  .put(async (req, res) => {
    const { old_message_id,new_message } = req.body;
    // Erreur sur la requête HTTP
    if (!new_message || !old_message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide : new message/old message id nécessaires",
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

    old_message = await messages.existsID(old_message_id)
    if(!old_message) {
      res.status(401).json({
        status: 401,
        message: "Old message id inconnu"
      })
      return;
    }
    if(old_message.author_id != req.params.userid) {
      res.status(401).json({
        status: 401,
        message: "userid is not the author of old message"
      })
      return;
    }

    messages
      .update(old_message_id,new_message)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })
  .delete(async (req, res) => {
    const { message_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide : message id nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
      return;
    }
    if(message.author_id != req.params.userid) {
      res.status(401).json({
        status: 401,
        message: "userid is not the author of message"
      })
      return;
    }

    messages
      .remove(message_id)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })
  .post(async (req, res) => {
    const { message } = req.body;
    // Erreur sur la requête HTTP
    if (!message) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide : message nécessaires",
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

    messages
      .create(req.params.userid,user.login,message)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  });

  router.get("/messages", (req,res) => {
    messages
    .getAll()
    .then((mes) => res.status(201).json({messages:mes}))
    .catch((e) => res.status(401).send(e))
  })

  router.get('/user/:userid/messages/friends', async (req,res) => {

    user = await users.existsID(req.params.userid)
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    friends = await users.getFriends(req.params.userid);
    console.log("Friends",friends);
    if (!friends) {
      res.status(401).json({
        status: 401,
        message: "Erreur interne",
      });
      return;
    }

    messages
    .getUsersMessages(friends.followings)
    .then((mes) => res.status(201).json({messages:mes}))
    .catch((e) => res.status(401).send(e))
  })

  router.get('/user/:userid/messages/:friendid', async (req,res) => {

    user = await users.existsID(req.params.userid)
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    friend = await users.existsID(req.params.friendid)
    if (!friend) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    messages
    .getUsersMessages([req.params.friendid])
    .then((mes) => res.status(201).json({messages:mes}))
    .catch((e) => res.status(401).send(e))
  })

  router.get('/user/:userid/infos', async (req, res) => {

    user = await users.existsID(req.params.userid)
    if (!user) {
      res.status(401).json({
        status: 401,
        message: "Userid inconnu",
      });
      return;
    }

    messages
    .getUsersMessages([req.params.userid])
    .then((mes) => res.status(201).json({nbMessages:mes.length}))
    .catch((e) => res.status(401).send(e))
  });

  router.get('/infos', async (req, res) => {

    messages
    .getAll()
    .then((mes) => res.status(201).json({nbMessages:mes.length}))
    .catch((e) => res.status(401).send(e))
  });

  router.patch('/user/:userid/messages/like',async (req, res) =>{

    const { message_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
      return;
    }

    messages
      .addLike(message_id,req.params.userid)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })

  router.patch('/user/:userid/messages/unlike',async (req, res) =>{

    const { message_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
      return;
    }

    if(!message.likes.includes(req.params.userid)) {
      res.status(401).json({
        status:401,
        message: "userid n'a pas liké le message"
      })
      return;
    }

    messages
      .removeLike(message_id,req.params.userid)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })

  router.patch('/user/:userid/messages/comment',async (req, res) =>{

    const { message_id,comment_text } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_text) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id/commentaire nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
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
      .addComment(message_id,req.params.userid,user.login,comment_text)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })

  router.patch('/user/:userid/messages/edit-comment',async (req, res) =>{

    const { message_id,comment_id,new_comment_text } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_id || !new_comment_text) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id/commentaire id/new commentaire nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
      return;
    }

    const theComment = message.comments.find((comment) => {
      return comment._id == comment_id && comment.user_id == req.params.userid;
    });
    if(!theComment) {
      res.status(401).json({
        status:401,
        message: `commentaire de id inexistant ou non écrit par user id`
      })
      return;
    }
    console.log('Good');

    messages
      .editComment(message_id,comment_id,new_comment_text)
      .then((id) => res.status(201).json({ id: id }))
      .catch((err) => res.status(500).send("er"));
  })

  router.patch('/user/:userid/messages/delete-comment',async (req, res) =>{

    const { message_id,comment_id } = req.body;
    // Erreur sur la requête HTTP
    if (!message_id || !comment_id ) {
      res.status(400).json({
        status: 400,
        message: "Requête invalide :message id/commentaire id nécessaires",
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

    message = await messages.existsID(message_id)
    if(!message) {
      res.status(401).json({
        status: 401,
        message: "message id inconnu"
      })
      return;
    }

    const theComment = message.comments.find((comment) => {
      return comment._id == comment_id && comment.user_id == req.params.userid;
    });
    if(!theComment) {
      res.status(401).json({
        status:401,
        message: `commentaire de id inexistant ou non écrit par user id`
      })
      return;
    }

    messages
      .removeComment(message_id,comment_id)
      .then((id) => res.status(201).send({ id: id }))
      .catch((err) => res.status(500).send(err));
  })


  return router;
}
exports.default = init;
