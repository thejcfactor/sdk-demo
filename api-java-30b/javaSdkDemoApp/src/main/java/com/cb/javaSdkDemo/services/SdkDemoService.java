package com.cb.javaSdkDemo.services;

import com.cb.javaSdkDemo.entities.Result;
import com.cb.javaSdkDemo.repository.SdkDemoRepository;
import com.couchbase.client.java.json.JsonArray;

import java.util.List;
import java.util.Map;
import java.util.Arrays;

import org.springframework.stereotype.Service;

@Service
public class SdkDemoService {

    private String host;
    private String bucket;
    private String username;
    private String password;

    private SdkDemoRepository repository;

    public SdkDemoService() {

        // NOTE: if env variables created after VS Code was opened, restart VS code
        this.host = System.getenv("CB_HOST");
        this.bucket = System.getenv("CB_BUCKET");
        this.username = System.getenv("CB_USERNAME");
        this.password = System.getenv("CB_PW");

        repository = SdkDemoRepository.getInstance();
    }

    public List<String> Connect(String host, String bucket, String user, String password) throws Exception {

        // when using Docker for Mac, need to use host.docker.internal instead of localhost
        if (!(isParentHostMac() && (host.equalsIgnoreCase("localhost") || host.equalsIgnoreCase("127.0.0.1")))) {
            System.out.println("Parent system isn't Mac, localhost can be used.");
            this.host = host;
        }

        System.out.println("Using host:  " + this.host);
        this.bucket = bucket;
        this.username = user;
        this.password = password;

        Boolean connected = repository.Connect(this.host, this.bucket, this.username, this.password);
        if(connected){
            List<String> ids = repository.GetSampleDocIds();
            return ids;
        }
        return null;
    }

    public Boolean Disconnect() throws Exception {
        return repository.Disconnect();
    }

    public String bucketName() {
        return repository.bucketName();
    }

    public Result<List<Map<String, Object>>> n1qlQuery(String query, Boolean prepared, String params) {
        /* TODO:  Is there an easier way?? */

        String scrubbedParams = params.replace("[", "").replace("]", "").replace("\"", "");
        List<String> strParams = Arrays.asList(scrubbedParams.split(","));
        JsonArray array = JsonArray.create();
        for (String str : strParams) {
            if(str.equals("")){
                continue;
            }
            else if(tryParseBoolean(str)){
                array.add(Boolean.parseBoolean(str));
            }
            else if(tryParseInt(str)){
                array.add(Integer.parseInt(str));
            }
            else if(tryParseFloat(str)){
                array.add(Float.parseFloat(str));
            }
            else{
                array.add(str);
            }
        }
        List<Map<String, Object>> result = repository.n1qlQuery(query, prepared, array);

        return Result.of(result, query.toString());
    }

    public Boolean tryParseInt(String val){
        try{
            Integer.parseInt(val);
            return true;
        }
        catch (NumberFormatException ex){
            return false;
        }
    }

    public Boolean tryParseFloat(String val){
        try{
            Float.parseFloat(val);
            return true;
        }
        catch (NumberFormatException ex){
            return false;
        }
    }

    public Boolean tryParseBoolean(String val){
        try{
            return Boolean.parseBoolean(val);
        }
        catch (NumberFormatException ex){
            return false;
        }
    }

    public Result<Map<String, Object>> get(String docId){
        Map<String, Object> document = repository.get(docId);

        return Result.of(document, docId);
    }

    public Result<List<Map<String, Object>>> getMulti(String docIds){
        String scrubbedIds = docIds.replace("[", "").replace("]", "").replace("\"", "");
        List<String> ids = Arrays.asList(scrubbedIds.split(","));
        List<Map<String, Object>> documents = repository.getMulti(ids);

        return Result.of(documents, docIds);
    }

    public Result<Map<String, Object>> getReplica(String docId){
        Map<String, Object> document = repository.getReplica(docId);

        return Result.of(document, docId);
    }

    public Result<Boolean> touch(String docId, Integer expiry){
        Boolean success = repository.touch(docId, expiry);

        return Result.of(success, docId);
    }

    public Result<Map<String, Object>> getAndTouch(String docId, Integer expiry){
        Map<String, Object> document = repository.getAndTouch(docId, expiry);

        return Result.of(document, docId);
    }

    public Result<Map<String, Object>> upsert(String docId, String doc){

        Map<String, Object> document = repository.upsert(docId, doc);

        return Result.of(document, docId);
    }    

    public Result<Map<String, Object>> insert(String docId, String doc){

        Map<String, Object> document = repository.insert(docId, doc);

        return Result.of(document, docId);
    }

    public Result<Map<String, Object>> replace(String docId, String doc){

        Map<String, Object> document = repository.replace(docId, doc);

        return Result.of(document, docId);
    }

    public Result<String> remove(String docId){

        String removedDocId = repository.remove(docId);

        return Result.of(removedDocId, docId);
    }  

    public Result<Map<String, Object>> lookupIn(String docId, String path, String resultType){

        Map<String, Object> result = repository.lookupIn(docId, path, resultType);

        return Result.of(result, docId);
    }

    public Result<Map<String, Object>> mutateIn(String docId, String path, Object value, String resultType){

        Map<String, Object> result = repository.mutateIn(docId, path, value, resultType);

        return Result.of(result, docId);
    }

    public Result<List<Map<String, Object>>> fts(String searchTerm, String indexName, Integer fuzzyLevel){

        List<Map<String, Object>> result = repository.fts(searchTerm, indexName, fuzzyLevel);

        return Result.of(result, searchTerm);
    }

    public Result<List<Map<String, Object>>> executeTransaction(String doc1Id, String doc1, String doc2Id, String doc2, Boolean rollback){
        List<Map<String, Object>> documents = repository.executeTransaction(doc1Id, doc1, doc2Id, doc2, rollback);

        String docIds = String.format("[%s, %s]", doc1Id, doc2Id);

        return Result.of(documents, docIds);
    }

    public Result<List<Map<String, Object>>> executeBeerSampleTransaction(String newBeerId, String newBeer, String breweryId, Boolean rollback){
        List<Map<String, Object>> documents = repository.executeBeerSampleTransaction(newBeerId, newBeer, breweryId, rollback);

        String docIds = String.format("[%s, %s]", newBeerId, breweryId);

        return Result.of(documents, docIds);
    }

    private static Boolean isParentHostMac() {

        String isMac = System.getenv("OS_PARENT_MAC");
        if (isMac == null) {
            return false;
        }
        System.out.println(String.format("Parent system is Mac: %s", isMac.equalsIgnoreCase("true")));
        return isMac.equalsIgnoreCase("true");
        
    }
}