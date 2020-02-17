/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.manager.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import com.example.manager.export.Employee;
import com.github.junrar.Archive;
import com.github.junrar.exception.RarException;
import com.github.junrar.extract.ExtractArchive;
import com.github.junrar.impl.FileVolumeManager;
import com.github.junrar.rarfile.FileHeader;
import com.example.manager.common.enums.SystemCodeEnum;
import com.alibaba.fastjson.JSON;
import com.example.manager.base.vo.GeneralResVO;
import com.example.manager.common.enums.ResultCodeEnum;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description mailServiceImpl.java	
 */
@Component
public class FileServiceImpl implements FileService {
	protected static final Logger logger = LoggerFactory.getLogger(FileServiceImpl.class);
	
	@Value(value = "${file.uploadpath}")
	private String fileSavePath;
	
	/**
	 *@author: 	Chen
	 *@date:  	Apr 10, 2019
	 *@location:
	 */
	@Override
	public GeneralResVO fileDecompression(HttpServletRequest request)
			throws InstantiationException, IllegalAccessException {
		  String filename=fileSavePath+"test.rar";
		  File f=new File(filename);
		  Archive a=null;
		  try {
		    a=new Archive(new FileVolumeManager(f));
		  }
		 catch (  RarException e) {
		    e.printStackTrace();
		  }
		catch (  IOException e) {
		    e.printStackTrace();
		  }
		  if (a != null) {
		    a.getMainHeader().print();
		    FileHeader fh=a.nextFileHeader();
		    while (fh != null) {
		      try {
		        File out=new File(fileSavePath+"sample");
		        System.out.println(out.getAbsolutePath());
		        FileOutputStream os=new FileOutputStream(out);
		        a.extractFile(fh,os);
		        os.close();
		      }
		 catch (      FileNotFoundException e) {
		        e.printStackTrace();
		      }
		catch (      RarException e) {
		        e.printStackTrace();
		      }
		catch (      IOException e) {
		        e.printStackTrace();
		      }
		      fh=a.nextFileHeader();
		    }
		  }
	
	  return GeneralResVO.returnSuccessResult(null);
	}

//        try {
//        	 File rar = new File("test.rar");
//        	 File tmpDir = File.createTempFile("bip.",".unrar");
//        	 if(!(tmpDir.delete())){
//        		 throw new IOException("Could not delete temp file: " + tmpDir.getAbsolutePath());
//        	 }
//        	 if(!(tmpDir.mkdir())){
//        		 throw new IOException("Could not create temp directory: " + tmpDir.getAbsolutePath());
//        	 }
//        	 System.out.println("tmpDir="+tmpDir.getAbsolutePath());
//        	 ExtractArchive extractArchive = new ExtractArchive();
//        	 extractArchive.extractArchive(rar, tmpDir);
//        	 System.out.println("finished.");
//        	
//        	
//    		File f = new File("Test");
//            Archive archive = new Archive(f);
//            archive.getMainHeader().print();
//            FileHeader fh = archive.nextFileHeader();
//            while(fh!=null){        
//                    File fileEntry = new File(fh.getFileNameString().trim());
//                    System.out.println(fileEntry.getAbsolutePath());
//                    FileOutputStream os = new FileOutputStream(fileEntry);
//                    archive.extractFile(fh, os);
//                    os.close();
//                    fh=archive.nextFileHeader();
//            }
//    		return null;
//		} catch (Exception e) {
//			return null;
//		}
//	}
  
}