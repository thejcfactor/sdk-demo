import { _ } from "vue-underscore";

const commands = [];

const codeSnippets = [
  {
    Language: "PYTHON25",
    Name: "preamble",
    Dependencies: [],
    CommandDependencies: [],
    Code: `
"""
  Make sure libcouchbase is installed:
    details:  https://docs.couchbase.com/c-sdk/2.10/sdk-release-notes.html

  Make sure Couchbase is installed:
    Linux:
      sudo -H pip install couchbase

    MacOS/Windows:
      pip install couchbase
"""

{{imports}}

class SdkDemoRepository(object):

  def __init__(self):
    self.host = ''
    self.bucket_name = ''
    self.username = ''
    self.password = ''

    self.cluster = None
    self.bucket = None
    self.connected = False

  {{code}}

    `
  },
  {
    Language: "PYTHON25",
    Name: "connect",
    Dependencies: [
      "from couchbase.cluster import Cluster, PasswordAuthenticator"
    ],
    CommandDependencies: [],
    Code: `
  def connect(self, host, bucket, username, password):
    self.host = host
    self.bucket_name = bucket
    self.username = username
    self.password = password

    connection_str = 'couchbase://{0}'.format(self.host)

    try:
      self.cluster = Cluster(connection_str)
      authenticator = PasswordAuthenticator(self.username, self.password)
      self.cluster.authenticate(authenticator)

      self.bucket = self.cluster.open_bucket(self.bucketName)
    except Exception as error:
      print('Could not open bucket: {0}.  Error: {1}'.format(self.bucket_name, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "n1ql",
    Dependencies: [
      "from couchbase.bucket import Bucket",
      "from couchbase.n1ql import N1QLQuery"
    ],
    CommandDependencies: ["connect"],
    Code: `
  def n1ql_query(self, query, prepare=False, parameters=None):

    n1ql = N1QLQuery(query)

    if parameters and len(parameters) > 0:
      n1ql = N1QLQuery(query, *parameters)

    if prepare:
      n1ql.adhoc = False

    results = []
    for row in self.bucket.n1ql_query(n1ql):
      results.append(row)

    return results
`
  },
  {
    Language: "PYTHON25",
    Name: "get",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  def get(self, doc_id):

    try:
      result = self.bucket.get(doc_id)
      if result.success:
        return result.value
      return None
    except Exception as error:
      print('Error performing KV get for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "getMulti",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
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
`
  },
  {
    Language: "PYTHON25",
    Name: "getReplica",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  def get_replica(self, doc_id):

    try:
      result = self.bucket.get(doc_id, replica=True)
      if result.success:
        return result.value
      return None
    except Exception as error:
      print('Error performing KV getReplica for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "touch",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  def touch(self, doc_id, expiry):
    try:
      result = self.bucket.touch(doc_id, ttl=expiry)
      if result.success:
        return result.value

      return None
    except Exception as error:
      print('Error performing KV touch for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "getAndTouch",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  def get_and_touch(self, doc_id, expiry):

    try:
      result = self.bucket.get(doc_id, ttl=expiry)
      if result.success:
        return result.value
      return None
    except Exception as error:
      print('Error performing KV getAndTouch for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "upsert",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
  def upsert(self, doc_id, doc_value, options=None):

    try:
      result = self.bucket.upsert(doc_id, doc_value)
      if result:
        return self.get(doc_id)
      return None
    except Exception as error:
      print('Error performing KV upsert for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "insert",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
  def insert(self, doc_id, doc_value, options=None):

    try:
      result = self.bucket.insert(doc_id, doc_value)
      if result:
        return self.get(doc_id)
      return None
    except Exception as error:
      print('Error performing KV insert for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "replace",
    Dependencies: [],
    CommandDependencies: ["connect", "get"],
    Code: `
  def replace(self, doc_id, doc_value, options=None):

    try:
      result = self.bucket.replace(doc_id, doc_value)
      if result:
        return self.get(doc_id)
      return None
    except Exception as error:
      print('Error performing KV replace for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "remove",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  def remove(self, doc_id):

    try:
      self.bucket.remove(doc_id)
      return doc_id
    except Exception as error:
      print('Error performing KV remove for docId: {0}. Error: {1}'.format(doc_id, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "lookupIn",
    Dependencies: ["import couchbase.subdocument as sd"],
    CommandDependencies: ["connect"],
    Code: `
  def lookup_in(self, doc_id, path):

    try:
      result = self.bucket.lookup_in(doc_id, sd.get(path))
      if result:
        return result[0]
      return None
    except Exception as error:
      print('Error performing KV lookupIn for docId: {0} & path: {1}. Error: {2}'.format(doc_id, path, error))
      raise
`
  },
  {
    Language: "PYTHON25",
    Name: "mutateIn",
    Dependencies: ["import couchbase.subdocument as sd"],
    CommandDependencies: ["connect", "lookupIn"],
    Code: `
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
`
  },
  {
    Language: "PYTHON25",
    Name: "fts",
    Dependencies: ["import couchbase.fulltext as fts"],
    CommandDependencies: ["connect"],
    Code: `
  def fts(self, term, index_name, fuzziness):
    if not index_name:
      index_name = 'default'

    try:
      query = fts.TermQuery(term, fuzziness=fuzziness) if fuzziness else fts.TermQuery(term)
      results = self.bucket.search(index_name, query, limit=10, highlight_style='html')
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
