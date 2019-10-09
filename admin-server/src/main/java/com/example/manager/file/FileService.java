/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.manager.file;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

import com.example.manager.base.vo.GeneralResVO;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description mailService.java	
 */
public interface FileService {
	@SuppressWarnings("rawtypes")
	public GeneralResVO fileDecompression(HttpServletRequest request) throws InstantiationException, IllegalAccessException;
}
