package com.example.common.exception;

public class EmailExistsException extends Exception {
    public EmailExistsException()
    {
        super();
    }
 
	public EmailExistsException(String string) {
        super(string);
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
}
