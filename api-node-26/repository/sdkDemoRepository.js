const couchbase = require("couchbase");
const N1qlQuery = require("couchbase").N1qlQuery;
const searchQuery = require("couchbase").SearchQuery;

class SdkRepository {
  constructor() {
    this.host = "";
    this.bucketName = "";
    this.username = "";
    this.password = "";
    this.sampleIds = [];

    this.cluster = null;
    this.bucket = null;
    this.connected = false;
  }

  connect(host, bucket, username, password, callback) {
    this.host = host;
    this.bucketName = bucket;
    this.username = username;
    this.password = password;

    this.cluster = new couchbase.Cluster(this.host);

    this.cluster.authenticate(this.username, this.password);

    let self = this;
    this.bucket = this.cluster.openBucket(this.bucketName, function(
      err,
      result
    ) {
      if (err) {
        self.connected = false;
      } else {
        self.connected = true;
      }
      callback(err, result);
    });
  }

  getSampleDocIds(callback) {
    let bucket = this.bucketName;
    if (bucket.includes("-")) {
      bucket = "`" + this.bucketName + "`";
    }

    let query = N1qlQuery.fromString(
      "SELECT meta().id FROM " + bucket + " LIMIT 5;"
    );

    let self = this;
    this.bucket.query(query, function(err, rows) {
      if (!err) {
        self.sampleIds = [];
        for (var row in rows) {
          self.sampleIds.push(rows[row].id);
        }
      }
      callback(err, self.sampleIds);
    });
  }

  n1qlQuery(query, prepare, parameters, callback) {
    let n1qlQuery = N1qlQuery.fromString(query);

    if (prepare != null && prepare) {
      n1qlQuery.adhoc(true);
    }

    this.bucket.query(n1qlQuery, parameters, function(err, rows) {
      let results = [];
      if (!err) {
        for (var row in rows) {
          results.push(rows[row]);
        }
      }
      callback(err, results);
    });
  }

  get(docId, callback) {
    this.bucket.get(docId, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }

  getMulti(docIds, callback) {
    let results = [];
    this.bucket.getMulti(docIds, function(err, docs) {
      if (!err) {
        for (var key in docs) {
          if (docs[key].error) {
            continue;
          }
          results.push(docs[key]);
        }
      }
      callback(err, results);
    });
  }

  getReplica(docId, callback) {
    this.bucket.getReplica(docId, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }

  touch(docId, expiry, callback) {
    this.bucket.touch(docId, expiry, function(err, result) {
      callback(err, result);
    });
  }

  getAndTouch(docId, expiry, callback) {
    this.bucket.getAndTouch(docId, expiry, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }

  upsert(docId, docValue, options, callback) {
    let self = this;
    this.bucket.upsert(docId, docValue, options, function(err, result) {
      if (!err) {
        self.get(docId, callback);
      } else {
        callback(err, result);
      }
    });
  }

  insert(docId, docValue, options, callback) {
    let self = this;
    this.bucket.insert(docId, docValue, options, function(err, result) {
      if (!err) {
        self.get(docId, callback);
      } else {
        callback(err, result);
      }
    });
  }

  replace(docId, docValue, options, callback) {
    let self = this;
    this.bucket.replace(docId, docValue, options, function(err, result) {
      if (!err) {
        self.get(docId, callback);
      } else {
        callback(err, result);
      }
    });
  }

  remove(docId, callback) {
    this.bucket.remove(docId, function(err, result) {
      if (!err) {
        callback(err, docId);
      } else {
        callback(err, result);
      }
    });
  }

  lookupIn(docId, path, callback) {
    this.bucket
      .lookupIn(docId)
      .get(path)
      .execute(function(err, result) {
        let subDoc = null;
        if (!err) {
          subDoc = {
            path: path,
            result: result.content(path)
          };
        }
        callback(err, subDoc);
      });
  }

  mutateIn(docId, path, value, callback) {
    this.bucket
      .mutateIn(docId)
      .upsert(path, value)
      .execute(function(err, result) {
        let subDoc = null;
        if (!err) {
          subDoc = {
            path: path,
            success: result.content(path) ? true : false
          };
        }
        callback(err, subDoc);
      });
  }

  fts(term, indexName, fuzziness, callback) {
    if (indexName == null || indexName === "") {
      indexName = "default";
    }

    let match =
      fuzziness != null
        ? searchQuery.term(term).fuzziness(fuzziness)
        : searchQuery.term(term);

    let query = searchQuery
      .new(indexName, match)
      .limit(10)
      .highlight();

    this.bucket.query(query, function(err, res, meta) {
      let results = [];
      if (!err) {
        for (let i = 0; i < res.length; i++) {
          results.push({
            id: res[i].id,
            hit: res[i].locations
          });
        }
      }
      callback(err, results);
    });
  }

  disconnect() {
    this.bucket.disconnect();
    this.bucket = null;
    this.cluster = null;
  }
}

module.exports = new SdkRepository();
