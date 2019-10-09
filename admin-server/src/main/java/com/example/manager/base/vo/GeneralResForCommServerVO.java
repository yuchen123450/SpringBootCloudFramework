package com.example.manager.base.vo;

import java.io.Serializable;

import com.example.manager.common.enums.BaseErrorEnum;
import com.example.manager.common.enums.ResultCodeEnum;

public class GeneralResForCommServerVO<T> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3737235852895882876L;

	public int resultCode;
	public String msg;
	public T result;

	public GeneralResForCommServerVO() {
		msg = "";
		result = null;
	}

	public int getResultCode() {
		return resultCode;
	}

	public void setResultCode(int resultCode) {
		this.resultCode = resultCode;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public T getResult() {
		return result;
	}

	public void setResult(T result) {
		this.result = result;
	}

	public static GeneralResForCommServerVO returnSuccessResult(Object result)
			throws InstantiationException, IllegalAccessException {

		GeneralResForCommServerVO res = new GeneralResForCommServerVO();
		res.setResultCode(ResultCodeEnum.SUCCESS.getCode());
		res.setMsg("success");
		res.setResult(result);
		return res;
	}

	public static GeneralResForCommServerVO returnErrorResult(ResultCodeEnum resultCode, BaseErrorEnum baseError,
			Object result) throws InstantiationException, IllegalAccessException {

		GeneralResForCommServerVO res = new GeneralResForCommServerVO();
		res.setResultCode(resultCode.getCode());
		res.setMsg(baseError.getMessageDefault());
		res.setResult(result);
		return res;
	}
}
