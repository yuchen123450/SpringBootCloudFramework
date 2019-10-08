import React, { PureComponent } from 'react';
import { Form, Input, Icon, Checkbox, Spin, Button, Layout,Col } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../locale';
import { toast } from '../../../../components/toast';
// import { get } from 'http';
import { formItemTips } from '../../../../utils/dom';


@Form.create()
class RegForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //登录请求进度
            loading: false,
            agree:false,
        };
    }
    componentDidMount() {
        this.email.focus();
    }

    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const {intl: { formatMessage }}=this.props;

        if (value && value !== getFieldValue('password')) {
            callback(formatMessage(locale.NewPassWordNotMatching));
        }

        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { submit,login, form: { validateFields } } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                let res = await submit(values.email.trim(),
                            values.password.trim(),
                            values.name.trim(),
                            values.companyName.trim(),
                            values.token.trim(),
                            );
                if (res.success) {
                    await login(values.email.trim(), values.password.trim(), true);
                }
                else{
                    return;
                }
            }
            this.setState({
                loading: false,
            });
        });
    };

    handleActivation = async() =>{
        const  {getCode,form: {getFieldValue},intl:{formatMessage}} = this.props;
        let{agree} = this.state;
        if(agree){
            let email = getFieldValue('email');
            if(email){
                let res= await getCode(email);
                return res;
            }
            toast('info', formatMessage(locale.EmailErrorTips));
        }
        else{
            toast('info', formatMessage(locale.AgreementTip));
        }
    }

    render() {
        const {
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;
        let { loading } = this.state;
        return (
            <Layout className='login-form'>
                <Form className='login-form-panel'>
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{
                                required: true,
                                type: 'email',
                                message: formatMessage(locale.EmailErrorTips),
                            }],
                            // initialValue: 'PDS.dev',
                        })(
                            <Input
                                ref={ref => this.email = ref}
                                prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder={formatMessage(locale.LoginUser)}
                                allowClear={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: formatMessage(locale.LoginPasswordTip),
                            },{
                                min: 8,
                                max: 16,
                                message: formatMessage(locale.InputLengthTip, {
                                    min: 8,
                                    max: 16,
                                }),
                            }],
                        })(
                            <Input
                                prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type='password'
                                onPressEnter={this.handleSubmit.bind(this)}
                                placeholder={formatMessage(locale.LoginPasswordTip)}
                                allowClear={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('passwordCheck', {
                            rules: [{
                                required: true,
                                message: formatMessage(locale.LoginPasswordTip),
                            }, {
                                validator: this.handleConfirmPassword,
                            }],
                        })(
                            <Input
                                prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type='password'
                                placeholder={formatMessage(locale.LoginPasswordTip)}
                                allowClear={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {formItemTips(getFieldDecorator, 'name', 2, 64, formatMessage, locale, {required:true,emptyHint:'UserCenterUserNameHint'}, name, 'name', formatMessage(locale.UserNameCheckTips), true)
                        (
                            <Input
                                prefix={<Icon type='smile'  theme='filled' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder={formatMessage(locale.UserCenterUserNameHint)}
                                allowClear={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {/* {getFieldDecorator('companyName', {
                            rules: [{
                                required: true,
                                message: formatMessage(locale.CompanyManagerCompanyNameRequest),
                            }],
                        })(
                            <Input
                                prefix={<Icon type='sketch-circle' theme="filled" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onPressEnter={this.handleSubmit.bind(this)}
                                placeholder={formatMessage(locale.CompanyManagerCompanyNameRequest)}
                                allowClear={true}
                            />
                        )} */}
                        {formItemTips(getFieldDecorator, 'companyName', 1, 100, formatMessage, locale, { required: true, emptyHint: 'CompanyManagerCompanyNameRequest' })
                        (<Input
                            prefix={<Icon type='sketch-circle' theme="filled" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={this.handleSubmit.bind(this)}
                            placeholder={formatMessage(locale.CompanyManagerCompanyNameRequest)}
                            allowClear={true}
                        />)}
                    </Form.Item>
                    <Form.Item>
                        <Col span={15}>
                            {getFieldDecorator('token', {
                                rules: [{
                                    required: true,
                                    message: formatMessage(locale.ActivationCodeTip),
                                },{
                                    min: 10,
                                    max: 10,
                                    message: formatMessage(locale.InputLengthTip, {
                                        min: 10,
                                        max: 10,
                                    }),
                                }],
                            })(
                                <Input
                                    prefix={<Icon type='bulb' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={formatMessage(locale.ActivationCodeReqTip)}
                                    allowClear={true}
                                />
                            )}
                        </Col>
                        <Col span={1}/>
                        <Col span={8}>
                            <Button
                                className="login-form-btn"
                                type="primary"
                                shape="round"
                                icon="download"
                                onClick={this.handleActivation.bind(this)}
                            >
                                {
                                    formatMessage(locale.ActivationCode)
                                }
                            </Button>
                        </Col>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox
                            onChange={(v)=>{
                            this.setState({
                                agree:v.target.checked,
                            });
                        }}>
                            {
                                formatMessage(locale.Accept)
                            }
                        </Checkbox>
                        <a
                            className="login-form-forgot"
                            onClick={() => {
                                toast('info', formatMessage(locale.LoginPasswordForgotTip));
                            }}>
                            {
                                formatMessage(locale.Terms)
                            }
                        </a>
                    </Form.Item>
                </Form>
                <Button
                    className="login-form-btn"
                    type="primary"
                    onClick={this.handleSubmit.bind(this)}
                    disabled = {!this.state.agree}
                >
                    <Spin spinning={loading} />
                    {
                        formatMessage(locale.Submit)
                    }
                </Button>
            </Layout>
        );

    }
}

export default injectIntl(RegForm);
