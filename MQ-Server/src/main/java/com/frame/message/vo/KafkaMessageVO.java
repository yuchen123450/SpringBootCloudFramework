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
public class KafkaMessageVO  extends GeneralReqVO{

	private static final long serialVersionUID = 1L;

	private String topic;
	private String key;
	private String value;
	private String unixTime;
	public KafkaMessageVO() {
		super();
	}
	
	public KafkaMessageVO(String key,String value) {
		this.setKey(key);
		this.setValue(value);
		unixTime = String.valueOf(new Date().getTime());
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

	/**
	 * @return the key
	 */
	public String getKey() {
		return key;
	}

	/**
	 * @param key the key to set
	 */
	public void setKey(String key) {
		this.key = key;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	/**
	 * @param value the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}
}