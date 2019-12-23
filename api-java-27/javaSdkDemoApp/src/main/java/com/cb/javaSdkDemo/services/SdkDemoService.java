package com.cb.javaSdkDemo.services;

import com.cb.javaSdkDemo.entities.Result;
import com.cb.javaSdkDemo.repository.SdkDemoRepository;

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

    public Result<List<Map<String, Object>>> n1qlQuery(String query) {

        List<Map<String, Object>> result = repository.n1qlQuery(query);

        return Result.of(result, query.toString());
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

    private static Boolean isParentHostMac() {

        String isMac = System.getenv("OS_PARENT_MAC");
        if (isMac == null) {
            return false;
        }
        System.out.println(String.format("Parent system is Mac: %s", isMac.equalsIgnoreCase("true")));
        return isMac.equalsIgnoreCase("true");
        
    }
}