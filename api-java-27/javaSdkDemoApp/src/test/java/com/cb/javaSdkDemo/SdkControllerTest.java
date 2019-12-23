package com.cb.javaSdkDemo;

import org.junit.Test;
import org.springframework.test.context.web.WebAppConfiguration;

@WebAppConfiguration
public class SdkControllerTest {

    @Test
    public void testHello() throws Exception {
        String bucket = System.getenv("CB_BUCKET");
        System.out.println(bucket);
    }
}