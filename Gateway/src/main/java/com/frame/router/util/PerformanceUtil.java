package com.frame.router.util;
import static com.frame.router.RouterApplication.date;

import java.util.Date;
import org.slf4j.Logger;

/**
 * @author Chen
 * @date   Sep 27, 2019
 * @description performanceUtil.java	
 */
public class PerformanceUtil {
	/**
	 *	reset global timer 
	 **/
	public void resetTimer() {
		date = new Date();
	}
	
	/**
	 *	return time consumed, and reset timer for next calculation 
	 **/
	public Long quickEval() {
		Long ans = new Date().getTime()-date.getTime();
		date = new Date();
		return ans;
	}
	
	/**
	 *	purely evaluate the timePerformance 
	 **/
	public Long Eval() {
		return new Date().getTime()-date.getTime();
	}
	
	/**
	 *	directly logger and print the performance value 
	 **/
	public void Eval(String procName, Logger logger) {
		Long ans = quickEval();
		System.out.println(procName + " takes @@ " +ans.toString() + "in ms");
		logger.info(procName + " takes @@ " +ans.toString() + "in ms");
	}
}
