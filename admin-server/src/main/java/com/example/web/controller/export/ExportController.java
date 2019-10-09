/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.web.controller.export;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.manager.base.vo.GeneralResVO;
import com.example.manager.base.vo.GeneralResult;
import com.example.manager.common.enums.RestErrorEnum;
import com.example.manager.common.enums.ResultCodeEnum;
import com.example.manager.export.ExportService;
import com.example.manager.mail.EmailService;

import io.netty.handler.codec.http.HttpContentEncoder.Result;
import io.swagger.annotations.Api;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description EmailSender.java	
 */
@Api(value = "test mail intereface", tags = { "swag next rome接口" })
@RestController
@RequestMapping(value = "/export")
public class ExportController {
	@Autowired
	ExportService exportService;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/xls")
	public @ResponseBody GeneralResVO SendSimpleEmail(HttpServletRequest request)
			throws InstantiationException, IllegalAccessException {
		GeneralResVO result = exportService.exportExcel(request);
		return result;
	}
}
