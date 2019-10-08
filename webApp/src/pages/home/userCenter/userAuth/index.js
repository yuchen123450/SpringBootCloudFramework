import React, { Component } from 'react';
import { Form, Spin, Input, Icon, Modal, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { systemAction } from '../../../../actions';
import { isEmpty } from '../../../../utils/common';
import StandardForm from '../../../../components/standardForm';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import SearchCard from '../../../../containers/searchCard';
import UserAuthManagement from './userAuthManagement';
import copy from 'copy-to-clipboard';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
@connect(
    (state) => ({
        commonState: state.commonReducer,
        userCenterState: state.userCenterReducer,
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        //获取用户信息
        getUserInfo: (name, mobile, department, position, companyId, page, limit) =>
            dispatch(
                systemAction.getUserInfo(name, mobile, department, position, companyId, page, limit)
            ),
        //删除用户信息
        deleteUserInfo: (selectedIds) => dispatch(systemAction.deleteUserInfo(selectedIds)),
        //更新用户信息
        updateUserInfo: (
            id,
            staffId,
            name,
            mobile,
            email,
            companyId,
            company,
            department,
            position,
            remark,
            nickName,
            avatar,
            groupId,
            recordGroupIds
        ) =>
            dispatch(
                systemAction.updateUserInfo(
                    id,
                    staffId,
                    name,
                    mobile,
                    email,
                    companyId,
                    company,
                    department,
                    position,
                    remark,
                    nickName,
                    avatar,
                    groupId,
                    recordGroupIds
                )
            ),
        //重置用户密码
        resetPassword: (id) => dispatch(systemAction.resetPassword(id)),
        //查询用户组
        getUserGroup: (page, limit, name) => dispatch(systemAction.getUserGroup(page, limit, name)),
        //获取用户数据权限列表
        getRecordGroup: (name, companyId, recordGroupType, page, limit) =>
            dispatch(systemAction.getRecordGroup(name, companyId, recordGroupType, page, limit)),
        //新增用户
        addUserInfo: (
            staffId,
            name,
            password,
            mobile,
            email,
            companyId,
            company,
            department,
            position,
            remark,
            nickName,
            avatar,
            groupId,
            recordGroupIDs
        ) =>
            dispatch(
                systemAction.addUserInfo(
                    staffId,
                    name,
                    password,
                    mobile,
                    email,
                    companyId,
                    company,
                    department,
                    position,
                    remark,
                    nickName,
                    avatar,
                    groupId,
                    recordGroupIDs
                )
            ),
        getUserDefaultRoles: (companyId, isDefault) =>
            dispatch(systemAction.getUserDefaultRoles(companyId, isDefault)),
    })
)
@Form.create()
class UserAuth extends Component {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = this.props;
        this.state = {
            type: 3,
            selectedRowKeys: [],
            loading: true,
            data: [],
            hasData: false,
            page: 1,
            pageSize: 10,
            userName: '',
            createDialigVisible: false,
            userInfo: {},
            resetLoading: false,
            confirmDialogTitle: '',
            confirmDialogDialogContent: '',
            actionType: 0,
            userGroupNames: '',
            recordGroupNames: '',
            nickName: '',
            searchNameHint: formatMessage(locale.UserCenterUserNameHint),
            userSearchType: 0, //0 用户名 1 姓名
            clearEnterListener: false,
            firstLoading: true,
            companyId: props.statisticsState.personalInfo.companyId,
            actionMenuType: 1,
            rowId: '',
            localLang: props.intl.locale,
        };
        this.editClick = false;
    }

    static defaultProps = {
        type: 3, //类型 用户管理
        selectedRowKeys: [], //用户选中的数据key
        loading: true, //是否加载中
        data: [], //用户数据集合
        hasData: false, //是否有数据
        page: 1, //页码
        pageSize: 10, //每页请求数据长度
        userName: '', //用户名(查询条件)
        createDialigVisible: false, //是否显示创建dialog
        userInfo: {}, //用户信息item(编辑使用)
        realName: '', //用户的真实姓名(查询条件)
        resetLoading: false, //是否显示加载中(重置密码操作)
        confirmDialogTitle: '', //确认框提示标题
        confirmDialogDialogContent: '', //确认框提示内容
        actionType: 0, //表格操作类型 0 编辑 1 删除
        searchNameHint: '', //查询名字提示文字
        userSearchType: 0, //0 用户名 1 姓名
    };

    async componentDidMount() {
        let { userName, companyId, page, pageSize } = this.state;
        this.child.getInitData();
        this.loadData(userName, '', '', '', companyId, page, pageSize);
    }

    getDefaultRoles = () => {
        let { getUserDefaultRoles } = this.props;
        getUserDefaultRoles();
    };

    loadData = async (userName, mobile, department, position, companyId, page, pageSize) => {
        let { getUserInfo } = this.props;
        this.setState({
            loading: true,
        });
        let result = await getUserInfo(
            userName,
            mobile,
            department,
            position,
            companyId,
            page,
            pageSize
        );
        if (
            this.state.firstLoading &&
            result &&
            result.success &&
            result.data.list &&
            result.data.list.length > 0
        ) {
            this.handlerUserAuth(result.data.list[0], 3);
            this.setState(
                {
                    rowId: result.data.list[0].id,
                },
                () => {
                    this.child.handlerDefSelect();
                }
            );
        }
        this.setState({
            loading: false,
            userName,
            mobile,
            department,
            position,
            companyId,
            page,
            pageSize,
            firstLoading: false,
        });
    };

    _selectCallBack(callBackKeys) {
        this.setState({
            selectedRowKeys: callBackKeys,
        });
    }

    resetPwdOnclick = (actionID) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.UserCenterResetPassword),
            content: formatMessage(locale.UserCenterResetPasswordTips),
            onOk: async () => {
                let {
                    resetPassword,
                    intl: { formatMessage },
                } = this.props;
                if (resetPassword) {
                    let result = await resetPassword(actionID);
                    if (result.success) {
                        toast('success', formatMessage(locale.UserCenterResetPwdSuccess));
                        this.showSystemPassword(result.data, actionID);
                    }
                }
            },
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                let { name } = values; //dataGroup.key   userGroup.key
                handleSpace(values);
                let { userSearchType, companyId, page, pageSize } = this.state;
                this.loadData(
                    userSearchType == 0 ? name : '',
                    '',
                    '',
                    '',
                    companyId,
                    page,
                    pageSize
                );
            }
        });
    };

    _handlerEditClick = (object) => {
        this.setState({
            createDialigVisible: true,
            userInfo: object,
            actionType: 0,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    _handlerDeleteClick = (actionID) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    deleteUserInfo,
                    intl: { formatMessage },
                } = this.props;
                let { selectedRowKeys } = this.state;
                if (deleteUserInfo) {
                    let result = await deleteUserInfo(actionID);
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.handlerRefreshClick();
                        if (selectedRowKeys && selectedRowKeys.length > 0) {
                            selectedRowKeys.splice(
                                selectedRowKeys.findIndex((item) => item === actionID),
                                1
                            );
                            this.setState({
                                selectedRowKeys,
                            });
                        }
                    }
                }
            },
        });
    };

    handlerDelete = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteUserInfo,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteUserInfo) {
                        let result = await deleteUserInfo(selectedRowKeys.join(','));
                        if (result.success) {
                            toast('success', formatMessage(locale.DeleteSuccess));
                            this.handlerRefreshClick();
                            selectedRowKeys = '';
                            this.setState({
                                selectedRowKeys,
                            });
                        }
                    }
                },
            });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.SelectedNone),
            });
        }
    };

    handlerCreate = () => {
        this.setState({
            createDialigVisible: true,
            actionMenuType: 1,
            clearEnterListener: true,
        });
    };

    handlerReset = () => {
        this.setState(
            {
                userGroupNames: '',
                recordGroupNames: '',
                nickName: '',
                userName: '',
                selectedRowKeys: [],
            },
            () => {
                this.handlerRefreshClick();
            }
        );
        this.props.form.resetFields();
    };

    showSystemPassword = (password, actionID) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title:
                actionID === ''
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.UserCenterResetPwdSuccess),
            content: (
                <p>
                    <span>{`${formatMessage(locale.UserCenterPwdTipsOne)}:`}</span>
                    <span className='showPwd'>{password}</span>
                    <br />
                    <span>{formatMessage(locale.UserCenterPwdTipsTwo)}</span>
                </p>
            ),
            icon: <Icon type='check-circle' style={{ color: '#00a65a' }} />,
            okText: formatMessage(locale.Copy),
            cancelText: formatMessage(locale.Close),
            onOk() {
                copy(password);
                toast('success', formatMessage(locale.CopySuccess));
            },
            onCancel() { },
        });
    };

    /**
     * 刷新操作
     */
    handlerRefreshClick = () => {
        let { userName, companyId, page, pageSize } = this.state;
        this.loadData(userName, '', '', '', companyId, page, pageSize);
    };

    onCancel = () => {
        this.setState({ createDialigVisible: false, clearEnterListener: false });
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    renderUserState = (status) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let content = '';
        if (status == 1) {
            content = <span className='normal'>{formatMessage(locale.Normal)}</span>;
        } else if (isEmpty(status)) {
            content = <span className='lock'>{formatMessage(locale.Lock)}</span>;
        }
        return content;
    };

    handlerUserAuth = (userInfo, actionMenuType = 2) => {
        this.setState(
            {
                userInfo,
                actionMenuType,
                rowId: userInfo.id,
            },
            () => {
                this.editClick = false;
                this.child.handlerDefSelect();
            }
        );
    };
    onRef = (ref) => {
        this.child = ref;
    };

    clickRow = (userInfo) => {
        if (!this.editClick) {
            this.child.setLoading();
            this.handlerUserAuth(userInfo, 3);
            this.setState({
                rowId: userInfo.id,
            });
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        let {
            intl: { locale },
        } = nextProps;
        if (locale !== nextState.localLang) {
            this.setState(
                {
                    localLang: locale,
                },
                () => {
                    this.child.changeLocale();
                }
            );
            return true;
        }
        return true;
    }

    render() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
            userCenterState: { userDataSource, userGroupMenus },
        } = this.props;
        let {
            userInfo,
            selectedRowKeys,
            loading,
            page,
            resetLoading,
            actionMenuType,
            searchNameHint,
            userName,
            companyId,
            clearEnterListener,
            rowId,
        } = this.state;
        const columns = [
            {
                title: formatMessage(locale.UserName),
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                            <Ellipsis tooltip fullWidthRecognition lines>
                                {content}
                            </Ellipsis>
                        ),
            },
            {
                title: formatMessage(locale.Company),
                dataIndex: 'company',
                key: 'company',
                width: 150,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                            <Ellipsis tooltip fullWidthRecognition lines>
                                {content}
                            </Ellipsis>
                        ),
            },
            {
                title: formatMessage(locale.Status),
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (status) => this.renderUserState(status),
            },
            {
                title: formatMessage(locale.Remark),
                dataIndex: 'remark',
                key: 'remark',
                flex: 1,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                            <Ellipsis tooltip fullWidthRecognition lines>
                                {content}
                            </Ellipsis>
                        ),
            },
            {
                title: formatMessage(locale.Operate),
                dataIndex: 'id',
                key: 'id',
                fixed: 'right',
                width: 150,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[{ title: 'Authorize', auth: 'Authorize' }]}
                        // batchActionsMore={['UserCenterRestPwd', 'Delete']}
                        handleAction={(menu) => {
                            if (menu === 'Authorize') {
                                this.editClick = true;
                                this.handlerUserAuth(object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this._handlerDeleteClick(actionID);
                            } else if (menu.key == 'UserCenterRestPwd') {
                                this.resetPwdOnclick(actionID);
                            }
                        }}
                    />
                ),
            },
        ];

        return (
            <Scrollbar>
                <Row gutter={4} style={{ height: '100%' }}>
                    <Col span={10}>
                        <SearchCard
                            handlerSearch={this.handSearchClick}
                            handlerReset={this.handlerReset}
                            clearEnterListener={clearEnterListener}>
                            <StandardForm style={{ paddingRight: 10 }}>
                                <Form.Item label={formatMessage(locale.UserName)}>
                                    {formItemTips(
                                        getFieldDecorator,
                                        'name',
                                        0,
                                        64,
                                        formatMessage,
                                        locale
                                    )(<Input placeholder={searchNameHint} />)}
                                </Form.Item>
                            </StandardForm>
                        </SearchCard>
                        <Spin spinning={resetLoading}>
                            <StandardTable
                                loading={loading}
                                columns={columns}
                                rowKey={(record) => record.id}
                                dataSource={userDataSource === null ? [] : userDataSource.list}
                                onChange={(pagination) => {
                                    this.loadData(
                                        userName,
                                        '',
                                        '',
                                        '',
                                        companyId,
                                        pagination.current,
                                        pagination.pageSize
                                    );
                                }}
                                total={userDataSource.totalRecords}
                                totalTip={formatMessage(locale.TableCount, {
                                    count: userDataSource.totalRecords,
                                })}
                                current={page}
                                onRow={(record) => ({
                                    onClick: (e) => this.clickRow(record, e),
                                })}
                                rowId={rowId}
                            />
                        </Spin>
                    </Col>
                    <Col span={14} style={{ position: 'absolute', top: 0, bottom: 0, right: 0 }}>
                        <UserAuthManagement
                            userInfo={userInfo}
                            actionMenuType={actionMenuType}
                            handlerRefreshClick={this.handlerRefreshClick}
                            onRef={this.onRef}
                        />
                    </Col>
                </Row>
            </Scrollbar>
        );
    }
}
export default injectIntl(UserAuth);
