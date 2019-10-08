import React, { PureComponent } from 'react';
import {
    Select,
    Form,
    Spin,
    Input,
    Row,
    Col,
    Button as AntdButton,
    Icon,
    Modal,
    Typography,
    Tooltip,
} from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { systemAction } from '../../../../actions';
import { debounce, isEmpty } from '../../../../utils/common';
import StandardForm from '../../../../components/standardForm';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import SearchCard from '../../../../containers/searchCard';
import TableAction from '../../../../containers/tableAction';
import UserNewCreateDialog from './userNewCreateDialog';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import { authComponent } from '../../../../components/authComponent';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import copy from 'copy-to-clipboard';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        commonState: state.commonReducer,
        userCenterState: state.userCenterReducer,
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
        searchUserGroup: (page, limit, name) =>
            dispatch(systemAction.searchUserGroup(page, limit, name)),
        //获取用户数据权限列表
        queryRecordGroup: (name, page, limit) =>
            dispatch(systemAction.queryRecordGroup(name, page, limit)),
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
    })
)
@Form.create()
class SystemUserManager extends PureComponent {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUserGroupSearch = debounce(this.fetchUserGroupSearch, 500);
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
            realName: '',
            userGroup: {},
            dataGroup: {},
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
            userGroupData: [],
            userGroupValue: [],
            fetching: false,
            dataGroupValue: [],
            dataGroupData: [],
            userSearchType: 0, //0 用户名 1 姓名
            clearEnterListener: false,
            companyId: '',
            copyIconType: 'copy',
            company: '',
        };
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
        userGroup: {}, //用户组(查询条件)
        dataGroup: {}, //数据组(查询条件)
        createDialigVisible: false, //是否显示创建dialog
        userInfo: {}, //用户信息item(编辑使用)
        realName: '', //用户的真实姓名(查询条件)
        resetLoading: false, //是否显示加载中(重置密码操作)
        confirmDialogTitle: '', //确认框提示标题
        confirmDialogDialogContent: '', //确认框提示内容
        actionType: 0, //表格操作类型 0 编辑 1 删除
        searchNameHint: '', //查询名字提示文字
        userGroupData: [], //用户数据组
        userGroupValue: [], //用户组值
        fetching: false,
        dataGroupValue: [], //数据组值
        dataGroupData: [], //数据组
        userSearchType: 0, //0 用户名 1 姓名
    };

    componentDidMount() {
        let { userName, companyId, page, pageSize } = this.state;
        this.loadData(userName, '', '', '', companyId, page, pageSize);
        //this.getDefaultRoles();
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
        await getUserInfo(userName, mobile, department, position, companyId, page, pageSize);
        this.setState({
            loading: false,
            userName,
            mobile,
            department,
            position,
            companyId,
            page,
            pageSize,
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
                        this.handlerRefreshCLick();
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

    handleDataGroupChange = (value) => {
        this.setState({
            dataGroupValue: value,
            dataGroupData: [],
            fetching: false,
        });
        let { onSearch } = this.props;
        if (onSearch) {
            onSearch({ dataGroup: value });
        }
    };

    async getDataGroupByName(queryRecordGroup, value, fetchId) {
        let result = await queryRecordGroup(value, 1, 500);
        if (result && result.success) {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            const dataGroupData = result.data.list.map((data) => ({
                text: `${data.name}`,
                value: data.name,
            }));
            this.setState({ dataGroupData, fetching: false });
        }
    }

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
                            this.handlerRefreshCLick();
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
                userName: '',
                selectedRowKeys: [],
                companyId: '',
            },
            () => {
                this.handlerRefreshCLick();
            }
        );
        this.props.form.resetFields();
    };

    showSystemPassword = (password, actionID) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { copyIconType } = this.state;
        Modal.confirm({
            title:
                actionID === ''
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.UserCenterResetPwdSuccess),
            content: (
                <p>
                    <span>{`${formatMessage(locale.UserCenterPwdTipsOne)}:`}</span>
                    <br />
                    <span className='showPwd'> {password}</span>
                    <Tooltip title={formatMessage(locale.Copy)}>
                        <Icon
                            style={{ color: '#08c', paddingLeft: '1rem' }}
                            type={copyIconType}
                            onClick={() => {
                                copy(password);
                                toast('success', formatMessage(locale.CopySuccess));
                            }}
                        />
                    </Tooltip>
                    <br />
                    <br />
                    <span>{formatMessage(locale.UserCenterPwdTipsTwo)}</span>
                </p>
            ),
            icon: <Icon type='check-circle' style={{ color: '#00a65a' }} />,
            okText: formatMessage(locale.Ok),
            cancelText: formatMessage(locale.Close),
            onOk() {},
            onCancel() {},
        });
    };

    /**
     * 刷新操作
     */
    handlerRefreshCLick = () => {
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
        if (status === 1) {
            content = <span className='normal'>{formatMessage(locale.Normal)}</span>;
        } else if (status === 2) {
            content = <span className='lock'>{formatMessage(locale.Lock)}</span>;
        }
        return content;
    };

    onCompanySelect = (value, node, extra) => {
        if (!isEmpty(node.key)) {
            this.setState({
                companyId: node.key,
            });
        }
    };

    render() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
            userCenterState: { userDataSource, useDefaultRoles },
        } = this.props;
        let {
            userInfo,
            selectedRowKeys,
            loading,
            page,
            createDialigVisible,
            resetLoading,
            actionMenuType,
            searchNameHint,
            userName,
            clearEnterListener,
            companyId,
        } = this.state;
        const columns = [
            {
                title: formatMessage(locale.UserName),
                dataIndex: 'name',
                key: 'name',
                width: 200,
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
                title: formatMessage(locale.RealName),
                dataIndex: 'nickName',
                key: 'nickName',
                width: 200,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
                visible: false,
            },
            {
                title: formatMessage(locale.Email),
                dataIndex: 'email',
                key: 'email',
                width: 200,
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
                width: 200,
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
                title: formatMessage(locale.UserCenterUserGroup),
                dataIndex: 'userGroupNames',
                key: 'userGroupNames',
                width: 200,
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
                title: formatMessage(locale.Depart),
                dataIndex: 'department',
                key: 'department',
                width: 150,
            },
            {
                title: formatMessage(locale.JobPosition),
                dataIndex: 'position',
                key: 'position',
                width: 150,
            },
            {
                title: formatMessage(locale.PersonNum),
                dataIndex: 'staffId',
                key: 'staffId',
                width: 150,
            },
            {
                title: formatMessage(locale.Remark),
                dataIndex: 'remark',
                key: 'remark',
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
                width: 160,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[{ title: 'Edit', auth: 'NewOrEditUser' }]}
                        batchActionsMore={[
                            { title: 'UserCenterRestPwd', auth: 'RestPwd' },
                            { title: 'Delete', auth: 'DeleteUser' },
                        ]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this._handlerEditClick(object);
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
                <SearchCard
                    handlerSearch={this.handSearchClick}
                    handlerReset={this.handlerReset}
                    clearEnterListener={clearEnterListener}>
                    <StandardForm style={{ paddingRight: 10 }}>
                        <Form.Item label={formatMessage(locale.UserName)}>
                            {formItemTips(getFieldDecorator, 'name', 0, 64, formatMessage, locale)(
                                <Input placeholder={searchNameHint} />
                            )}
                        </Form.Item>
                        <Form.Item label={formatMessage(locale.Company)}>
                            {getFieldDecorator('userCenterSearch')(
                                <ArchiveTree
                                    moduleId={'userCenterSearch'}
                                    moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                                    rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                                    leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                                    onTreeSelect={this.onCompanySelect}
                                    placeholder={formatMessage(locale.ElectricPowerCompanyTips)}
                                    defValue={{
                                        key: 1,
                                        value: companyId,
                                    }}
                                />
                            )}
                        </Form.Item>
                    </StandardForm>
                </SearchCard>
                <Spin spinning={resetLoading}>
                    <StandardTable
                        loading={loading}
                        columns={columns}
                        title={() => (
                            <TableAction
                                batchActions={[{ title: 'Delete', auth: 'DeleteUser' }]}
                                handleAction={(menu) => {
                                    switch (menu.key) {
                                        case 'Delete':
                                            this.handlerDelete();
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                                cleanSelectedKeys={this.cleanSelectedKeys}
                                rowCount={selectedRowKeys.length}>
                                <Row gutter={12} type='flex' justify='end' align='middle'>
                                    <Col>
                                        <Button
                                            auth='NewOrEditUser'
                                            type='primary'
                                            onClick={this.handlerCreate.bind(this)}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    e.preventDefault();
                                                }
                                            }}>
                                            <Icon type='plus' theme='outlined' />
                                            {formatMessage(locale.New)}
                                        </Button>
                                    </Col>
                                </Row>
                            </TableAction>
                        )}
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
                        selectCallBack={this._selectCallBack.bind(this)}
                        selectedRowKeys={selectedRowKeys}
                        current={page}
                    />
                    <UserNewCreateDialog
                        userInfo={userInfo}
                        intl={formatMessage}
                        visible={createDialigVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        handlerRefreshCLick={this.handlerRefreshCLick}
                        showSystemPassword={this.showSystemPassword}
                    />
                </Spin>
            </Scrollbar>
        );
    }
}
export default injectIntl(SystemUserManager);
