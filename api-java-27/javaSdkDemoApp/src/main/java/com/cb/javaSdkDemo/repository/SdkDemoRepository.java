package com.cb.javaSdkDemo.repository;

import com.couchbase.client.java.CouchbaseCluster;
import com.couchbase.client.java.document.JsonDocument;
import com.couchbase.client.java.document.json.JsonObject;
import com.couchbase.client.java.document.json.JsonArray;
import com.couchbase.client.core.message.kv.subdoc.multi.Lookup;
import com.couchbase.client.core.message.kv.subdoc.multi.Mutation;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.query.N1qlQuery;
import com.couchbase.client.java.query.N1qlParams;
import com.couchbase.client.java.query.N1qlQueryResult;
import com.couchbase.client.java.query.N1qlQueryRow;
import com.couchbase.client.java.subdoc.DocumentFragment;
/*FTS*/
import com.couchbase.client.java.search.*;
import com.couchbase.client.java.search.queries.*;
import com.couchbase.client.java.search.result.SearchQueryResult;
import com.couchbase.client.java.search.result.SearchQueryRow;

import rx.Observable;
import rx.functions.Func1;

import java.util.*;

import org.springframework.dao.DataRetrievalFailureException;

public final class SdkDemoRepository {

    private static SdkDemoRepository INSTANCE;
    // NOTE: if env variables created after VS Code was opened, restart VS code
    private String host;
    private String bucketName;
    private String username;
    private String password;

    private CouchbaseCluster cluster;
    private Bucket bucket;
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

    public Boolean Connect(String host, String bucketName, String user, String password) 
        throws Exception {

        this.host = host;
        this.bucketName = bucketName;
        this.username = user;
        this.password = password;

        if (this.connected) {
            this.Disconnect();
        }

        this.cluster = CouchbaseCluster.create(this.host);
        cluster.authenticate(this.username, this.password);

        this.bucket = cluster.openBucket(this.bucketName);

        this.connected = true;

        return this.connected;
    }

    public Boolean Disconnect() throws Exception {
        this.connected = this.cluster.disconnect();
        if(!this.connected){
            throw new Exception("Unable to disconnect from previous connection.");
        }
        return this.connected;
    }

    public List<String> GetSampleDocIds(){
        String localBucket = this.bucketName;
        if(this.bucketName.contains("-")){
            localBucket = "`" + this.bucketName + "`";
        }

        String query = String.format("SELECT meta().id FROM %s LIMIT 5;", localBucket);

        N1qlQueryResult result = this.bucket.query(N1qlQuery.simple(query));

        if (!result.finalSuccess()) {
            throw new DataRetrievalFailureException("Query error: " + result.errors());
        }

        List<String> ids = new ArrayList<String>();
        for (N1qlQueryRow row : result) {
            ids.add(row.value().getString("id"));
        }

        return ids;
    }

    public String bucketName() {
        return this.bucket.name();
    }

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

    public Map<String, Object> get(String docId){
        JsonDocument doc = bucket.get(docId);

        return new HashMap<String, Object>(){{
            put(doc.id(), doc.content().toMap());
        }};
    }

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

    public Boolean touch(String docId, Integer expiry){
        
        Boolean success = this.bucket.touch(docId, expiry);
        
        return success;
    }

    public Map<String, Object> getAndTouch(String docId, Integer expiry){
        
        JsonDocument doc = bucket.getAndTouch(docId, expiry);
        
        return new HashMap<String, Object>(){{
            put(doc.id(), doc.content().toMap());
        }};
    }

    public Map<String, Object> upsert(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);
        JsonDocument newDoc = JsonDocument.create(docId, content);

        JsonDocument savedDoc = bucket.upsert(newDoc);

        return new HashMap<String, Object>(){{
            put(savedDoc.id(), savedDoc.content().toMap());
        }};
    }

    public Map<String, Object> insert(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);
        JsonDocument newDoc = JsonDocument.create(docId, content);

        JsonDocument savedDoc = bucket.insert(newDoc);

        return new HashMap<String, Object>(){{
            put(savedDoc.id(), savedDoc.content().toMap());
        }};
    }

    public Map<String, Object> replace(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);
        JsonDocument newDoc = JsonDocument.create(docId, content);

        JsonDocument savedDoc = bucket.replace(newDoc);

        return new HashMap<String, Object>(){{
            put(savedDoc.id(), savedDoc.content().toMap());
        }};
    }

    public String remove(String docId){

        JsonDocument removedDoc = bucket.remove(docId);

        return removedDoc.id();
    }

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

    public Map<String, Object> mutateIn(String docId, String path, String value, String resultType) {
        DocumentFragment<Mutation> result = bucket.mutateIn(docId).upsert(path, value).execute();

        if (result.exists(path)) {
            return lookupIn(docId, path, resultType);
        }

        return new HashMap<String, Object>() {
        };
    }

    public List<Map<String, Object>> fts(String searchTerm, String indexName, Integer fuzzyLevel) {
        if (indexName.isEmpty()) {
            indexName = "default";
        }

        MatchQuery query = SearchQuery.match(searchTerm).fuzziness(fuzzyLevel);

        SearchQueryResult result = bucket.query(new SearchQuery(indexName, query).limit(10).highlight());

        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        for (SearchQueryRow row : result.hits()) {

            data.add(new HashMap<String, Object>() {
                {
                    put("id", row.id());
                    put("hits", row.fragments());
                }
            });
        }

        return data;
    }
}