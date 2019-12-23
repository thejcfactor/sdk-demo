const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // use to auto gen console logs
const bodyParser = require("body-parser"); // can enforce JSON

const SdkController = require("./controllers/sdkDemoController");


var app = express();
var port = process.env.API_PORT;
app.use(cors());
app.use(morgan("dev")); // log express requests
app.use(bodyParser.urlencoded({ extended: "true" })); // parse as JSON
app.use(bodyParser.json()); // parse as JSON
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse as JSON

app.get("/api/node26/ping", SdkController.ping);
app.post("/api/node26/connect", SdkController.connect);
app.post("/api/node26/n1qlQuery", SdkController.n1qlQuery);
app.post("/api/node26/get", SdkController.get);
app.post("/api/node26/getMulti", SdkController.getMulti);
app.post("/api/node26/upsert", SdkController.upsert);
app.post("/api/node26/insert", SdkController.insert);
app.post("/api/node26/replace", SdkController.replace);
app.post("/api/node26/remove", SdkController.remove);
app.post("/api/node26/lookupIn", SdkController.lookupIn);

if(typeof port == "undefined"){
    port = 8003;
}

app.listen(port, () => {
    console.log("App listening on port " + port);
  });