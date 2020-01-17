package com.cb.javaSdkDemo.controllers;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import com.cb.javaSdkDemo.services.SdkDemoService;
import com.cb.javaSdkDemo.entities.IResponse;
import com.cb.javaSdkDemo.entities.Result;
import com.cb.javaSdkDemo.entities.Error;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins="*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/java30b")
public class SdkController {

    private final SdkDemoService service;

    public SdkController() {
        this.service = new SdkDemoService();
    }

    @RequestMapping("/ping")
    String ping() {
        return "pong!";
    }

    @RequestMapping(value="/connect", method = RequestMethod.POST)
    ResponseEntity<Map<String, Object>> connect(@RequestBody Map<String, String> requestArgs) {

        Map<String, Object> result = new HashMap<String,Object>();

        try{
            String host = requestArgs.get("host");
            String bucket = requestArgs.get("bucket");
            String username = requestArgs.get("username");
            String password = requestArgs.get("password");
            List<String> ids = this.service.Connect(host, bucket, username, password);
            
            if(ids != null){
                String bucketName = this.service.bucketName();
                result.put("message", String.format("Connected to bucket:  %s", bucketName));
                result.put("data", ids);
                return ResponseEntity.ok(result);
            }

            result.put("message", String.format("Could not connect to host: %s / bucket: %s", host, bucket));
            return ResponseEntity.ok(result);
        }catch(Exception e){
            result.put("message", e.getMessage());
            result.put("data", e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @RequestMapping(value="/getBucketName", method = RequestMethod.GET)
    String connectedBucketName() {
        String bucketName = this.service.bucketName();
        return bucketName;
    }

    @RequestMapping(value="/n1qlQuery", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> n1qlQuery(@RequestBody Map<String, String> requestArgs) {
        try {
            String query = requestArgs.get("query");
            Result<List<Map<String, Object>>> result = this.service.n1qlQuery(query);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/get", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> get(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            Result<Map<String, Object>> result = this.service.get(docId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/getMulti", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> getMulti(@RequestBody Map<String, String> requestArgs){
        try {
            String docIds = requestArgs.get("docIds");
            Result<List<Map<String, Object>>> result = this.service.getMulti(docIds);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/getReplica", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> getReplica(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            Result<Map<String, Object>> result = this.service.getReplica(docId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/touch", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> touch(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            Integer expiry = Integer.parseInt(requestArgs.get("expiry"));
            Result<Boolean> result = this.service.touch(docId, expiry);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/getAndTouch", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> getAndTouch(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            Integer expiry = Integer.parseInt(requestArgs.get("expiry"));
            Result<Map<String, Object>> result = this.service.getAndTouch(docId, expiry);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/upsert", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> upsert(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            String doc = requestArgs.get("doc");
            Result<Map<String, Object>> result = this.service.upsert(docId, doc);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/insert", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> insert(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            String doc = requestArgs.get("doc");
            Result<Map<String, Object>> result = this.service.insert(docId, doc);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/replace", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> replace(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            String doc = requestArgs.get("doc");
            Result<Map<String, Object>> result = this.service.replace(docId, doc);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/remove", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> remove(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            Result<String> result = this.service.remove(docId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/lookupIn", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> lookupIn(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            String path = requestArgs.get("path");
            String resultType = requestArgs.get("resultType");
            Result<Map<String, Object>> result = this.service.lookupIn(docId, path, resultType);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/mutateIn", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> mutateIn(@RequestBody Map<String, String> requestArgs){
        try {
            String docId = requestArgs.get("docId");
            String path = requestArgs.get("path");
            String value = requestArgs.get("value");
            String resultType = requestArgs.get("resultType");
            Result<Map<String, Object>> result = this.service.mutateIn(docId, path, value, resultType);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/fts", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> fts(@RequestBody Map<String, String> requestArgs){
        try {
            String term = requestArgs.get("term");
            String index = new String();
            Integer fuzzy = Integer.parseInt(requestArgs.get("fuzziness"));
            Result<List<Map<String, List<String>>>> result = this.service.fts(term, index, fuzzy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/acid", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> acid(@RequestBody Map<String, String> requestArgs){
        try {
            String doc1Id = requestArgs.get("doc1Id");
            String doc1 = requestArgs.get("doc1");
            String doc2Id = requestArgs.get("doc2Id");
            String doc2 = requestArgs.get("doc2");
            Boolean rollback = Boolean.valueOf(requestArgs.get("rollback"));
            Result<List<Map<String, Object>>> result = this.service.executeTransaction(doc1Id, doc1, doc2Id, doc2, rollback);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

    @RequestMapping(value="/acidBS", method = RequestMethod.POST)
    public ResponseEntity<? extends IResponse> acidBS(@RequestBody Map<String, String> requestArgs){
        try {
            String newBeerId = requestArgs.get("newBeerId");
            String newBeer = requestArgs.get("newBeer");
            String breweryId = requestArgs.get("breweryId");
            Boolean rollback = Boolean.valueOf(requestArgs.get("rollback"));
            Result<List<Map<String, Object>>> result = this.service.executeBeerSampleTransaction(newBeerId, newBeer, breweryId, rollback);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Error(e.getMessage()));
        }
    }

}
