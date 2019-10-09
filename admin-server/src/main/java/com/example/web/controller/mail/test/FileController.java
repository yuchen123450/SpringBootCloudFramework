/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.web.controller.mail.test;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.manager.base.vo.GeneralResVO;
import com.example.manager.file.FileService;
import com.example.manager.mail.EmailService;

import io.swagger.annotations.Api;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description File Test.java	
 */
@Api(value = "File controller", tags = { "test for decompression" })
@Controller
@RequestMapping(value = "/file")
public class FileController {
	@Autowired
	FileService fileService;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/test")
	public  @ResponseBody GeneralResVO SendSimpleEmail(BindingResult br,HttpServletRequest request)
			throws InstantiationException, IllegalAccessException {
		if (br.hasErrors()) {
			StringBuffer sb = new StringBuffer();
			List<FieldError> errorList = br.getFieldErrors();
			for (FieldError error : errorList) {
				sb.append(error.getField() + ":");
				sb.append(error.getDefaultMessage() + ";");
			}
		}
		GeneralResVO result= fileService.fileDecompression(request);
		return result;
	}
}
