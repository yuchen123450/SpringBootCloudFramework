package com.example.manager.common.enums;

public enum RestErrorEnum implements BaseErrorEnum {

	BUSSINESS_ERROR("BussinessError","BussinessError"), 
	TOKEN_EXPIRED("TokenExpired","TokenExpired"),
	SERVICE_CURRENTLY_UNAVAILABLE("ServiceNotAvailable","ServiceNotAvailable"), 
	REQUEST_NOT_EXIST("RequestNotExist", "RequestNotExist"),
	PARAMETER_FORMAT_ERROR("ParameterformatError","ParameterFormatError"),
	COUNTRY_NAME_EXIST("CountryNameExist","CountryNameExist"),
	COMAPANY_NAME_EXIST("CompanyNameExist","CompanyNameExist"),
	NO_DATA_SELECTED("NoDataSelected","NoDataSelected"),
	COMPANY_CANNOT_DELETESELF("CompanyCanNotDeleteSelf","CompanyCanNotDeleteSelf"),
	SUBSTATION_HAS_DEVICE("SubstationHasDevice","SubstationHasDevice"),
	GROUP_NAME_EXIST("GroupNameExist","GroupNameExist"),
	GROUP_NOT_EXIST("GroupNameNotExist","GroupNameNotExist"),
	SELECTED_DEVICES_HAVE_TESTPOINTS("SelectedDevicesHaveTestpoints","SelectedDevicesHaveTestpoints"),
	BAY_HAS_DEVICE("BayHasDevice","BayHasDevice"),
	TESTPOINT_TEMPLATE_EXISTS("TestPointTemplateAlreadyExists","TestPointTemplateAlreadyExists"),
	COMPANY_CANNOT_MODIFY("CompanyHasNoRightToModify","CompanyHasNoRightToModify"),
	COMPANY_CANNOT_DELETE("CompanyHasNoRightToDelete","CompanyHasNoRightToDelete"),
	TESTPOINT_TEMPLATE_DETAIL_EXISTS("TestPointTemplateDetailRecordAlreadyExists","TestPointTemplateDetailRecordAlreadyExists"),
	EXIST_INVALID_ID("ThereExistsInvalidId_Skipped","ThereExistsInvalidId_Skipped");
	/** 代码 */
	private final String messageKey;
	/** 信息所属的key */
	private final String messageDefault;

	RestErrorEnum(String messageKey, String messageDefault) {
		this.messageKey = messageKey;
		this.messageDefault = messageDefault;
	}

	@Override
	public String getMessageKey() {
		// TODO Auto-generated method stub
		return messageKey;
	}

	@Override
	public String getMessageDefault() {
		// TODO Auto-generated method stub
		return messageDefault;
	}
}
