package com.frame.manager.base.vo;

import java.io.Serializable;

public class GeneralReqVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4126377523240662842L;

	/**
	 * 语言类型
	 */
	String lan;

	Integer page;

	Integer limit;

	/**
	 * 接口版本号
	 */
	Integer v;

	public String getLan() {
		return lan;
	}

	public void setLan(String lan) {
		this.lan = lan;
	}

	public Integer getPage() {
		return page == null ? 1 : page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getLimit() {
		return limit == null ? 10 : limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public Integer getV() {
		return v;
	}

	public void setV(Integer v) {
		this.v = v;
	}

}
