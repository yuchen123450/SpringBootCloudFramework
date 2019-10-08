import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Input, Button, Modal, Spin, Affix } from 'antd';
import { locale, formatMessage } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { connect } from 'react-redux';
import { systemAction } from '../../../../actions';
import { injectIntl } from 'react-intl';
import { isEmpty } from '../../../../utils/common';
import { formItemTips } from '../../../../utils/dom';
import StandardForm from '../../../../components/standardForm';
import CheckBoxGroup from '../../../../components/checkboxGroup';
import Scrollbar from '../../../../components/baseScroll';
import Enum from '../../../../utils/enum';

@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //新增用户组
        addUserGroup: (name, operationAuthority, remark) =>
            dispatch(systemAction.addUserGroup(name, operationAuthority, remark)),
        //更新用户组信息
        updateUserGroup: (id, name, operationAuthority, remark) =>
            dispatch(systemAction.updateUserGroup(id, name, operationAuthority, remark)),
    })
)
@Form.create()
class RoleAuthManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            multipleData: [],
            loading: true,
        };
        this.loadingTimeOutEvent = '';
    }

    static defaultProps = {};

    componentDidMount() {
        this.props.onRef(this);
        this.setLoading();
    }

    setLoading = () => {
        this.setState({
            loading: true,
        });
        this.loadingTimeOutEvent = setTimeout(() => {
            this.setState({ loading: false });
        }, 500);
    };

    componentWillUnmount() {
        clearTimeout(this.loadingTimeOutEvent);
    }

    handlerCallBack = (multipleData) => {
        this.setState({ multipleData });
    };

    createOrEditUserGroup = () => {
        let {
            addUserGroup,
            updateUserGroup,
            handlerRefreshClick,
            actionMenuType,
            userGroupInfo,
            form: { validateFields },
        } = this.props;
        let menuResult = this.convertData();
        let { checkedEmpty = false, menus = [] } = menuResult;
        if (checkedEmpty) {
            toast('warn', formatMessage(locale.RoleSettingTips));
            return;
        }
        validateFields((err, values) => {
            if (!err) {
                Modal.confirm({
                    title: formatMessage(locale.SaveConfirmation),
                    content: formatMessage(locale.SaveConfirmationContent),
                    onOk: async () => {
                        let result =
                            actionMenuType === 1
                                ? await addUserGroup(values.name, menus, values.remark)
                                : await updateUserGroup(
                                      userGroupInfo.id,
                                      values.name,
                                      menus,
                                      values.remark
                                  );
                        if (result.success) {
                            toast(
                                'success',
                                actionMenuType === 1
                                    ? formatMessage(locale.NewCreateSuccess)
                                    : formatMessage(locale.EditSuccess)
                            );
                            handlerRefreshClick();
                        }
                    },
                });
            }
        });
    };

    handlerReset = () => {
        let { actionMenuType, handlerCreate, handlerEdit, userGroupInfo } = this.props;
        1 === actionMenuType ? handlerCreate() : handlerEdit(userGroupInfo, 2);
    };

    /**
     * 将选择的选项转换成接口需要的json格式
     * [{menuId:'',operationIds:''}]
     */
    convertData = () => {
        let { multipleData } = this.state;
        let { data } = this.props;
        let menus = [];
        return this.handlerCallBackData(
            multipleData && multipleData.length && multipleData.length > 0 ? multipleData : data,
            menus
        );
    };

    handlerCallBackData = (multipleData, menus) => {
        let checkedEmpty = true;
        multipleData.forEach((item) => {
            if (Array.isArray(item.children)) {
                let addFirstLevelMenu = false;
                item.children.forEach((ele) => {
                    let operateIndex = 0;
                    if (Array.isArray(ele.children)) {
                        ele.children.forEach((operate) => {
                            if (operate.checked) {
                                checkedEmpty = false;
                                operateIndex++;
                                let findIndex = menus.findIndex((menu) => menu.menuId === ele.id);
                                if (-1 === findIndex) {
                                    addFirstLevelMenu = true;
                                    menus.push({ menuId: ele.id, operationIds: operate.id });
                                } else {
                                    menus[
                                        findIndex
                                    ].operationIds = `${menus[findIndex].operationIds},${operate.id}`;
                                }
                            }
                        });
                        if (operateIndex === 0 && (ele.checked || ele.indeterminate)) {
                            menus.push({ menuId: ele.id, operationIds: '' });
                            checkedEmpty = false;
                        }
                    }
                });
                if (addFirstLevelMenu || item.checked || item.indeterminate) {
                    menus.push({ menuId: item.id, operationIds: '' });
                    checkedEmpty = false;
                }
            }
        });
        return { checkedEmpty, menus };
    };

    handlerResetAllFields = () => {
        this.props.form.resetFields();
    };

    handlerSetDefValue = (userGroupInfo) => {
        if (userGroupInfo) {
            this.props.form.setFieldsValue({ name: userGroupInfo.name });
            this.props.form.setFieldsValue({ remark: userGroupInfo.remark });
        }
    };

    render() {
        let {
            form: { getFieldDecorator },
            data,
            actionMenuType,
            userGroupInfo,
        } = this.props;
        return (
            <Scrollbar>
                <Card
                    title={formatMessage(locale.PermissionSettings)}
                    className='page-layout-content-card'
                    bordered={false}
                    extra={
                        <Row gutter={12} type='flex' justify='end' align='middle'>
                            <Col>
                                <Button
                                    disabled={
                                        actionMenuType === 1
                                            ? false
                                            : (userGroupInfo && userGroupInfo.isDefault) ||
                                              actionMenuType === 3
                                            ? userGroupInfo.isDefault === 1 || actionMenuType === 3
                                            : false
                                    }
                                    onClick={this.handlerReset}>
                                    {formatMessage(locale['Reset'])}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    disabled={
                                        actionMenuType === 1
                                            ? false
                                            : (userGroupInfo && userGroupInfo.isDefault) ||
                                              actionMenuType === 3
                                            ? userGroupInfo.isDefault === 1 || actionMenuType === 3
                                            : false
                                    }
                                    type='primary'
                                    onClick={this.createOrEditUserGroup}>
                                    {formatMessage(locale.Save)}
                                </Button>
                            </Col>
                        </Row>
                    }>
                    <Spin spinning={this.state.loading}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.RoleName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'name',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    {
                                        required: true,
                                        emptyHint: 'RoleNameTips',
                                    },
                                    actionMenuType === 1
                                        ? ''
                                        : userGroupInfo && userGroupInfo.name
                                        ? userGroupInfo.name
                                        : ''
                                )(
                                    <Input
                                        disabled={actionMenuType === 3}
                                        placeholder={formatMessage(locale.RoleNameTips)}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.Remark)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'remark',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    false,
                                    actionMenuType === 1
                                        ? ''
                                        : userGroupInfo && userGroupInfo.remark
                                        ? userGroupInfo.remark
                                        : ''
                                )(
                                    <Input
                                        disabled={actionMenuType === 3}
                                        placeholder={formatMessage(locale.RemarkTips)}
                                    />
                                )}
                            </Form.Item>
                        </StandardForm>

                        <CheckBoxGroup
                            data={data}
                            handlerCallBack={this.handlerCallBack}
                            needLevelRelation={false}
                            needDisJointHandler={actionMenuType !== 3}
                            disjointLists={[
                                { name: ['MenuUserManager'] },
                                // { name: ['MenuSystemLog'] },//去除系统日志和用户管理以及安全保密员互斥key
                                {
                                    name: ['MenuUserGroup', 'MenuUserAuth', 'MenuDataPermission'],
                                },
                            ]}
                            defaultDisable={['MenuUserCenter']}
                        />
                    </Spin>
                </Card>
            </Scrollbar>
        );
    }
}
export default injectIntl(RoleAuthManagement);
