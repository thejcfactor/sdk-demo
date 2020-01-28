import { _ } from "vue-underscore";

const commands = [];

const codeSnippets = [
  {
    Language: "NODE26",
    Name: "preamble",
    Dependencies: [],
    CommandDependencies: [],
    Code: `
/*************************************************
* Make sure Couchbase is installed:
*   npm install couchbase
* 
* **************************************************/

{{imports}}

class SdkDemoRepository {

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

  {{code}}

}

module.exports = new SdkDemoRepository();
    `
  },
  {
    Language: "NODE26",
    Name: "connect",
    Dependencies: ['const couchbase = require("couchbase");'],
    CommandDependencies: [],
    Code: `
  connect(host, bucket, username, password, callback) {
    this.host = host;
    this.bucketName = bucket;
    this.username = username;
    this.password = password;

    this.cluster = new couchbase.Cluster(this.host);

    this.cluster.authenticate(this.username, this.password);

    let self = this;
    this.bucket = this.cluster.openBucket(this.bucketName, function(err, result) {
      if (err) {
        self.connected = false;
      } else {
        self.connected = true;
      }
      callback(err, result);
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "n1ql",
    Dependencies: ['const N1qlQuery = require("couchbase").N1qlQuery;'],
    CommandDependencies: ["connect"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "get",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  get(docId, callback) {
    this.bucket.get(docId, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "getMulti",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "getReplica",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  getReplica(docId, callback) {
    this.bucket.getReplica(docId, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "touch",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  touch(docId, expiry, callback) {
    this.bucket.touch(docId, expiry, function(err, result) {
      callback(err, result);
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "getAndTouch",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  getAndTouch(docId, expiry, callback) {
    this.bucket.getAndTouch(docId, expiry, function(err, doc) {
      let document = null;
      if (!err) {
        document = doc;
      }
      callback(err, document);
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "upsert",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "insert",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "replace",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "remove",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  remove(docId, callback) {
    this.bucket.remove(docId, function(err, result) {
      if (!err) {
        callback(err, docId);
      } else {
        callback(err, result);
      }
    });
  }
`
  },
  {
    Language: "NODE26",
    Name: "lookupIn",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "mutateIn",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
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
`
  },
  {
    Language: "NODE26",
    Name: "fts",
    Dependencies: ['const searchQuery = require("couchbase").SearchQuery;'],
    CommandDependencies: ["connect"],
    Code: `
  fts(term, indexName, fuzziness, callback) {
    if (indexName == null) {
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
    Url: "https://docs.couchbase.com/nodejs-sdk/2.6/managing-connections.html"
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
    Language: "NODE26",
    Command: "getAndTouch",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#modifying-expiraton"
  },
  {
    Language: "NODE26",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "NODE26",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "NODE26",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "NODE26",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/document-operations.html#removing-full-documents"
  },
  {
    Language: "NODE26",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/subdocument-operations.html#retrieving"
  },
  {
    Language: "NODE26",
    Command: "mutateIn",
    Url:
      "https://docs.couchbase.com/nodejs-sdk/2.6/subdocument-operations.html#mutating"
  },
  {
    Language: "NODE26",
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
  getCodeSnippet(language, commands) {
    let snippets = [];
    let dependencies = [];
    let cmdDependencies = [];

    let preamble = _.findWhere(codeSnippets, {
      Language: language,
      Name: "preamble"
    });

    if (commands && commands[0] == "all") {
      let languageSnippets = _.where(codeSnippets, { Language: language });
      for (let i = 0; i < languageSnippets.length; i++) {
        if (languageSnippets[i].Name == "preamble") {
          continue;
        }

        dependencies = dependencies.concat(languageSnippets[i].Dependencies);
        snippets.push(languageSnippets[i].Code);
      }
    } else {
      for (let i = 0; i < commands.length; i++) {
        let match = _.findWhere(codeSnippets, {
          Language: language,
          Name: commands[i]
        });
        if (match) {
          dependencies = dependencies.concat(match.Dependencies);
          cmdDependencies = cmdDependencies.concat(match.CommandDependencies);
          snippets.push(match.Code);
        }
      }
    }

    //Add viewed command dependencies in case they were not used in demo
    //this won't matter if downloading into SdkRepository file
    cmdDependencies = _.uniq(cmdDependencies);
    let missingCode = _.difference(cmdDependencies, commands);
    if (missingCode && missingCode.length > 0) {
      for (let i = 0; i < missingCode.length; i++) {
        let match = _.findWhere(codeSnippets, {
          Language: language,
          Name: missingCode[i]
        });
        if (match) {
          dependencies = dependencies.concat(match.Dependencies);
          snippets.push(match.Code);
        }
      }
    }

    let importSnippet = _.uniq(dependencies).join("\n");
    importSnippet += "\n";

    let codeSnippet = "";
    for (let i = 0; i < snippets.length; i++) {
      codeSnippet += snippets[i] + "\n";
    }

    let finalSnippet = preamble.Code.replace(
      "{{imports}}",
      importSnippet
    ).replace("{{code}}", codeSnippet);

    return finalSnippet;
  }
};
