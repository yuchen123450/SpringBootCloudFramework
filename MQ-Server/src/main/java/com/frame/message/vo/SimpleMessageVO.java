/**
 * @author: Chen
 * @date:   Sep 6, 2019
 */
package com.frame.message.vo;

import java.util.Date;

import com.frame.manager.base.vo.GeneralReqVO;


/**
 * @author Chen
 * @date   Sep 6, 2019
 * @description SimpleMessageVO.java	
 */
public class SimpleMessageVO  extends GeneralReqVO{

	private static final long serialVersionUID = 1L;

	private String topic;
	private String msg;
	private String unixTime;

	public SimpleMessageVO() {
		super();
	}
	
	public SimpleMessageVO(String msg) {
		this.msg = msg;
		unixTime = String.valueOf(new Date().getTime());
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	/**
	 * @return the unixTime
	 */
	public String getUnixTime() {
		return unixTime;
	}

	/**
	 * @param unixTime the unixTime to set
	 */
	public void setUnixTime(String unixTime) {
		this.unixTime = unixTime;
	}

	/**
	 * @return the topic
	 */
	public String getTopic() {
		return topic;
	}

	/**
	 * @param topic the topic to set
	 */
	public void setTopic(String topic) {
		this.topic = topic;
	}
}