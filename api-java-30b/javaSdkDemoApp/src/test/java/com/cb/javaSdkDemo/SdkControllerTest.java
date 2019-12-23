package com.cb.javaSdkDemo;

//import com.cb.javaSdkDemo.services.SdkDemoService;
import org.junit.Test;
import org.springframework.test.context.web.WebAppConfiguration;
//import org.springframework.beans.factory.annotation.Autowired;

//@SpringBootTest
@WebAppConfiguration
public class SdkControllerTest {

    /*private SdkDemoService service;

    public SdkControllerTest() {
        this.service = new SdkDemoService();
    }*/

    @Test
    public void testHello() throws Exception {
        String bucket = System.getenv("CB_BUCKET");
        System.out.println(bucket);
        //String demoBucket = this.service.bucketName();

        //assertTrue("Bucket names don't match.", bucket == demoBucket);
    }
}