/**
 * @author: Chen
 * @date:   Sep 6, 2019
 */
package com.frame.mq.property;

import java.io.Serializable;

/**
 * @author Chen
 * @date   Sep 6, 2019
 * @description SimpleMessageVO.java	
 */
public class TopicProperties implements Serializable{

	private static final long serialVersionUID = 1L;

	private Integer partitions;
	private Short replicas;
	private String name;

	public TopicProperties() {
		super();
	}

	/**
	 * @return the partitions
	 */
	public Integer getPartitions() {
		return partitions==null?10:partitions;			// default give 10 partitions
	}

	/**
	 * @param partitions the partitions to set
	 */
	public void setPartitions(Integer partitions) {
		this.partitions = partitions;
	}

	/**
	 * @return the replicas
	 */
	public Short getReplicas() {
		return replicas==null?3:replicas;				// default give 3 replicas
	}

	/**
	 * @param replicas the replicas to set
	 */
	public void setReplicas(Short replicas) {
		this.replicas = replicas;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	
}