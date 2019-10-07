	package com.frame.router.manager.exception;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSON;
import com.frame.router.manager.enums.SystemCodeEnum;
import com.frame.router.manager.vo.GeneralResVO;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
	protected static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public Object MethodArgumentNotValidHandler(HttpServletRequest request, MethodArgumentNotValidException exception)
			throws Exception {
		logger.error("传入参数：{}", JSON.toJSONString(exception));

		// 按需重新封装需要返回的错误信息
		List<ArgumentInvalidResult> invalidArguments = new ArrayList<>();
		// 解析原错误信息，封装后返回，此处返回非法的字段名称，原始值，错误信息
		for (FieldError error : exception.getBindingResult().getFieldErrors()) {
			ArgumentInvalidResult invalidArgument = new ArgumentInvalidResult();
			invalidArgument.setMessage(error.getDefaultMessage());
			invalidArgument.setField(error.getField());
			invalidArgument.setRejectedValue(error.getRejectedValue());
			invalidArguments.add(invalidArgument);
		}

		return GeneralResVO.returnErrorResult(SystemCodeEnum.PARAM_ERROR, invalidArguments);
	}

	@ExceptionHandler(value = BindException.class)
	public Object BindHandler(HttpServletRequest request, BindException exception) throws Exception {
		logger.error("传入参数：{}", JSON.toJSONString(exception));
		// 按需重新封装需要返回的错误信息
		List<ArgumentInvalidResult> invalidArguments = new ArrayList<>();
		// 解析原错误信息，封装后返回，此处返回非法的字段名称，原始值，错误信息
		for (FieldError error : exception.getBindingResult().getFieldErrors()) {
			ArgumentInvalidResult invalidArgument = new ArgumentInvalidResult();
			invalidArgument.setMessage(error.getDefaultMessage());
			invalidArgument.setField(error.getField());
			invalidArgument.setRejectedValue(error.getRejectedValue());
			invalidArguments.add(invalidArgument);
		}

		return GeneralResVO.returnErrorResult(SystemCodeEnum.PARAM_ERROR, invalidArguments);
	}

	@ExceptionHandler(value = RuntimeException.class)
	public Object RuntimeHandler(HttpServletRequest request, RuntimeException exception) throws Exception {
		logger.error("服务异常：{}", JSON.toJSONString(exception));
		return GeneralResVO.returnErrorResult(SystemCodeEnum.SYSTEM_ERROR, null);
	}

}
