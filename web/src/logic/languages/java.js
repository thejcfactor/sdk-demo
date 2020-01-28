import { _ } from "vue-underscore";

const commands = [
  {
    Language: "JAVA30",
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
    Language: "JAVA27",
    Name: "preamble",
    Dependencies: [],
    CommandDependencies: [],
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
*    <version>2.7.11</version>
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

  private CouchbaseCluster cluster;
  private Bucket bucket;

  private SdkDemoRepository() { }

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
    Language: "JAVA27",
    Name: "connect",
    Dependencies: [
      "import com.couchbase.client.java.CouchbaseCluster;",
      "import com.couchbase.client.java.Bucket;"
    ],
    CommandDependencies: [],
    Code: `
  public Boolean Connect(String host, String bucketName, String user, String password) 
      throws Exception {

      this.host = host;
      this.bucketName = bucketName;
      this.username = user;
      this.password = password;

      this.cluster = CouchbaseCluster.create(this.host);
      cluster.authenticate(this.username, this.password);

      this.bucket = cluster.openBucket(this.bucketName);
  }
`
  },
  {
    Language: "JAVA27",
    Name: "n1ql",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonArray;",
      "import com.couchbase.client.java.query.N1qlQuery;",
      "import com.couchbase.client.java.query.N1qlParams;",
      "import com.couchbase.client.java.query.N1qlQueryResult;",
      "import com.couchbase.client.java.query.N1qlQueryRow;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public List<Map<String, Object>> n1qlQuery(String query, Boolean prepare, JsonArray parameters) {

    N1qlParams params = N1qlParams.build().adhoc(prepare);
    N1qlQueryResult result = null;

    if(!parameters.isEmpty()){
        result = this.bucket.query(N1qlQuery.parameterized(query, parameters, params));
    }
    else{
        result = this.bucket.query(N1qlQuery.simple(query, params));
    }

    if (!result.finalSuccess()) {
        throw new DataRetrievalFailureException("Query error: " + result.errors());
    }

    List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
    for (N1qlQueryRow row : result) {
        data.add(row.value().toMap());
    }

    return data;
  }
`
  },
  {
    Language: "JAVA27",
    Name: "get",
    Dependencies: [
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> get(String docId){
    JsonDocument doc = bucket.get(docId);

    return new HashMap<String, Object>(){{
        put(doc.id(), doc.content().toMap());
    }};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "getMulti",
    Dependencies: [
      "import com.couchbase.client.java.document.JsonDocument;",
      "import rx.Observable;",
      "import rx.functions.Func1;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public List<Map<String, Object>> getMulti(List<String> docIds){

    List<JsonDocument> documents = Observable
      .from(docIds)
      .flatMap(new Func1<String, Observable<JsonDocument>>(){
          @Override
          public Observable<JsonDocument> call(String id){
              return bucket.async().get(id);
          }
      })
      .toList()
      .toBlocking()
      .single();

    List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
    for (JsonDocument doc : documents) {
        results.add(new HashMap<String, Object>(){{
            put(doc.id(), doc.content().toMap());
        }});
    }

    return results;
  }
`
  },
  {
    Language: "JAVA27",
    Name: "getReplica",
    Dependencies: [
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> getReplica(String docId){

    Iterator<JsonDocument> docs = bucket.getFromReplica(docId);
    
    if(docs.hasNext()){
        JsonDocument doc = docs.next();

        return new HashMap<String, Object>(){{
            put(doc.id(), doc.content().toMap());
        }};
    }

    return new HashMap<String, Object>(){{}};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "touch",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  public Boolean touch(String docId, Integer expiry){
      
    Boolean success = this.bucket.touch(docId, expiry);
    
    return success;
  }
`
  },
  {
    Language: "JAVA27",
    Name: "getAndTouch",
    Dependencies: [
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> getAndTouch(String docId, Integer expiry){
      
    JsonDocument doc = bucket.getAndTouch(docId, expiry);
    
    return new HashMap<String, Object>(){{
        put(doc.id(), doc.content().toMap());
    }};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "upsert",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonObject;",
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> upsert(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);
    JsonDocument newDoc = JsonDocument.create(docId, content);

    JsonDocument savedDoc = bucket.upsert(newDoc);

    return new HashMap<String, Object>(){{
        put(savedDoc.id(), savedDoc.content().toMap());
    }};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "insert",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonObject;",
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> insert(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);
    JsonDocument newDoc = JsonDocument.create(docId, content);

    JsonDocument savedDoc = bucket.insert(newDoc);

    return new HashMap<String, Object>(){{
        put(savedDoc.id(), savedDoc.content().toMap());
    }};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "replace",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonObject;",
      "import com.couchbase.client.java.document.JsonDocument;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> replace(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);
    JsonDocument newDoc = JsonDocument.create(docId, content);

    JsonDocument savedDoc = bucket.replace(newDoc);

    return new HashMap<String, Object>(){{
        put(savedDoc.id(), savedDoc.content().toMap());
    }};
  }
`
  },
  {
    Language: "JAVA27",
    Name: "remove",
    Dependencies: ["import com.couchbase.client.java.document.JsonDocument;"],
    CommandDependencies: ["connect"],
    Code: `
  public String remove(String docId){

    JsonDocument removedDoc = bucket.remove(docId);

    return removedDoc.id();
  }
`
  },
  {
    Language: "JAVA27",
    Name: "lookupIn",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonObject;",
      "import com.couchbase.client.java.document.json.JsonArray;",
      "import com.couchbase.client.core.message.kv.subdoc.multi.Lookup;",
      "import com.couchbase.client.java.subdoc.DocumentFragment;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> lookupIn(String docId, String path, String resultType){
    DocumentFragment<Lookup> result = bucket.lookupIn(docId).get(path).execute();
    
    if(resultType.equalsIgnoreCase("primitive")){
        Object obj = result.content(0);
        return new HashMap<String, Object>(){{
            put(path, obj);
        }};
    }
    else if(resultType.equalsIgnoreCase("object")){
        JsonObject obj = result.content(0, JsonObject.class);
        return new HashMap<String, Object>(){{
            put(path, obj.toMap());
        }};
    }else{
        //TODO: array
        JsonArray array = result.content(0, JsonArray.class);

        return new HashMap<String, Object>(){{
            put(path, array);
        }};
    }
  }
`
  },
  {
    Language: "JAVA27",
    Name: "mutateIn",
    Dependencies: [
      "import com.couchbase.client.java.document.json.JsonObject;",
      "import com.couchbase.client.java.document.json.JsonArray;",
      "import com.couchbase.client.core.message.kv.subdoc.multi.Mutation;",
      "import com.couchbase.client.java.subdoc.DocumentFragment;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "lookupIn"],
    Code: `
  public Map<String, Object> mutateIn(String docId, String path, String value, String resultType){
    DocumentFragment<Mutation> result = bucket.mutateIn(docId).upsert(path, value).execute();

    if(result.exists(path)){
      return lookupIn(docId, path, resultType);
    }

    return new HashMap<String, Object>(){};

  }
`
  },
  {
    Language: "JAVA27",
    Name: "fts",
    Dependencies: [
      "import com.couchbase.client.java.search.*;",
      "import com.couchbase.client.java.search.queries.*;",
      "import com.couchbase.client.java.search.result.SearchQueryResult;",
      "import com.couchbase.client.java.search.result.SearchQueryRow;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public  List<Map<String, Object>> fts(String searchTerm, String indexName, Integer fuzzyLevel){
    if(indexName.isEmpty()){
        indexName = "default";
    }

    MatchQuery query = SearchQuery.match(searchTerm).fuzziness(fuzzyLevel);

    SearchQueryResult result = bucket.query(new SearchQuery(indexName, query)
        .limit(10)
        .highlight());

    List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
    for (SearchQueryRow row : result.hits()) {
        
        data.add(new HashMap<String, Object>(){{
            put("id", row.id());
            put("hits", row.fragments());
        }});
    }

    return data;
  }
`
  },
  {
    Language: "JAVA30",
    Name: "preamble",
    Dependencies: [],
    CommandDependencies: [],
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
*    <version>3.0.0</version>
*  </dependency>
*  <!-- if wanting ACID -->
*  <dependency>
*    <groupId>com.couchbase.client</groupId>
*    <artifactId>couchbase-transactions</artifactId>
*    <version>1.0.0</version>
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


  private SdkDemoRepository() {}

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
    Language: "JAVA30",
    Name: "connect",
    Dependencies: [
      "import com.couchbase.client.java.Bucket;",
      "import com.couchbase.client.java.Cluster;",
      "import com.couchbase.client.java.Collection;",
      "import com.couchbase.client.java.ReactiveCollection;"
    ],
    CommandDependencies: [],
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
  }
`
  },
  {
    Language: "JAVA30",
    Name: "n1ql",
    Dependencies: [
      "import com.couchbase.client.java.query.QueryOptions;",
      "import com.couchbase.client.java.query.QueryResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public List<Map<String, Object>> n1qlQuery(String query, Boolean prepared, JsonArray parameters) {

    QueryOptions opts = QueryOptions.queryOptions().adhoc(prepared);

    if(!parameters.isEmpty()){
        opts.parameters(parameters);
    }

    QueryResult result = this.cluster.query(query, opts);

    List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
    for (JsonObject row : result.rowsAsObject()) {
        data.add(row.toMap());
    }

    return data;
  }
`
  },
  {
    Language: "JAVA30",
    Name: "get",
    Dependencies: [
      "import com.couchbase.client.java.kv.GetResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> get(String docId){
    GetResult result = collection.get(docId);

    JsonObject doc = result.contentAsObject();

    return new HashMap<String, Object>(){{
        put(docId, doc.toMap());
    }};
  }
`
  },
  {
    Language: "JAVA30",
    Name: "getMulti",
    Dependencies: [
      "import com.couchbase.client.java.kv.GetResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import reactor.core.publisher.Flux;",
      "import reactor.core.publisher.Mono;",
      "import java.util.*;",
      "import java.util.concurrent.ConcurrentHashMap;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public List<Map<String, Object>> getMulti(List<String> docIds) {

    Map<String, Throwable> errors = new ConcurrentHashMap<>();
    List<GetResult> results = Collections.synchronizedList(new ArrayList<>());
    
    Flux.fromIterable(docIds)
    .flatMap(key -> reactiveCollection.get(key).onErrorResume(e -> {
        errors.put(key, e);
        return Mono.empty();
    }))
    .doOnNext(results::add)
    .last()
    .block();

    List<Map<String, Object>> docs = new ArrayList<Map<String, Object>>();

    for(GetResult r : results){
        JsonObject obj = r.contentAsObject();
        docs.add(obj.toMap());
    }

    return docs;
  }
`
  },
  {
    Language: "JAVA30",
    Name: "getReplica",
    Dependencies: [
      "import com.couchbase.client.java.kv.GetResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> getReplica(String docId){
    GetResult result = collection.getAnyReplica(docId);

    JsonObject doc = result.contentAsObject();

    return new HashMap<String, Object>(){{
        put(docId, doc.toMap());
    }};
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "touch",
    Dependencies: [
      "import com.couchbase.client.java.kv.MutationResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Boolean touch(String docId, Integer expiry){
    MutationResult result = collection.touch(docId, Duration.ofSeconds(expiry));

    return result.cas() > 0 ? true : false;
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "getAndTouch",
    Dependencies: [
      "import com.couchbase.client.java.kv.GetResult;",
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> getAndTouch(String docId, Integer expiry){
      
    GetResult result = collection.getAndTouch(docId, Duration.ofSeconds(expiry));

    JsonObject doc = result.contentAsObject();
    
    return new HashMap<String, Object>(){{
        put(docId, doc.toMap());
    }};
  } 
    `
  },
  {
    Language: "JAVA30",
    Name: "upsert",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "get"],
    Code: `
  public Map<String, Object> upsert(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);

    collection.upsert(docId, content);

    return get(docId);
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "insert",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "get"],
    Code: `
  public Map<String, Object> insert(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);

    collection.insert(docId, content);

    return get(docId);
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "replace",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "get"],
    Code: `
  public Map<String, Object> replace(String docId, String doc){
    JsonObject content = JsonObject.fromJson(doc);

    collection.replace(docId, content);

    return get(docId);
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "remove",
    Dependencies: [],
    CommandDependencies: ["connect"],
    Code: `
  public String remove(String docId){
      
    collection.remove(docId);

    return docId;
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "lookupIn",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import com.couchbase.client.java.kv.LookupInResult;",
      "import com.couchbase.client.java.kv.LookupInSpec;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public Map<String, Object> lookupIn(String docId, String path, String resultType){
    LookupInResult result = collection.lookupIn(docId, Collections.singletonList(LookupInSpec.get(path)));
    
    if(resultType.equalsIgnoreCase("primitive")){
        String obj = result.contentAs(0, String.class);
        return new HashMap<String, Object>(){{
            put(path, obj);
        }};
    }
    else if(resultType.equalsIgnoreCase("object")){
        JsonObject obj = result.contentAsObject(0);
        return new HashMap<String, Object>(){{
            put(path, obj.toMap());
        }};
    }else{
        //TODO: array
        JsonArray array = result.contentAsArray(0);
        return new HashMap<String, Object>(){{
            put(path, array);
        }};
    }
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "mutateIn",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import com.couchbase.client.java.kv.MutationResult;",
      "import com.couchbase.client.java.kv.MutateInSpec;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "lookupIn"],
    Code: `
  public Map<String, Object> mutateIn(String docId, String path, String value, String resultType){
    Boolean valueIsInt = false;
    try{
        Integer.parseInt(value);
        valueIsInt = true;
    }
    catch(NumberFormatException e){
        valueIsInt = false;
    }

    if(valueIsInt){
        Integer intValue = Integer.parseInt(value);
        collection.mutateIn(docId, Collections.singletonList(MutateInSpec.upsert(path, intValue)));
    }
    else{
        collection.mutateIn(docId, Collections.singletonList(MutateInSpec.upsert(path, value)));
    }

    return lookupIn(docId, path, resultType);
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "fts",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import com.couchbase.client.java.search.SearchQuery;",
      "import com.couchbase.client.java.search.SearchOptions;",
      "import com.couchbase.client.java.search.result.SearchResult;",
      "import com.couchbase.client.java.search.result.SearchRow;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect"],
    Code: `
  public List<Map<String, List<String>>> fts(String searchTerm, String indexName, Integer fuzzyLevel) {
    if (indexName.isEmpty()) {
        indexName = "default";
    }

    SearchResult result = this.cluster.searchQuery(indexName, SearchQuery.queryString(searchTerm),
            SearchOptions.searchOptions().limit(10).highlight());

    List<Map<String, List<String>>> data = new ArrayList<Map<String, List<String>>>();
    for (SearchRow row : result.rows()) {
        data.add(row.fragments());
    }

    return data;
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "acid",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import com.couchbase.transactions.Transactions;",
      "import com.couchbase.transactions.TransactionDurabilityLevel;",
      "import com.couchbase.transactions.config.TransactionConfigBuilder;",
      "import com.couchbase.transactions.error.TransactionFailed;",
      "import com.couchbase.transactions.log.LogDefer;",
      "import com.couchbase.transactions.TransactionGetResult;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "getMulti"],
    Code: `
  public List<Map<String, Object>> executeTransaction(String doc1Id, String doc1, String doc2Id, String doc2, Boolean rollback){
    // Durability: NONE/MAJORITY/PERSIST_TO_MAJORITY/MAJORITY_AND_PERSIST_ON_MASTER
    // TIMEOUT: Max TTL of the transaction
    // OBS: As I'm running in a single node the Durability is set to None
    Transactions transactions = Transactions.create(cluster, TransactionConfigBuilder.create()
            .durabilityLevel(TransactionDurabilityLevel.NONE)
            .build());

    try{
        transactions.run((ctx) ->{
            
            TransactionGetResult doc1ToModifyTx = ctx.get(collection, doc1Id);
            JsonObject doc1ToModifyTxContent = JsonObject.fromJson(doc1);
            ctx.replace(doc1ToModifyTx, doc1ToModifyTxContent);

            TransactionGetResult doc2ToModifyTx = ctx.get(collection, doc2Id);
            JsonObject doc2ToModifyTxContent = JsonObject.fromJson(doc2);
            ctx.replace(doc2ToModifyTx, doc2ToModifyTxContent);

            /*
                Artifical reason for a rollback, but used to demonstrate the rollback can occur.

                Another easy way to demonstrate a type of rollback (i.e. error occurs during txn):
                    attempt to get a document w/ a key that doesn't exist
            */
            if(rollback){
                ctx.rollback();
            }

            ctx.commit();
        });
    } catch (TransactionFailed e) {
        e.printStackTrace();
        for (LogDefer err : e.result().log().logs()) {
            System.err.println(err.toString());
        }
    }

    List<String> ids = Arrays.asList(doc1Id, doc2Id);
    return getMulti(ids);
  }
    `
  },
  {
    Language: "JAVA30",
    Name: "acid-beer-sample",
    Dependencies: [
      "import com.couchbase.client.java.json.JsonObject;",
      "import com.couchbase.client.java.json.JsonArray;",
      "import com.couchbase.transactions.Transactions;",
      "import com.couchbase.transactions.TransactionDurabilityLevel;",
      "import com.couchbase.transactions.config.TransactionConfigBuilder;",
      "import com.couchbase.transactions.error.TransactionFailed;",
      "import com.couchbase.transactions.log.LogDefer;",
      "import com.couchbase.transactions.TransactionGetResult;",
      "import java.util.*;"
    ],
    CommandDependencies: ["connect", "getMulti"],
    Code: `
  public List<Map<String, Object>> executeBeerSampleTransaction(String newBeerId, String newBeer, String breweryId, Boolean rollback){
    //  Durability: 
    //      NONE:  disable durability settings
    //      MAJORITY:  Wait until each write is available in-memory on a majority of configured replicas, before continuing
    //      PERSIST_TO_MAJORITY:  Wait until each write is both available in-memory and persisted to disk on a majority of 
    //          configured replicas, before continuing
    //      MAJORITY_AND_PERSIST_ON_MASTER:  Wait until each write is available in-memory on a majority of configured replicas, and also 
    //          persisted to disk on master node, before continuing
    // 
    //  TIMEOUT: Max TTL of the transaction
    Transactions transactions = Transactions.create(cluster, TransactionConfigBuilder.create()
            .durabilityLevel(TransactionDurabilityLevel.NONE)
            .build());

    try{
        transactions.run((ctx) ->{
            
            JsonObject newBeerContent = JsonObject.fromJson(newBeer);
            ctx.insert(collection, newBeerId, newBeerContent);

            TransactionGetResult breweryTx = ctx.get(collection, breweryId);
            JsonObject breweryContent = breweryTx.contentAsObject();
            breweryContent.put("beer_count", breweryContent.getInt("beer_count") == null ? 1 : breweryContent.getInt("beer_count") + 1);
            ctx.replace(breweryTx, breweryContent);

            /*
                Artifical reason for a rollback, but used to demonstrate the rollback can occur.

                Another easy way to demonstrate a type of rollback (i.e. error occurs during txn):
                    attempt to get a document w/ a key that doesn't exist
            */
            if(breweryContent.getInt("beer_count") > 12){
                ctx.rollback();
            }

            ctx.commit();
        });
    } catch (TransactionFailed e) {
        e.printStackTrace();
        for (LogDefer err : e.result().log().logs()) {
            System.err.println(err.toString());
        }
    }

    List<String> ids = Arrays.asList(newBeerId, breweryId);
    return getMulti(ids);
  }
    `
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
    Command: "getReplica",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-retrieving-full-docs"
  },
  {
    Language: "JAVA27",
    Command: "touch",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-modifying-expiration"
  },
  {
    Language: "JAVA27",
    Command: "getAndTouch",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/document-operations.html#java-modifying-expiration"
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
    Language: "JAVA27",
    Command: "mutateIn",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/subdocument-operations.html#mutating"
  },
  {
    Language: "JAVA27",
    Command: "fts",
    Url:
      "https://docs.couchbase.com/java-sdk/2.7/full-text-searching-with-sdk.html"
  },
  {
    Language: "JAVA30",
    Command: null,
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/hello-world/start-using-sdk.html"
  },
  {
    Language: "JAVA30",
    Command: "connect",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/hello-world/start-using-sdk.html"
  },
  {
    Language: "JAVA30",
    Command: "n1ql",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/n1ql-queries-with-sdk.html"
  },
  {
    Language: "JAVA30",
    Command: "get",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#retrieving-documents"
  },
  {
    Language: "JAVA30",
    Command: "getMulti",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/concurrent-async-apis.html#batching"
  },
  {
    Language: "JAVA30",
    Command: "getReplica",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#retrieving-documents"
  },
  {
    Language: "JAVA30",
    Command: "touch",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#document-expiration"
  },
  {
    Language: "JAVA30",
    Command: "getAndTouch",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#document-expiration"
  },
  {
    Language: "JAVA30",
    Command: "upsert",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#upsert"
  },
  {
    Language: "JAVA30",
    Command: "insert",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#insert"
  },
  {
    Language: "JAVA30",
    Command: "replace",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#replace"
  },
  {
    Language: "JAVA30",
    Command: "remove",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/kv-operations.html#removing"
  },
  {
    Language: "JAVA30",
    Command: "lookupIn",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/subdocument-operations.html#retrieving"
  },
  {
    Language: "JAVA30",
    Command: "mutateIn",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/howtos/subdocument-operations.html#mutating"
  },
  {
    Language: "JAVA30",
    Command: "fts",
    Url:
      "https://docs.couchbase.com/java-sdk/3.0/project-docs/migrating-sdk-code-to-3.n.html#migrating-services"
  },
  {
    Language: "JAVA30",
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
