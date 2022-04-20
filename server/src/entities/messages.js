const { ObjectId } = require("bson");

class Messages {
  constructor(db) {
    this.db = db;
    // suite plus tard avec la BD
  }

  create(userid, name, text) {
    return new Promise(async (resolve, reject) => {
      const message = {
        author_id: userid,
        author_name: name,
        date: new Date().getTime(),
        text: text,
        likes: [],
        comments: [],
      };

      this.db.insert(message, function (err, newDoc) {
        if (err) {
          //erreur
          reject();
        } else {
          // resolve(userid);
          console.log("Created message",newDoc);
          resolve(newDoc);
        }
      });
    });
  }

  update(message_id, new_text) {
    return new Promise(async (resolve, reject) => {
      this.db.update(
        { _id: message_id },
        {
          $set: {
            comments: [],
            likes: [],
            text: new_text,
            date: new Date(),
          },
        },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
            else resolve(doc);
          }
        }
      );
    });
  }

  remove(message_id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: message_id }, {}, (err, numRemoved) => {
        if (err) {
          //erreur
          reject();
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  get(message_id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: message_id }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          resolve(doc);
        }
      });
    });
  }

  addComment(message_id, user_id, user_login, comment) {
    return new Promise((resolve, reject) => {
      const id = new ObjectId();
      console.log("Id", id.toString());

      this.db.update(
        { _id: message_id },
        {
          $push: {
            comments: {
              user_id: user_id,
              user_login: user_login,
              comment: comment,
              date: new Date().toISOString(),
              _id: id.toString(),
            },
          },
          // $set: {comments:[]}
        },
        // {unique: true},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
            else resolve(doc);
          }
        }
      );
    });
  }

  editComment(message_id, comment_id, new_text) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { 'comments._id': comment_id },
        { $set: {  } },
        {},
        (err, doc) => {
          if (err) {
            console.log("Err",err);
            reject();
          } else {
            console.log('Doc',doc);
            if (!doc) reject();
            else 
            resolve(doc);
          }
        }
      );
    });
  }

  removeComment(message_id, comment_id) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: message_id },
        { $pull: { comments: { _id: comment_id } } },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
            else resolve(doc);
          }
        }
      );
    });
  }

  addLike(message_id, user_id) {
    return new Promise(async (resolve, reject) => {
      await this.db.update(
        { _id: message_id },
        {
          $push: {
            likes: user_id,
          },
        },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
            else resolve(doc);
          }
        }
      );
    });
  }

  removeLike(message_id, user_id) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: message_id },
        {
          $pull: {
            likes: user_id,
          },
        },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
            else resolve(doc);
          }
        }
      );
    });
  }

  getUsersMessages(friends_ids) {
    return new Promise((resolve, reject) => {
      console.log('Users_ids',friends_ids);
      this.db.find({ author_id: { $in: friends_ids } }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          // console.log('Doc',doc);
          if (doc) {
            resolve(doc);
          } else reject();
        }
      });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) {
          reject();
        } else {
          resolve(docs);
          // resolve(docs.length)
        }
      });
      // .sort({ date: -1 });
    });
  }

  async existsID(message_id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: message_id }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          // console.log("ExisID",doc);
          if (doc) {
            resolve(doc);
          } else resolve(false);
        }
      });
    });
  }
}

exports.default = Messages;