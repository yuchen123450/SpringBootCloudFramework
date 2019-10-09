package com.example.manager.base.vo;

import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 结果类基类.
 * 
 * @ClassName: GeneralResult
 * @Description: 结果类基类
 * @author yujunnan
 * @date 2017年2月9日 下午3:41:12
 *
 */
public class GeneralResult {

	/**
	 * 页号.
	 */
	private int pageNo;

	/**
	 * 页长度.
	 */
	private int pageLength;

	/**
	 * 总页数.
	 */
	private int totalPage;

	/**
	 * 总记录数.
	 */
	private long totalRecords;

	private List list;

	/**
	 * 获取pageNo.
	 * 
	 * @return pageNo
	 */
	public int getPageNo() {
		return pageNo;
	}

	/**
	 * 设置 pageNo.
	 * 
	 * @param pageNo
	 *            设置 pageNo
	 */
	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	/**
	 * 获取pageLength.
	 * 
	 * @return pageLength
	 */
	public int getPageLength() {
		return pageLength;
	}

	/**
	 * 设置 pageLength.
	 * 
	 * @param pageLength
	 *            设置 pageLength
	 */
	public void setPageLength(int pageLength) {
		this.pageLength = pageLength;
	}

	/**
	 * 获取totalPage.
	 * 
	 * @return totalPage
	 */
	public int getTotalPage() {
		return totalPage;
	}

	/**
	 * 设置 totalPage.
	 * 
	 * @param totalPage
	 *            设置 totalPage
	 */
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	/**
	 * 获取totalRecords.
	 * 
	 * @return totalRecords
	 */
	public long getTotalRecords() {
		return totalRecords;
	}

	/**
	 * 设置 totalRecords.
	 * 
	 * @param totalRecords
	 *            设置 totalRecords
	 */
	public void setTotalRecords(long totalRecords) {
		this.totalRecords = totalRecords;
	}

	public List getList() {
		return list;
	}

	public void setList(List list) {
		this.list = list;
	}

	/**
	 * 设置result.
	 * 
	 * @param list
	 *            结果集
	 * @param result
	 *            结果对象
	 * @return 设置后的结果对象
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public GeneralResult setResult(List list) {

		// 用PageInfo对结果进行包装
		PageInfo page = new PageInfo(list);
		this.setPageNo(page.getPageNum());
		this.setPageLength(page.getPageSize());
		this.setTotalRecords(page.getTotal());
		this.setTotalPage(page.getPages());
		this.setList(list);
		return this;
	}
}
