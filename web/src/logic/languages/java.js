import { _ } from "vue-underscore";

const commands = [
  {
    Language: "JAVA30b",
    Name: "acid",
    Label: "ACID",
    ApiUrl: "acid",
    Selected: false,
    Parent: null,
    InputOptions: [
      {
        Name: "doc1Id",
        Label: "Enter doc1Id below:",
        InputType: "INPUT",
        Hint: "",
        Value: ""
      },
      {
        Name: "doc1Content",
        Label: "Enter doc1 content below:",
        InputType: "TEXT_AREA",
        Hint: "",
        Value: ""
      },
      {
        Name: "doc2Id",
        Label: "Enter doc2Id below:",
        InputType: "INPUT",
        Hint: "",
        Value: ""
      },
      {
        Name: "doc2Content",
        Label: "Enter doc2 content below:",
        InputType: "TEXT_AREA",
        Hint: "",
        Value: ""
      }
    ],
    Info: `Enter the document key and document content into the provided text areas for two documents to be updated/replaced 
     (make sure the entered content is different from the document's current content, otherwise it will be difficult to see the results).
     Make sure both document's content is valid JSON.  
     Order of operations: the first document is updated/replaced and then the second document is updated/replaced.
     If the "force rollback" checkbox is selected, the transaction will be forced to fail and thus roll back any changes to the documents.
     Click the "Execute Txn" button to attempt the transaction.`
  }
];

const codeSnippets = [
  {
    Language: "JAVA30b",
    Name: "preamble",
    Code: `
    /*************************************************
    * pom.xml will need the following:
    * 
    * <repositories>
    *   ...
    *   <repository>
    *     <id>couchbase</id>
    *     <name>Couchbase Preview Repository</name>
    *     <url>http://files.couchbase.com/maven2</url>
    *   </repository>
    *   ...
    * </repositories>
    * 
    * <dependencies>
    *   ...
    *  <dependency>
    *    <groupId>com.couchbase.client</groupId>
    *    <artifactId>java-client</artifactId>
    *    <version>3.0.0-beta.1</version>
    *  </dependency>
    *  <!-- if wanting ACID -->
    *  <dependency>
    *    <groupId>com.couchbase.client</groupId>
    *    <artifactId>couchbase-transactions</artifactId>
    *    <version>1.0.0-beta.3</version>
    *  </dependency>
    *   ...
    * </dependencies>
    * **************************************************/

    {{imports}}

    public final class SdkDemoRepository {

      private static SdkDemoRepository INSTANCE;
      private String host;
      private String bucketName;
      private String username;
      private String password;

      private Cluster cluster;
      private Bucket bucket;
      private Collection collection;
      private ReactiveCollection reactiveCollection;
      private Boolean connected;


      private SdkDemoRepository() {  
          this.connected = false;
      }

      public static SdkDemoRepository getInstance() {
          if (INSTANCE == null) {
              INSTANCE = new SdkDemoRepository();
          }

          return INSTANCE;
      }

      {{code}}

    }
    `
  },
  {
    Language: "JAVA30b",
    Name: "connect",
    Dependencies: [
      "import com.couchbase.client.java.Bucket;",
      "import com.couchbase.client.java.Cluster;",
      "import com.couchbase.client.java.Collection;",
      "import com.couchbase.client.java.ReactiveCollection;"
    ],
    Code: `
        public Boolean Connect(String host, String bucketName, String user, String password) throws Exception {

            this.host = host;
            this.bucketName = bucketName;
            this.username = user;
            this.password = password;
    
            this.cluster = Cluster.connect(this.host, this.username, this.password);
    
            this.bucket = cluster.bucket(this.bucketName);
            this.collection = bucket.defaultCollection();
            this.reactiveCollection = collection.reactive();
    
            this.connected = true;
    
            return this.connected;
        }`
  }
];

const documentationUrls = [
  {
    Language: "JAVA27",
    Command: null,
    Url: "https://docs.couchbase.com/java-sdk/2.7/start-using-sdk.html"
  },
  {
    Language: "JAVA27",
    Command: "connect",
    Url: "https://docs.couchbase.com/java-sdk/2.7/managing-connections.html"
  },
  {
    Language: "JAVA27",
    Command: "n1ql",
    Url: "https://docs.couchbase.com/java-sdk/2.7/n1ql-query.html"
  },
  {
    Language: "JAVA27",
    Command: "get",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-retrieving-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "getMulti",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-batching-ops"
  },
  {
    Language: "JAVA27",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-creating-updating-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-creating-updating-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-creating-updating-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-removing-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/subdocument-operations.html#retrieving"
  },
  {
    Language: "JAVA30b",
    Command: null,
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/hello-world/start-using-sdk.html"
  },
  {
    Language: "JAVA30b",
    Command: "connect",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/hello-world/start-using-sdk.html"
  },
  {
    Language: "JAVA30b",
    Command: "n1ql",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/n1ql-queries-with-sdk.html"
  },
  {
    Language: "JAVA30b",
    Command: "get",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#retrieving-documents"
  },
  {
    Language: "JAVA30b",
    Command: "getMulti",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/concurrent-async-apis.html#batching"
  },
  {
    Language: "JAVA30b",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#upsert"
  },
  {
    Language: "JAVA30b",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#insert"
  },
  {
    Language: "JAVA30b",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#replace"
  },
  {
    Language: "JAVA30b",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#removing"
  },
  {
    Language: "JAVA30b",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/subdocument-operations.html#retrieving"
  },
  {
    Language: "JAVA30b",
    Command: "acid",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/concurrent-async-apis.html"
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
    //TODO: preamble (i.e. pom.xml requirements, pip requirements, etc.)
    console.log(language);
    console.log(commands);
    let preamble = _.findWhere(codeSnippets, {
      Language: language,
      Name: "preamble"
    });
    for (let i = 0; i < commands.length; i++) {
      let match = _.findWhere(codeSnippets, {
        Language: language,
        Name: commands[i]
      });
      if (match) {
        dependencies = dependencies.concat(match.Dependencies);
        snippets.push(match.Code);
      }
    }

    let importSnippet = _.uniq(dependencies).join("\n\t\t");
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
