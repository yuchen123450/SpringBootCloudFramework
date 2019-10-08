//命名规则：HTTP_服务端路径。例如POST_AUTH_GET_TOKEN

import { CONFIG } from '../configs';
const serverUrl = CONFIG.server.url;

/**
 * Gateway----------------------------------------------------------------------------------------------------------
 */
//Login
export const POST_AUTH_GET_TOKEN = `${serverUrl}/auth/getToken`;
//Check Token
export const POST_AUTH_CHECK_TOKEN = `${serverUrl}/auth/checkToken`;
//Get Locale File
export const GET_LANG_CONTENT = `${serverUrl}/locales`;
//Customize Resource
export const GET_CUSTOM_RESOURCE = `${serverUrl}/assets/resource`;

//获取Websocket地址
export const GET_ACTIVE_MQ_CONFIG = `${serverUrl}/api/data/getActiveMQConfig`;

/**
 * Archive----------------------------------------------------------------------------------------------------------
 */
//Get Country Information
export const POST_ARCHIVE_REGION_COUNTRY = `${serverUrl}/archive/region/country`;
//Get State/Province Information
export const POST_ARCHIVE_REGION_PROVINCE = `${serverUrl}/archive/region/province`;
//Get City/County Information
export const POST_ARCHIVE_REGION_CITY_COUNTY = `${serverUrl}/archive/region/cityCounty`;
// trigger to update country, province and cityCounty
export const POST_ARCHIVE_REGION_TRIGGER = `${serverUrl}/archive/region/trigger`;
