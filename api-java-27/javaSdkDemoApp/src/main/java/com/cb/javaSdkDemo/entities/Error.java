package com.cb.javaSdkDemo.entities;

public class Error implements IResponse {

    private final String failure;

    public Error(String failure) {
        this.failure = failure;
    }

    public String getFailure() {
        return failure;
    }
}