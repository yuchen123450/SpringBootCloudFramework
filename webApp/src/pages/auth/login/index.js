import React, { PureComponent, Fragment } from 'react';
import { Tabs, Icon } from 'antd';
import { connect } from 'react-redux';

import { CONFIG } from '../../../configs';
import { formatMessage, locale } from '../../../pages/locale';
import { authAction,systemAction  } from '../../../actions';

import Header from '../../../containers/header';
import LoginForm from './form/index';
import { isEmpty } from '../../../utils/common';
import { LOCALSTORAGE } from '../../../constants/common';
import { storage } from '../../../utils/storage';
import RegForm from './regform';
import { toast } from '../../../components/toast';

@connect(
    (state) => ({
        commonState: state.commonReducer,
        loginState: state.loginReducer,
    }),
    (dispatch) => ({
        login: (username, password, remember) =>
            dispatch(authAction.login(username, password, remember)),
   register:(email,password,name,companyName,token)=>dispatch(systemAction.register(email,password,name,companyName,token)),	
   getCode:(email)=>dispatch(systemAction.getCode(email)),
    })
)
class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //登录请求进度
            loading: false,
            copyright: {
                name: CONFIG.website.title,
                logo: CONFIG.website.logo,
            },
        };
    }

    handleSubmit = async (values) => {
        this.setState({ loading: true });
        let { login } = this.props;
        let { username, password, remember } = values;
        await login(username.trim(), password.trim(), remember);
        this.setState({ loading: false });
    };

    renderCopyright = () => {
        let copyright = CONFIG.website.copyright;
        if (CONFIG.name === 'default') {
            let langType = storage.get(LOCALSTORAGE.langType);
            if (langType === 'zh-CN') {
                copyright = '华乘电气科技股份有限公司';
            }
        }
        return copyright;
    };

    render() {
        let { loading, copyright } = this.state;
        let {
            loginState: { success },
            register,login,getCode,
        } = this.props;
        if (success) {
            let targetPage = storage.get(LOCALSTORAGE.targetPage);
            if (targetPage) {
                window.location.href = targetPage;
            } else {
                window.location.href = '/home.html';
            }
        }
        return (
            <Fragment>
                <Header page='login' copyright={copyright} />
                <div className='login'>
                    <div className='vertical-align'>
                        <div className='vertical-align-middle'>
                            <div className='brand' />
                            <Tabs defaultActiveKey='1'>
                                <Tabs.TabPane tab={formatMessage(locale.LoginAccount)} key='1'>
                                    <LoginForm
                                        loading={loading}
                                        login={(values) => {
                                            this.handleSubmit(values);
                                        }}
                                    />
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={formatMessage(locale.Register)} key="2">
                                    <RegForm submit={register} login={login} getCode={getCode}/>
                                </Tabs.TabPane>
                                {/* <Tabs.TabPane tab={formatMessage(locale.LoginQR)} key='2'>
									<div style={{ height: '205px' }} />
								</Tabs.TabPane> */}
                            </Tabs>
                            <p className='copyright'>
                                <Icon type='copyright' theme='outlined' />
                                {` 2019 ${this.renderCopyright()}`}
                            </p>
                            {isEmpty(CONFIG.website.termsUrl) ? null : (
                                <a
                                    className='statement'
                                    onClick={() => {
                                        window.open('./legal-agreement.html', '_blank');
                                    }}>
                                    {formatMessage(locale.Statement)}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Login;
