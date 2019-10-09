/**
 * @author: Chen
 * @date:   Mar 12, 2019
 */
/**
 * @author Chen
 * @date   Mar 12, 2019
 * @description package-info.java	
 */
package com.example.endpoint;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;

@Endpoint(id = "custom")
public class CustomEndpoint {

    @ReadOperation
    public String invoke() {
        return "Hello World!";
    }
}