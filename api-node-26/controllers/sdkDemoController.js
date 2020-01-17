const SdkService = require("../services/sdkDemoService");

let service = new SdkService();

const SdkDemoController = {
  ping(req, res) {
    return res.status(200).send("pong!");
  },

  connect(req, res) {
    if (
      !req.body.host ||
      !req.body.bucket ||
      !req.body.username ||
      !req.body.password
    ) {
      return res.status(500).send({
        message: "No configuration info found",
        data: JSON.stringify(req.body)
      });
    } else {
      let host = req.body.host;
      let bucket = req.body.bucket;
      let username = req.body.username;
      let password = req.body.password;

      service.connect(host, bucket, username, password, function(err, result) {
        if (err) {
          return res.status(500).send({
            message: "Error trying to connect to Couchbase.",
            error: err.message
          });
        } else {
          let message = `Connected to ${bucket}`;
          return res.status(200).send({ message: message, data: result });
        }
      });
    }
  },

  n1qlQuery(req, res) {
    if (!req.body.query) {
      return res.status(500).send({
        message: "No query provided."
      });
    } else {
      let query = req.body.query;
      console.log(query);
      service.n1qlQuery(query, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute N1QL query.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  get(req, res) {
    if (!req.body.docId) {
      return res.status(500).send({
        message: "No document Id provided."
      });
    } else {
      let docId = req.body.docId;
      service.get(docId, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute get KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  getMulti(req, res) {
    if (!req.body.docIds) {
      return res.status(500).send({
        message: "No document Id(s) provided."
      });
    } else {
      let docIds = req.body.docIds;
      service.getMulti(docIds, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute getMulti KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  getReplica(req, res) {
    if (!req.body.docId) {
      return res.status(500).send({
        message: "No document Id provided."
      });
    } else {
      let docId = req.body.docId;
      service.getReplica(docId, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute getReplica KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  touch(req, res) {
    if (!req.body.docId || !req.body.expiry) {
      return res.status(500).send({
        message: "No document Id or expiry provided."
      });
    } else {
      let docId = req.body.docId;
      let expiry = JSON.parse(req.body.expiry);
      service.touch(docId, expiry, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute touch KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },
  
  getAndTouch(req, res) {
    if (!req.body.docId || !req.body.expiry) {
      return res.status(500).send({
        message: "No document Id or expiry provided."
      });
    } else {
      let docId = req.body.docId;
      let expiry = JSON.parse(req.body.expiry);
      service.getAndTouch(docId, expiry, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute getAndTouch KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },
  
  upsert(req, res) {
    if (!req.body.docId || !req.body.doc) {
      res.status(500).send({ message: "No document Id or document provided." });
    } else {
      let docId = req.body.docId;
      let docValue = req.body.doc;
      let options = {};
      if (req.body.persistTo){
        options.persist_to = req.body.persistTo;
      }
      if (req.body.replicateTo){
        options.persist_to = req.body.replicateTo;
      }
      service.upsert(docId, docValue, options, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute upsert KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  insert(req, res) {
    if (!req.body.docId || !req.body.doc) {
      res.status(500).send({ message: "No document Id or document provided." });
    } else {
      let docId = req.body.docId;
      let docValue = req.body.doc;
      let options = {};
      if (req.body.persistTo){
        options.persist_to = req.body.persistTo;
      }
      if (req.body.replicateTo){
        options.persist_to = req.body.replicateTo;
      }
      service.insert(docId, docValue, options, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute insert KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  replace(req, res) {
    if (!req.body.docId || !req.body.doc) {
      res.status(500).send({ message: "No document Id or document provided." });
    } else {
      let docId = req.body.docId;
      let docValue = req.body.doc;
      let options = {};
      if (req.body.persistTo){
        options.persist_to = req.body.persistTo;
      }
      if (req.body.replicateTo){
        options.persist_to = req.body.replicateTo;
      }
      service.replace(docId, docValue, options, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute replace KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  remove(req, res) {
    if (!req.body.docId) {
      res.status(500).send({ message: "No document Id provided." });
    } else {
      let docId = req.body.docId;
      service.remove(docId, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute remove KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  lookupIn(req, res){
    if(!req.body.docId || !req.body.path){
      res.status(500).send({ message: "No document Id or sub-document path provided." });
    }else{
      let docId = req.body.docId;
      let path = req.body.path;
      service.lookupIn(docId, path, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute lookupIn KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  mutateIn(req, res){
    if(!req.body.docId || !req.body.path){
      res.status(500).send({ message: "No document Id or sub-document path provided." });
    }else{
      let docId = req.body.docId;
      let path = req.body.path;
      let value = req.body.value;
      service.mutateIn(docId, path, value, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "Error trying to execute mutateIn KV command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  },

  fts(req, res){
    if(!req.body.term){
      res.status(500).send({ message: "No search term provided." });
    }else{
      let term = req.body.term;
      //TODO:
      //let index = req.body.index;
      let fuzzy = JSON.parse(req.body.fuzziness);
      service.fts(term, null, fuzzy, function(err, result) {
        if (err) {
          return res
            .status(500)
            .send({
              message:"Error trying to execute fts command.",
              error: err.message
            });
        } else {
          return res.status(200).send(result);
        }
      });
    }
  }
};

module.exports = SdkDemoController;
