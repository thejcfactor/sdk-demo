// *****************************************************************************
// Updated version of SDK demo (original demo created by Tony Duarte)
// *****************************************************************************

var express = require("express");
var cors = require("cors");
var morgan = require("morgan"); // use to auto gen console logs
var bodyParser = require("body-parser"); // can enforce JSON

var couchbase = require("couchbase");
var N1qlQuery = require("couchbase").N1qlQuery; // if you want to do N1QL ops
var app = express();
//var port = 8081;
var port = process.env.API_PORT;

var cluster = undefined,
  bucket = undefined;

var defaultHost = process.env.DEFAULT_HOST;

// var cluster = new couchbase.Cluster('couchbase://localhost', function(err) {
//   if (err)
//      console.log("server.js: Failed connection to cluster " + err);
// });

// cluster.authenticate('Administrator','password');

// var bucket = cluster.openBucket('travel-sample',function(err) {
//   if (err)
//      console.log("server.js: Error in openBucket -  " + err);
// });

//console.log(bucket);

// *****************************************************************************
// ***********      CONFIG WEB SERVER        ***********************************
// *****************************************************************************
app.use(cors());
//app.use(express.static('public'));               // serve index.html from /publi
//app.use('/client', express.static('node_modules'));
app.use(morgan("dev")); // log express requests
app.use(bodyParser.urlencoded({ extended: "true" })); // parse as JSON
app.use(bodyParser.json()); // parse as JSON
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse as JSON

// *****************************************************************************
// ***********    SETUP    *******************************************************
// *****************************************************************************
// Use get(docId) to get a KV pair
app.post("/api/setupPOST/config", function(req, res) {
  if (!req.body.host)
    res.json(
      "server.js: Error no configuration info" + JSON.stringify(req.body)
    );
  else {
    var host = "couchbase://";
    if(req.body.host == "localhost"){
        host += defaultHost + "?operation_timeout=10.0";
    }
    else{
        host += req.body.host + "?operation_timeout=10.0";
    }
    console.log(host);
    //var host = "couchbase://" + req.body.host + "?operation_timeout=10.0";
    cluster = new couchbase.Cluster(host, function(err) {
      if (err) console.log("server.js: Failed connection to cluster " + err);
    });

    var username = req.body.username;
    var pw = req.body.pw;

    cluster.authenticate(username, pw);

    //var clusterManager = cluster.manager(username, pw);
    //console.log(clusterManager);

    var bucketName = req.body.bucket;
    //console.log(bucketName);
    bucket = cluster.openBucket(bucketName, function(err) {
      if (err) console.log("server.js: Error in openBucket -  " + err);
    });

    if (bucketName.includes("-")) {
      bucketName = "`" + bucketName + "`";
    }

    var query = N1qlQuery.fromString(
      "SELECT meta().id FROM " + bucketName + " LIMIT 5;"
    );
    bucket.query(query, function(err, rows) {
      if (err) res.send("server.js:Query Err:" + err);
      else {
        var ids = [];
        for (var row in rows) {
          ids.push(rows[row]);
        }
        res.send(JSON.stringify(ids));
      }
    });
  }
});

// *****************************************************************************
// **********    QUERY (N1QL)   ************************************************
// *****************************************************************************
// Use bucket.query() to issue N1QL request
app.post("/api/recvPOST/query", function(req, res) {
  if (!req.body.query)
    res.json("server.js Err no query text" + JSON.stringify(req.body));
  else {
    var query = N1qlQuery.fromString(req.body.query);
    //query.consistency(couchbase.N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, function(err, rows) {
      if (err) {
        res.send("server.js:Query Err:" + err);
      } else {
        res.send(rows);
      }
    });
  }
});

// *****************************************************************************
// ***********    GET    *******************************************************
// *****************************************************************************
// Use get(docId) to get a KV pair
app.post("/api/recvPOST/get", function(req, res) {
  if (!req.body.docIdget)
    res.json("server.js:Error no docId" + JSON.stringify(req.body));
  else {
    bucket.get(req.body.docIdget, function(err, result) {
      if (err) res.send(JSON.stringify("server.js:get Err:" + err));
      else res.send(result);
    });
  }
});

// *****************************************************************************
// ********************   GETMULTI   *******************************************
// *****************************************************************************
// Requires array of docIds to retrieve multiple documents in a map
// Err=1 if at least one get() failed to execute successfully
// Returns null or undefined for missing documents while others have data
app.post("/api/recvPOST/getMulti", function(req, res) {
  if (!req.body.docIdgetMulti)
    res.json("server.js:Err no docIds" + JSON.stringify(req.body));
  else {
    var tmp = JSON.parse(req.body.docIdgetMulti); // cvt string to array
    bucket.getMulti(tmp, function(err, result) {
      if (err) console.log("server.js: WARN getMulti docs not found: " + err);
      // drop through even with err and test results - for partial data
      //   var allResults="";
      //   for(var key in result) {
      //      if(result[key].error) continue;                // skip bad recs
      //      allResults=allResults+"ROW: "+JSON.stringify(result[key])+"\n";
      //   }
      var allResults = [];
      for (var key in result) {
        if (result[key].error) continue;
        allResults.push(result[key]);
      }
      res.send(allResults);
    });
  }
});

// *****************************************************************************
// ************      GETREPLICA     ********************************************
// *****************************************************************************
// Use get(docId) to get a KV pair
app.post("/api/recvPOST/getReplica", function(req, res) {
  if (!req.body.docIdgetReplica)
    res.json("server.js: Error no replica docId" + JSON.stringify(req.body));
  else {
    bucket.getReplica(req.body.docIdgetReplica, function(err, result) {
      if (err) res.send("server.js:Err getReplica:" + JSON.stringify(err));
      else res.json(result);
    });
  }
});

// *****************************************************************************
// *************      INSERT     ***********************************************
// *****************************************************************************
// Create KVpair if docId doesn't already exist in bucket
// Note: If only send replicate_to option and no replicas then dies
app.post("/api/recvPOST/insert", function(req, res) {
  if (!req.body.docIdinsert)
    res.json("server.js: Err no docId" + JSON.stringify(req.body));
  else {
    var tmpArr = []; // construct single arg from incoming args
    if (req.body.persistTo) tmpArr.push('"persist_to":' + req.body.persistTo);
    if (req.body.replicateTo)
      tmpArr.push('"replicate_to":' + req.body.replicateTo);
    var arg3 = "{";
    for (var i = 0; i < tmpArr.length; i++) {
      arg3 += arg3.length > 1 ? "," : "";
      arg3 += tmpArr[i];
    }
    arg3 += "}";
    var arg3obj = JSON.parse(arg3); // convert from string to object
    bucket.insert(req.body.docIdinsert, req.body.doc, arg3obj, function(
      err,
      result
    ) {
      if (err)
        res.send(
          "server.js: Err insert: " + JSON.stringify(err) + JSON.stringify(arg3)
        );
      else res.json(result);
    });
  }
});

// *****************************************************************************
// ***********      UPSERT     *************************************************
// *****************************************************************************
// Always replace the document, whether docId already exists or not
// if options: (K, V, {cas:x,expiry:y,persist_to:z,replicate_to:q},callback)
// if specify repliateTo and no replicas on cluster - SDK dies
app.post("/api/recvPOST/upsert", function(req, res) {
  if (!req.body.docIdupsert || !req.body.doc)
    res.json("server.js: Upsert Err no docId or no doc");
  else {
    var tmpArr = []; // construct single arg from incoming args
    if (req.body.persistTo) tmpArr.push('"persist_to":' + req.body.persistTo);
    if (req.body.replicateTo)
      tmpArr.push('"replicate_to":' + req.body.replicateTo);
    if (req.body.casUpsert) tmpArr.push('"cas":' + req.body.casUpsert);
    var arg3 = "{";
    for (var i = 0; i < tmpArr.length; i++) {
      arg3 += arg3.length > 1 ? "," : "";
      arg3 += tmpArr[i];
    }
    arg3 += "}";
    var arg3obj = JSON.parse(arg3); // convert from string to object

    bucket.upsert(req.body.docIdupsert, req.body.doc, arg3obj, function(
      err,
      result
    ) {
      if (err) res.send("server.js: Err upsert: " + JSON.stringify(err) + arg3);
      else res.json(result);
    });
  }
});

// *****************************************************************************
// ************      REPLACE     ***********************************************
// *****************************************************************************
// Replace the doc, but only if the docId already exists in the bucket
app.post("/api/recvPOST/replace", function(req, res) {
  //console.log("server.js: recvPOST/replace :"+JSON.stringify(req.body));
  var theCAS;
  if (!req.body.docId) {
    res.json("Replace Err no docId");
  } else {
    if (req.body.casReplace)
      // cas was passed in
      theCAS = JSON.parse('{"cas":' + req.body.casReplace + "}");
    else theCAS = JSON.parse("{}");

    bucket.replace(req.body.docIdreplace, req.body.doc, theCAS, function(
      err,
      result
    ) {
      if (err) {
        console.log("server.js: Error replace: " + err);
        return;
      }
      console.log("server.js: rtnd recvPOST/replace: " + result);
      res.json(result);
    });
  }
});

// *****************************************************************************
// ************      REMOVE     ************************************************
// *****************************************************************************
// Remove a KVpair by docId (a docId is the key of KV pair)
app.post("/api/recvPOST/remove", function(req, res) {
  //console.log("server.js: recvPOST/remove :"+JSON.stringify(req.body));
  if (!req.body.docIdremove) {
    res.json("server.js:remove: Err no docId" + JSON.stringify(req.body));
  } else {
    bucket.remove(req.body.docIdremove, function(err, result) {
      if (err)
        //console.log("server.js: Err remove: "+err);
        res.send("server.js: Err remove: " + JSON.stringify(err));
      else {
        //console.log("server.js: rtnd recvPOST/remove:"+result);
        res.json(result);
      }
    });
  }
});

// *****************************************************************************
// ************      LOOKUPIN     **********************************************
// *****************************************************************************
// Requires docId & path then can get propeties at path or test if path exists
app.post("/api/recvPOST/lookupIn", function(req, res) {
  if (!req.body.docIdlookupIn || !req.body.pathLookupIn) {
    res.json(
      "server.js lookupIn Err no doc or no path" + JSON.stringify(req.body)
    );
  } else {
    bucket
      .lookupIn(req.body.docIdlookupIn)
      .get(req.body.pathLookupIn)
      .execute(function(err, result) {
        if (err)
          res.send("server.js: Couchbase Err lookupIn: " + JSON.stringify(err));
        else res.json(result.content);
      });
  }
});

// *****************************************************************************
// ************      MUTATEIN     **********************************************
// *****************************************************************************
// Modifies JSON properties at a path in a document ("subdocument API")
app.post("/api/recvPOST/mutatein", function(req, res) {
  if (!req.body.docIdmutatein) {
    res.json("server.js:mutatein Err no docId" + JSON.stringify(req.body));
  } else {
    bucket
      .mutateIn(req.body.docIdmutatein, 0, 0)
      .upsert(req.body.pathMutatein, req.body.doc, true)
      .execute(function(err, result) {
        if (err) res.send("server.js: Err mutateIn: " + JSON.stringify(err));
        else res.json(result);
      });
  }
});

// *****************************************************************************
// ************      TOUCH     *************************************************
// *****************************************************************************
// Set new expiry on KV pair. Time in seconds
app.post("/api/recvPOST/touch", function(req, res) {
  if (!req.body.expiry || !req.body.docIdtouch) {
    res.json(
      "server.js: Touch Err no expiry or no docId" + JSON.stringify(req.body)
    );
  } else {
    var theExpiry = JSON.parse(req.body.expiry); // cvt string to number
    bucket.touch(req.body.docIdtouch, theExpiry, function(err, result) {
      if (err) {
        res.send("server.js: Couchbase touch: " + JSON.stringify(err));
      } else {
        res.json(result);
      }
    });
  }
});

// *****************************************************************************
// ************      GETANDTOUCH     *******************************************
// *****************************************************************************
// Get document and modify it's expiry time in seconds
app.post("/api/recvPOST/getAndTouch", function(req, res) {
  if (!req.body.expiry || !req.body.docIdgetAndTouch) {
    res.json(
      "server.js: getAndTouch Err no docId or no expiry" +
        JSON.stringify(req.body)
    );
  } else {
    var theExpiry = JSON.parse(req.body.expiry); // cvt string to number
    bucket.getAndTouch(req.body.docIdgetAndTouch, theExpiry, function(
      err,
      result
    ) {
      if (err)
        res.send(
          "server.js: Couchbase Err getAndTouch: " + JSON.stringify(err)
        );
      else {
        res.json(result);
      }
    });
  }
});

// *****************************************************************************
// ****************    QUERY  (FTS)   *****************************************
// ****************************************************************************
// "term" => exact match, "match" => analyzes search string so fuzzy search
app.post("/api/recvPOST/fts", function(req, res) {
  if (!req.body.ftsIndexToUse || !req.body.ftsMatch)
    res.json("server.js:FTS Err no index or string" + JSON.stringify(req.body));
  else {
    var SearchQuery = couchbase.SearchQuery;
    var query;
    if (!req.body.ftsField)
      // search all values of bkt
      query = SearchQuery.new(
        req.body.ftsIndexToUse,
        SearchQuery.match(req.body.ftsMatch)
      );
    // search only in attribute
    else
      query = SearchQuery.new(
        req.body.ftsIndexToUse,
        SearchQuery.match(req.body.ftsMatch).field(req.body.ftsField)
      );
    bucket.query(query, function(err, result) {
      if (err) res.send("server.js: fts err: " + JSON.stringify(err));
      else {
        // rtn only keys and score
        console.log("server.js: rtnd recvPOST/fts:" + JSON.stringify(result));
        var justKeys = "";
        for (var i = 0; i < result.length; i++) {
          justKeys =
            justKeys + result[i].id + " score:" + result[i].score + "\n";
        }
        res.send(result.length == 0 ? "No results" : result);
      }
    });
  }
});

// ****************************************************************************
// ****************    START WEB SERVER   *************************************
// ****************************************************************************
app.listen(port, () => {
  console.log("App listening on port " + port);
});
