const SdkDemoRepository = require("../repository/sdkDemoRepository");

class SdkDemoService {
  constructor() {
    this.repository = SdkDemoRepository;
    this.host = process.env.CB_HOST;
  }

  connect(host, bucket, username, password, callback) {
    let isParentHostMac = this.isParentHostMac();

    if (this.repository.connected) {
      console.log("connected...need to disconnect");
      this.repository.disconnect();
    }

    let self = this;
    if (
      !(
        isParentHostMac &&
        (host.toLowerCase() == "localhost" || host == "127.0.0.1")
      )
    ) {
      console.log("Parent system isn't Mac, localhost can be used");
      this.repository.connect(
        `couchbase://${host}`,
        bucket,
        username,
        password,
        function(err, result) {
          if (err) {
            callback(err, result);
          } else {
            self.repository.getSampleDocIds(callback);
          }
        }
      );
    } else {
      this.repository.connect(
        `couchbase://${this.host}`,
        bucket,
        username,
        password,
        function(err, result) {
          if (err) {
            callback(err, result);
          } else {
            self.repository.getSampleDocIds(callback);
          }
        }
      );
    }
  }

  n1qlQuery(query, callback){
      this.repository.n1qlQuery(query, callback);
  }

  get(docId, callback){
    this.repository.get(docId, callback);
  }

  getMulti(docIds, callback){
    this.repository.getMulti(docIds, callback);
  }

  getReplica(docId, callback){
    this.repository.getReplica(docId, callback);
  }

  touch(docId, expiry, callback){
    this.repository.touch(docId, expiry, callback);
  }

  getAndTouch(docId, expiry, callback){
    this.repository.getAndTouch(docId, expiry, callback);
  }

  upsert(docId, doc, options, callback){
    this.repository.upsert(docId, doc, options, callback);
  }

  insert(docId, doc, options, callback){
    this.repository.insert(docId, doc, options, callback);
  }

  replace(docId, doc, options, callback){
    this.repository.replace(docId, doc, options, callback);
  }

  remove(docId, callback){
    this.repository.remove(docId, callback);
  }

  lookupIn(docId, path, callback){
    this.repository.lookupIn(docId, path, callback);
  }

  mutateIn(docId, path, value, callback){
    this.repository.mutateIn(docId, path, value, callback);
  }

  fts(term, indexName, fuzziness, callback){
    this.repository.fts(term, indexName, fuzziness, callback);
  }

  isParentHostMac() {
    let isMac = process.env.OS_PARENT_MAC;
    if (isMac == null || typeof isMac == "undefined") {
      return false;
    }

    let parentSystemIsMac = isMac.toLowerCase() == "true";

    console.log("Parent system is Mac:  " + parentSystemIsMac);

    return parentSystemIsMac;
  }
}

module.exports = SdkDemoService;
