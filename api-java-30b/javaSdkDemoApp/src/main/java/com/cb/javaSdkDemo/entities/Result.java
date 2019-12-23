package com.cb.javaSdkDemo.entities;

public class Result<T> implements IResponse{

    private final T data;
    private final String[] context;

    private Result(T data, String... contexts) {
        this.data = data;
        this.context = contexts;
    }

    public static <T> Result<T> of(T data, String... contexts) {
        return new Result<T>(data, contexts);
    }

    public T getData() {
        return data;
    }

    public String[] getContext() {
        return context;
    }
}