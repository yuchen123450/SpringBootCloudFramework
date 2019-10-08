import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import LocaleProvider from './locale';
import { LOCALSTORAGE } from '../constants/common';
import { storage } from '../utils/storage';
import { isEmpty } from '../utils/common';
import { authAction, systemAction } from '../actions';

import { CONFIG } from '../configs';

@connect(
    (state) => ({
        commonState: state.commonReducer,
    }),
    (dispatch) => ({
        checkToken: (authId) => dispatch(authAction.checkToken(authId)),
        //获取用户的菜单
        getUserMenus: () => dispatch(systemAction.getUserMenus()),
    })
)
class MainProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: '',
            antdLocale: {},
            messages: {},
            formats: {},
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let {
            commonState: { langType, langContent },
        } = nextProps;

        if (langType !== prevState.locale) {
            moment.locale(langType);
            let antd = {};
            let formats = {};
            switch (langType) {
                case 'zh-CN':
                    antd = zhCN;
                    formats = {
                        dateTime: 'YYYY-MM-DD HH:mm:ss',
                        date: 'YYYY-MM-DD',
                        dateAbbr: 'MM-DD',
                        time: 'HH:mm:ss',
                    };
                    break;
                case 'en-US':
                default:
                    antd = enUS;
                    formats = {
                        dateTime: 'MM/DD/YYYY HH:mm:ss',
                        date: 'MM/DD/YYYY',
                        dateAbbr: 'MM/DD',
                        time: 'HH:mm:ss',
                    };
                    break;
            }
            addLocaleData(require(`react-intl/locale-data/${langType.split('-')[0]}`));
            return {
                locale: langType,
                antdLocale: antd,
                formats: formats,
                messages: {
                    ...langContent,
                },
            };
        } else {
            return null;
        }
    }

    componentDidMount = async () => {
        // 在开发环境下，添加当前调试版本名称
        if (CONFIG.isDev) {
            document.title = `${CONFIG.name} - ${CONFIG.website.version}`;
        } else {
            document.title = `${CONFIG.website.title} - ${CONFIG.website.version}`;
        }
        let { checkToken } = this.props;
        let token = storage.get(LOCALSTORAGE.token);
        if (isEmpty(token) === false) {
            await checkToken(token);
        }
        let {
            commonState: { accredit },
        } = this.props;
        //授权不通过情况下，跳转到登陆页面
        if (!accredit) {
            let loginPagePath = '/index.html';
            if (window.location.pathname != loginPagePath) {
                window.location.href = loginPagePath;
            }
        } else {
            let { getUserMenus } = this.props;
            let getUserMenusResult = await getUserMenus();
            if (getUserMenusResult.success && getUserMenusResult.data) {
                this.getOperationListString(getUserMenusResult.data);
            }
        }
    };

    getOperationListString(data) {
        let operationList = [];
        data.map((item) => {
            if (item.children) {
                item.children.map((element) => {
                    if (!isEmpty(element.operationListString)) {
                        operationList.push(...element.operationListString);
                    }
                });
            }
        });
        var base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(operationList));
        storage.set(LOCALSTORAGE.authOperation, base64);
    }

    render() {
        let { antdLocale, ...rest } = this.state;
        let { children } = this.props;
        return (
            <IntlProvider {...rest}>
                <ConfigProvider locale={antdLocale}>
                    <LocaleProvider>{children}</LocaleProvider>
                </ConfigProvider>
            </IntlProvider>
        );
    }
}
export default MainProvider;
