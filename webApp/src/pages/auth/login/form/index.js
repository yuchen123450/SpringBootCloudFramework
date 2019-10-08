import React, { PureComponent } from 'react';
import { Form, Input, Icon, Checkbox, Button, Layout } from 'antd';
import { locale, formatMessage } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { storage } from '../../../../utils/storage';
import { LOCALSTORAGE } from '../../../../constants/common';

@Form.create()
class LoginForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
    }
    componentDidMount() {
        this.userName.focus();
        let name = storage.get(LOCALSTORAGE.userName);
        if (name) {
            this.setState({ name });
        }
    }

    handleSubmit = () => {
        let {
            login,
            form: { validateFields, setFieldsValue },
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                let passwordLen = values.password.length;
                if (passwordLen < 8 || passwordLen > 16) {
                    toast('error', formatMessage(locale.AccountPasswordError));
                    setFieldsValue({
                        password: '',
                    });
                } else {
                    login(values);
                }
            }
        });
    };

    render() {
        const {
            loading,
            form: { getFieldDecorator },
        } = this.props;
        const { name } = this.state;
        return (
            <Layout className='login-form'>
                <Form className='login-form-panel'>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    type: 'email',
                                    message: formatMessage(locale.EmailErrorTips),
                                },
                            ],
                            initialValue: name,
                        })(
                            <Input
                                ref={(ref) => (this.userName = ref)}
                                prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder={formatMessage(locale.LoginUser)}
                                allowClear={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage(locale.LoginPasswordTip),
                                },
                            ],
                            // initialValue: 'PDS.cms.2018',
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
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: name !== '',
                        })(<Checkbox>{formatMessage(locale.LoginKeeping)}</Checkbox>)}
                        <a
                            className='login-form-forgot'
                            onClick={() => {
                                toast('info', formatMessage(locale.LoginPasswordForgotTip));
                            }}>
                            {formatMessage(locale.PasswordForgot)}
                        </a>
                    </Form.Item>
                </Form>
                <Button
                    className='login-form-btn'
                    type='primary'
                    shape='round'
                    loading={loading}
                    onClick={this.handleSubmit.bind(this)}>
                    {formatMessage(locale.Login)}
                </Button>
            </Layout>
        );
    }
}

export default LoginForm;
