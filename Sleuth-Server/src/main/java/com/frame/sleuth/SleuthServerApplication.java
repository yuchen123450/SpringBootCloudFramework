package com.frame.sleuth;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import com.frame.util.PerformanceUtil;
import zipkin.server.EnableZipkinServer;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZipkinServer
public class SleuthServerApplication{
	public static Date date;
	private static Logger logger = LoggerFactory.getLogger(SleuthServerApplication.class);
	
	public static void main(String[] args) {
		// initialize a time variable
		date = new Date();
		PerformanceUtil performanceUtil = new PerformanceUtil();
		
		System.out.println("============================================================= Start running eureka =============================================================");
//        System.err.println("请输入 slave1 或者 slave2");
//        Scanner scanner = new Scanner(System.in);
//        String profiles = scanner.nextLine();//让用户输入端口号
		SpringApplication.run(SleuthServerApplication.class, args);
        System.out.println("============================================================= eureka starts =============================================================");
        performanceUtil.Eval("Sleuth", logger);  
	}

}
