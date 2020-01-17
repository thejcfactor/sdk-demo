import { _ } from "vue-underscore";

const commands = [];

const sampleCode = [
  {
    Language: "PYTHON25",
    Code: `
import os
import time

from couchbase.cluster import Cluster, PasswordAuthenticator
from couchbase.n1ql import N1QLQuery
from couchbase.bucket import Bucket
from couchbase.exceptions import CouchbaseError
import couchbase.subdocument as sd
import couchbase.fulltext as fts

class SdkDemoRepository(object):

    def __init__(self):
        self.host = ''
        self.bucketName = ''
        self.username = ''
        self.password = ''

        self.cluster = None
        self.bucket = None


    def connect(self, host, bucket, username, password):
        self.host = host
        self.bucketName = bucket
        self.username = username
        self.password = password

        connection_str = 'couchbase://{0}'.format(self.host)

        try:
            self.cluster = Cluster(connection_str)
            authenticator = PasswordAuthenticator(self.username, self.password)
            self.cluster.authenticate(authenticator)

            self.bucket = self.cluster.open_bucket(self.bucketName)
        except Exception as error:
            print('Could not open bucket: {0}.  Error: {1}'.format(self.bucketName, error))
            raise

    def n1ql_query(self, query):

        n1ql = N1QLQuery(query)

        results = []
        for row in self.bucket.n1ql_query(n1ql):
            results.append(row)

        return results

    def get(self, doc_id):

        try:
            result = self.bucket.get(doc_id)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV get for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def get_multi(self, doc_ids):

        try:
            results = []
            for key, result in self.bucket.get_multi(doc_ids):
                results.append({
                    'id': key,
                    'document': result.value
                })
            return results
        except Exception as error:
            print('Error performing KV getMulti for docIds: {0}. Error: {1}'.format(doc_ids, error))
            raise

    def get_replica(self, doc_id):

        try:
            result = self.bucket.get(doc_id, replica=True)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV getReplica for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def touch(self, doc_id, expiry):
        try:
            result = self.bucket.touch(doc_id, ttl=expiry)
            if result.success:
                return result.value

            return None
        except Exception as error:
            print('Error performing KV touch for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def get_and_touch(self, doc_id, expiry):

        try:
            result = self.bucket.get(doc_id, ttl=expiry)
            if result.success:
                return result.value
            return None
        except Exception as error:
            print('Error performing KV getAndTouch for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def upsert(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.upsert(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV upsert for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def insert(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.insert(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV insert for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def replace(self, doc_id, doc_value, options=None):

        try:
            result = self.bucket.replace(doc_id, doc_value)
            if result:
                return self.get(doc_id)
            return None
        except Exception as error:
            print('Error performing KV replace for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def remove(self, doc_id):

        try:
            self.bucket.remove(doc_id)
            return doc_id
        except Exception as error:
            print('Error performing KV remove for docId: {0}. Error: {1}'.format(doc_id, error))
            raise

    def lookup_in(self, doc_id, path):

        try:
            result = self.bucket.lookup_in(doc_id, sd.get(path))
            if result:
                return result[0]
            return None
        except Exception as error:
            print('Error performing KV lookupIn for docId: {0} & path: {1}. Error: {2}'.format(doc_id, path, error))
            raise

    def mutate_in(self, doc_id, path, value):

        try:
            result = self.bucket.mutate_in(doc_id, sd.upsert(path, value))
            if result:
                response =  self.lookup_in(doc_id, path)
                return response
            return None
        except Exception as error:
            print('Error performing KV mutateIn for docId: {0} & path: {1}. Error: {2}'.format(doc_id, path, error))
            raise

    def fts(self, term, index_name, fuzziness):

        try:

            results = self.bucket.search(index_name, fts.TermQuery(term, fuzziness=0), limit=10, highlight_style='html')
            response = []
            for result in results:
                response.append({
                    'id': result['id'],
                    'hit': result['locations']
                })
            return response
        except Exception as error:
            print('Error performing FTS. Error: {0}'.format(error))
            raise
`
  }
];

const documentationUrls = [
  {
    Language: "PYTHON25",
    Command: null,
    Url: "https://docs.couchbase.com/python-sdk/2.5/start-using-sdk.html"
  },
  {
    Language: "PYTHON25",
    Command: "connect",
    Url: "https://docs.couchbase.com/python-sdk/2.5/managing-connections.html"
  },
  {
    Language: "PYTHON25",
    Command: "get",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#retrieving-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "getMulti",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#batching-operations"
  },
  {
    Language: "PYTHON25",
    Command: "n1ql",
    Url: "https://docs.couchbase.com/python-sdk/2.5/n1ql-queries-with-sdk.html"
  },
  {
    Language: "PYTHON25",
    Command: "getReplica",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#retrieving-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "touch",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#modifying-expiraton"
  },
  {
    Language: "PYTHON25",
    Command: "getAndTouch",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#modifying-expiraton"
  },
  {
    Language: "PYTHON25",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#creating-and-updating-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/document-operations.html#removing-full-documents"
  },
  {
    Language: "PYTHON25",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/subdocument-operations.html#retrieving"
  },
  {
    Language: "PYTHON25",
    Command: "mutateIn",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/subdocument-operations.html#mutating"
  },
  {
    Language: "PYTHON25",
    Command: "fts",
    Url:
      "https://docs.couchbase.com/python-sdk/2.5/full-text-searching-with-sdk.html"
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
