import { _ } from "vue-underscore";

const commands = [];

const sampleCode = [
  {
    Language: "NODE26",
    Code: `
const couchbase = require("couchbase");
const N1qlQuery = require("couchbase").N1qlQuery;
const searchQuery = require("couchbase").SearchQuery;

class SdkRepository {
  constructor() {
    this.host = "";
    this.bucketName = "";
    this.username = "";
    this.password = "";

    this.cluster = null;
    this.bucket = null;
  }

  connect(host, bucket, username, password, callback) {
    this.host = host;
    this.bucketName = bucket;
    this.username = username;
    this.password = password;

    this.cluster = new couchbase.Cluster(this.host);

    this.cluster.authenticate(this.username, this.password);

    this.bucket = this.cluster.openBucket(this.bucketName, function(err, result) {
      callback(err, result);
    });
  }

  n1qlQuery(query, callback){
    let n1qlQuery = N1qlQuery.fromString(query);
    this.bucket.query(n1qlQuery, function(err,rows){
      let results = [];
      if(!err){
        for(var row in rows){
          results.push(rows[row])
        }
      }
      callback(err, results);
    });
  }

  get(docId, callback){
    this.bucket.get(docId, function(err, doc){
      let document = null;
      if(!err){
        document = doc;
      }
      callback(err, document);
    });
  }

  getMulti(docIds, callback){
    let results = []
    this.bucket.getMulti(docIds, function(err, docs){
      if(!err){
        for (var key in docs) {
          if (docs[key].error){
            continue;
          } 
          results.push(docs[key]);
        }
      }
      callback(err, results);
    });
  }

  getReplica(docId, callback){
    this.bucket.getReplica(docId, function(err, doc){
      let document = null;
      if(!err){
        document = doc;
      }
      callback(err, document);
    });
  }

  touch(docId, expiry, callback){
    this.bucket.touch(docId, expiry, function(err, result){
      callback(err, result);
    });
  }

  getAndTouch(docId, expiry, callback){
    this.bucket.getAndTouch(docId, expiry, function(err, doc){
      let document = null;
      if(!err){
        document = doc;
      }
      callback(err, document);
    });
  }

  upsert(docId, docValue, options, callback){
    let self = this;
    this.bucket.upsert(docId, docValue, options, function(err, result){
      if(!err){
        self.get(docId, callback);
      }
      else{
        callback(err, result);
      }      
    });
  }

  insert(docId, docValue, options, callback){
    let self = this;
    this.bucket.insert(docId, docValue, options, function(err, result){
      if(!err){
        self.get(docId, callback);
      }
      else{
        callback(err, result);
      }
    });
  }

  replace(docId, docValue, options, callback){
    let self = this;
    this.bucket.replace(docId, docValue, options, function(err, result){
      if(!err){
        self.get(docId, callback);
      }
      else{
        callback(err, result);
      }
    });
  }

  remove(docId, callback){
    this.bucket.remove(docId, function(err, result){
      if(!err){
        callback(err, docId);
      }
      else{
        callback(err, result);
      }
    });
  }

  lookupIn(docId, path, callback){
    this.bucket.lookupIn(docId)
      .get(path).execute(function(err, result){
        let subDoc = null;
        if(!err){
          subDoc = {
            path: path,
            result: result.content(path)
          };
        }
        callback(err, subDoc);
    });
    
  }

  mutateIn(docId, path, value, callback){
    this.bucket.mutateIn(docId)
      .upsert(path, value).execute(function(err, result){
        let subDoc = null;
        if(!err){
          //console.log(result);
          subDoc = {
            path: path,
            success: result.content(path) ? true : false
          };
        }
        callback(err, subDoc);
    });
  }

  fts(term, indexName, fuzziness, callback){
    let match = searchQuery.term(term).fuzziness(fuzziness);
    let query = searchQuery.new(indexName, match).limit(10).highlight();

    this.bucket.query(query, function(err, res, meta){
      let results = [];
      if(!err){
        for(let i = 0; i < res.length; i++){
          results.push({
            "id": res[i].id,
            "hit": res[i].locations
          });
        }
      }
      callback(err, results);
    });
  }
}

module.exports = new SdkRepository();
    `
  }
];

const documentationUrls = [
  {
    Language: "NODE26",
    Command: null,
    Url: "https://docs.couchbase.com/nodejs-sdk/2.6/start-using-sdk.html"
  },
  {
    Language: "NODE26",
    Command: "connect",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/current/managing-connections.html"
  },
  {
    Language: "NODE26",
    Command: "get",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#retrieving-full-documents"
  },
  {
    Language: "NODE26",
    Command: "getMulti",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#batching-operations"
  },
  {
    Language: "NODE26",
    Command: "n1ql",
    Url: "https://docs.couchbase.com/nodejs-sdk/2.6/n1ql-queries-with-sdk.html"
  },
  {
    Language: "NODE26",
    Command: "getReplica",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#retrieving-full-documents"
  },
  {
    Language: "NODE26",
    Command: "touch",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#modifying-expiraton"
  },
  {
    Language: "PYTHON25",
    Command: "getAndTouch",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#modifying-expiraton"
  },
  {
    Language: "PYTHON25",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#removing-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/subdocument-operations.html#retrieving"
  },
  {
    Language: "PYTHON25",
    Command: "mutateIn",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/subdocument-operations.html#mutating"
  },
  {
    Language: "PYTHON25",
    Command: "fts",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/full-text-searching-with-sdk.html"
  }
];

export default {
  getDocumentationUrl(language, command) {
    let commandName = command ? command.Name : null;
    let documentationUrl = _.findWhere(documentationUrls, {
      Language: language,
      Command: commandName
    });

    return documentationUrl;
  },
  getLanguageSpecificCommands(language) {
    let matchingCommands = _.where(commands, { Language: language });
    if (matchingCommands && matchingCommands.length > 0) {
      return matchingCommands;
    }
    return [];
  },
  getSampleCode(language) {
    let matchingSampleCode = _.findWhere(sampleCode, { Language: language });
    if (matchingSampleCode) {
      return matchingSampleCode.Code;
    }
  }
};
