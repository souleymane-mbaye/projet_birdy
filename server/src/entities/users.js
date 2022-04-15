const bcrypt = require("bcrypt");
const { resolve } = require("path");

class Users {
  constructor(db) {
    this.db = db;
    // suite plus tard avec la BD
  }

  create(email, login, password, lastname, firstname) {
    return new Promise(async (resolve, reject) => {
      const salt = await bcrypt.genSalt();
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          //erreur
          reject();
          return;
        }
        const user = {
          email: email,
          login: login,
          password: hash,
          lastname: lastname,
          firstname: firstname,
          followings: [],
          followers: [],
          profil: "",
          bio: "",
        };

        this.db.insert(user, function (err, newDoc) {
          if (err) {
            //erreur
            reject();
          } else {
            // resolve(userid);
            resolve(newDoc);
          }
        });
      });
    });
  }

  remove(user_id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: user_id }, {}, (err, numRemoved) => {
        if (err) {
          //erreur
          reject();
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  get(userid) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: userid }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          resolve(doc);
        }
      });
    });
  }

  addFriend(user_id_l, user_id_d) {
    return new Promise(async (resolve, reject) => {
      await this.db.update(
        { _id: user_id_l },
        { $push: { followings: user_id_d } },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
          }
        }
      );

      await this.db.update(
        { _id: user_id_d },
        { $push: { followers: user_id_l } },
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

  deleteFriend(user_id_l, user_id_d) {
    return new Promise(async (resolve, reject) => {
      await this.db.update(
        { _id: user_id_l },
        { $pull: { followings: user_id_d } },
        {},
        (err, doc) => {
          if (err) {
            reject();
          } else {
            if (!doc) reject();
          }
        }
      );

      await this.db.update(
        { _id: user_id_d },
        { $pull: { followers: user_id_l } },
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

  getFriends(userid) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: userid }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          if (doc) {
            const ret = {
              followers: doc.followers,
              followings: doc.followings,
            };
            resolve(ret);
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
    });
  }

  async exists_email(email) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email: email }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          if (doc) resolve(doc);
          else resolve(false);
        }
      });
    });
  }
  async exists_login(login) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ login: login }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          if (doc) resolve(doc);
          else resolve(false);
        }
      });
    });
  }
  async exists_id(user_id) {
    console.log("User id i",user_id);
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: user_id }, (err, doc) => {
        if (err) {
          //erreur
          console.log("Reject");
          reject();
        } else {
          console.log("ExisID",doc);
          if (doc) {
            resolve(doc);
          } else resolve(false);
        }
      });
    });
  }

  check_login_password(login, password) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ login: login }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          if (!doc) {
            resolve(false);
          } else {
            bcrypt.compare(password, doc.password, (err, result) => {
              console.log("Reseult", result);
              if (result == true) resolve(doc._id);
              else resolve(false);
            });
          }
        }
      });
    });
  }
  check_email_password(email, password) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email: email }, (err, doc) => {
        if (err) {
          //erreur
          reject();
        } else {
          if (!doc) {
            resolve(false);
          } else {
            bcrypt.compare(password, doc.password, (err, result) => {
              console.log("Reseult", result);
              if (result == true) resolve(doc._id);
              else resolve(false);
            });
          }
        }
      });
    });
  }

  upload_profil(user_id, fileName) {
    return new Promise((resolve, resject) => {
      this.db.update(
        { _id: user_id },
        {
          $set: { profil: fileName},
        },
        {},
        (err, doc) => {
          if (err) {
            resject();
          } else {
            if (!doc) resolve(false);
            else resolve(true);
          }
        }
      );
    });
  }

  async set_bio(user_id, bio) {
    return new Promise((resolve, resject) => {
      this.db.update(
        { _id: user_id },
        {
          $set: { bio: bio},
        },
        {},
        (err, doc) => {
          if (err) {
            resject();
          } else {
            if (!doc) resolve(false);
            else resolve(true);
          }
        }
      );
    });
  }
}

exports.default = Users;
