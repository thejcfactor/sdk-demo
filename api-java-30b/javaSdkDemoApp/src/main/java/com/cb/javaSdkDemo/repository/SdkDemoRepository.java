package com.cb.javaSdkDemo.repository;

import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.Collection;
import com.couchbase.client.java.ReactiveCollection;
import com.couchbase.client.java.json.JsonObject;
import com.couchbase.client.java.json.JsonArray;
import com.couchbase.client.java.query.QueryResult;
import com.couchbase.client.java.kv.GetResult;
//import com.couchbase.client.java.kv.LookupInSpec;
//import com.couchbase.client.java.kv.MutationResult;
import com.couchbase.client.java.kv.MutationResult;
import com.couchbase.transactions.Transactions;
import com.couchbase.transactions.TransactionDurabilityLevel;
import com.couchbase.transactions.config.TransactionConfigBuilder;
import com.couchbase.transactions.error.TransactionFailed;
import com.couchbase.transactions.log.LogDefer;
import com.couchbase.transactions.TransactionGetResult;

import com.couchbase.client.java.kv.LookupInResult;
import com.couchbase.client.java.kv.LookupInSpec;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
/*
import rx.Observable;
import rx.functions.Func1;
*/

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.Arrays;

//import org.springframework.dao.DataRetrievalFailureException;


public final class SdkDemoRepository {

    private static SdkDemoRepository INSTANCE;
    // NOTE: if env variables created after VS Code was opened, restart VS code
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

    public Boolean Connect(String host, String bucketName, String user, String password) throws Exception {

        this.host = host;
        this.bucketName = bucketName;
        this.username = user;
        this.password = password;

        if(this.connected){
            this.Disconnect();
        }

        this.cluster = Cluster.connect(this.host, this.username, this.password);

        this.bucket = cluster.bucket(this.bucketName);
        this.collection = bucket.defaultCollection();
        this.reactiveCollection = collection.reactive();

        this.connected = true;

        return this.connected;
    }

    public Boolean Disconnect() throws Exception {

        try
        {
            this.cluster.disconnect();
            this.connected = false;
        }
        catch (Exception ex)
        {
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

        QueryResult result = this.cluster.query(query);

        List<String> ids = new ArrayList<String>();
        for (JsonObject row : result.rowsAsObject()) {
            ids.add(row.getString("id"));
        }

        return ids;
    }

    public String bucketName() {
        return this.bucket.name();
    }

    public List<Map<String, Object>> n1qlQuery(String query) {

        QueryResult result = this.cluster.query(query);

        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        for (JsonObject row : result.rowsAsObject()) {
            data.add(row.toMap());
        }

        return data;
    }

    public Map<String, Object> get(String docId){
        GetResult result = collection.get(docId);

        JsonObject doc = result.contentAsObject();

        return new HashMap<String, Object>(){{
            put(docId, doc.toMap());
        }};
    }

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

    public Mono<Map<String, GetResult>> Test(String docId){
        GetResult result = collection.get(docId);
        return Mono.just(new HashMap<String, GetResult>(){{
            put(docId, result);
        }});
    }

    public Map<String, Object> upsert(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);

        collection.upsert(docId, content);

        return get(docId);
    }

    public Map<String, Object> insert(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);

        collection.insert(docId, content);

        return get(docId);
    }

    public Map<String, Object> replace(String docId, String doc){
        JsonObject content = JsonObject.fromJson(doc);

        collection.replace(docId, content);

        return get(docId);
    }

    public String remove(String docId){
        
        collection.remove(docId);

        return docId;
    }

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

                if(rollback){
                    throw new IllegalStateException("Throwing fake rollback.");
                }

                TransactionGetResult doc2ToModifyTx = ctx.get(collection, doc2Id);
                JsonObject doc2ToModifyTxContent = JsonObject.fromJson(doc2);
                ctx.replace(doc2ToModifyTx, doc2ToModifyTxContent);

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

    public List<Map<String, Object>> executeBeerSampleTransaction(String newBeerId, String newBeer, String breweryId, Boolean rollback){
        // Durability: NONE/MAJORITY/PERSIST_TO_MAJORITY/MAJORITY_AND_PERSIST_ON_MASTER
        // TIMEOUT: Max TTL of the transaction
        // OBS: As I'm running in a single node the Durability is set to None
        Transactions transactions = Transactions.create(cluster, TransactionConfigBuilder.create()
                .durabilityLevel(TransactionDurabilityLevel.NONE)
                .build());

        try{
            transactions.run((ctx) ->{
                
                JsonObject newBeerContent = JsonObject.fromJson(newBeer);
                ctx.insert(collection, newBeerId, newBeerContent);

                if(rollback){
                    throw new IllegalStateException("Throwing fake rollback.");
                }

                TransactionGetResult breweryTx = ctx.get(collection, breweryId);
                JsonObject breweryContent = breweryTx.contentAsObject();
                breweryContent.put("beer_count", breweryContent.getInt("beer_count") == null ? 1 : breweryContent.getInt("beer_count") + 1);
                ctx.replace(breweryTx, breweryContent);

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
}