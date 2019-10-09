/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.manager.export;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

import com.example.manager.base.vo.GeneralResVO;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description mailService.java	
 */
public interface ExportService {
	@SuppressWarnings("rawtypes")
	public GeneralResVO exportExcel(HttpServletRequest request) throws InstantiationException, IllegalAccessException;
}
