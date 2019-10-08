import React, { PureComponent } from 'react';
import { Row, Col, Icon, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import { injectIntl } from 'react-intl';
import UserNewCreateDialog from './userNewCreateDialog';
import DeleteDialog from '../../../specifications/confirmDialog';
import { systemAction } from '../../../../actions';
import { toast } from '../../../../components/toast';
import {
    SYSTEM_USER_ADD_USER_INFO,
    SYSTEM_USER_UPDATE_USER_INFO,
    SYSTEM_USER_DELETE_USER_INFO,
    SYSTEM_USER_GROUP_GET_USER_GROUP_MENUS,
} from '../../../../actions/types';
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
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
        //更新用户组信息
        updateUserGroup: (id, name, menuIds, remark) =>
            dispatch(systemAction.updateUserGroup(id, name, menuIds, remark)),
        //获取用户信息
        getUserInfo: (name, mobile, department, position, companyId, page, limit) =>
            dispatch(
                systemAction.getUserInfo(name, mobile, department, position, companyId, page, limit)
            ),
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
        //删除用户信息
        deleteUserInfo: (selectedIds) => dispatch(systemAction.deleteUserInfo(selectedIds)),
    })
)
class UserActionMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            createDialigVisible: false,
            deleteDialogVisible: false,
            selectedRowKeys: this.props.selectedRowKeys,
            actionMenuType: 1, //1新建 2 编辑 3删除 4 刷新
            selectedRows: this.props.selectedRows,
            actionResult: [],
            allCheckedNodes: '',
            userGroupMenus: [],
        };
    }

    static defaultProps = {
        createDialigVisible: false, //新建dialog是否显示
        selectedRowKeys: [], //选中的keys集合
        selectedRows: [], //选中的数据集合
        actionMenuType: 1, //按钮操作类型
        actionResult: [], //action请求结果
        allCheckedNodes: '', //所有选中的节点数据
        userGroupMenus: [], //用户组菜单
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        switch (nextProps.userCenterState.type) {
            case SYSTEM_USER_ADD_USER_INFO:
            case SYSTEM_USER_UPDATE_USER_INFO:
            case SYSTEM_USER_DELETE_USER_INFO: {
                return {
                    actionResult: nextProps.userCenterState.data
                        ? nextProps.userCenterState.data
                        : prevState.data,
                };
            }
            case SYSTEM_USER_GROUP_GET_USER_GROUP_MENUS: {
                return {
                    userGroupMenus: nextProps.userCenterState.userGroupMenus
                        ? nextProps.userCenterState.userGroupMenus
                        : prevState.userGroupMenus,
                };
            }
            default:
                return null;
        }
    }

    componentDidMount() {
        let { getUserInfo } = this.props;
        getUserInfo('', '', '', '', '', '', '', '', 1, 10);
    }

    handCreateClick = () => {
        this.setState({
            createDialigVisible: true,
            actionMenuType: 1,
        });
    };

    handlerEditClick = () => {
        let {
            intl: { formatMessage },
            selectedRowKeys,
            selectedRows,
        } = this.props;
        if (selectedRowKeys && selectedRowKeys.length == 1) {
            this.setState({
                createDialigVisible: true,
                actionMenuType: 2,
            });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.UserCenterEditSelectTips),
            });
        }
    };

    handlerDeleteClick = () => {
        let {
            selectedRowKeys,
            intl: { formatMessage },
        } = this.props;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            this.setState({ deleteDialogVisible: true });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.SelectedNone),
            });
        }
    };
    /**
     * 刷新操作
     */
    handlerRefreshCLick = (e) => {
        let {
            getUserInfo,
            intl: { formatMessage },
            page,
            pageSize,
            loading,
            cancelLoading,
        } = this.props;
        if (loading) {
            loading();
        }
        if (getUserInfo) {
            this.refreshUserInfo(getUserInfo, formatMessage, page, pageSize, cancelLoading);
        }
    };

    refreshUserInfo = async (getUserInfo, formatMessage, page, pageSize, cancelLoading) => {
        let result = await getUserInfo('', '', '', '', '', '', '', '', page, pageSize);
        if (result.success) {
            toast('success', formatMessage(locale.RefreshSuccess));
        } else {
            toast('success', formatMessage(locale.RefreshFailed));
        }
        if (cancelLoading) {
            cancelLoading();
        }
    };

    /**
     * 删除操作
     */
    _ondelete(actionID) {
        let { deleteUserInfo, selectedRows, loading, cancelLoading } = this.props;
        if (loading) {
            loading();
        }
        if (deleteUserInfo) {
            this._deleteUserInfoAsync(deleteUserInfo, selectedRows, actionID, cancelLoading);
        }
    }

    /**
     * 新建 编辑 操作集合
     * actionMenuType 点击对应的操作按钮类型
     */
    _actionMenuHandler(actionMenuType, userManagerQueryData) {
        let { addUserInfo, updateUserInfo } = this.props;
        switch (actionMenuType) {
            case 1:
                if (addUserInfo) {
                    this._addUserAsync(addUserInfo, userManagerQueryData);
                }
                break;
            case 2:
                if (updateUserInfo) {
                    this._updateUserInfo(updateUserInfo, userManagerQueryData);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 执行查询操作
     */
    handSearchClick = () => {
        let {
            userName,
            userGroup,
            dataGroup,
            getUserInfo,
            realName,
            loading,
            cancelLoading,
            pageSize,
            currentPageChange,
        } = this.props;
        if (loading) {
            loading();
        }
        if (userName || userGroup || dataGroup || realName) {
            let recordGroupNames = '';
            let userGroupNames = '';
            if (dataGroup && dataGroup.length > 0) {
                dataGroup.forEach((item) => {
                    recordGroupNames += item.key;
                });
            }
            if (userGroup && userGroup.length > 0) {
                userGroup.forEach((item) => {
                    userGroupNames += item.key;
                });
            }
            this.queryUserInfo(
                getUserInfo,
                userName,
                userGroupNames,
                recordGroupNames,
                realName,
                pageSize,
                cancelLoading,
                currentPageChange
            );
        }
    };

    queryUserInfo = async (
        getUserInfo,
        userName,
        userGroupNames,
        recordGroupNames,
        realName,
        pageSize,
        cancelLoading,
        currentPageChange
    ) => {
        await getUserInfo(
            userName,
            '',
            '',
            '',
            '',
            userGroupNames,
            recordGroupNames,
            realName,
            1,
            pageSize
        );
        if (cancelLoading) {
            cancelLoading();
        }
        if (currentPageChange) {
            currentPageChange();
        }
    };

    /**
     * 添加成功后查询数据(用户管理)
     */
    async _addUserAsync(addUserInfo, userManagerQueryData) {
        if (userManagerQueryData) {
            const userNumber = userManagerQueryData.userNumber;
            const userName = userManagerQueryData.userName;
            const userPassword = userManagerQueryData.userPassword;
            const userDepart = userManagerQueryData.userDepart;
            const userNickname = userManagerQueryData.userNickname;
            const userPhone = userManagerQueryData.userPhone;
            const userPosition = userManagerQueryData.userPosition;
            const userRemark = userManagerQueryData.userRemark;
            const userGroupSelects = userManagerQueryData.userGroupSelects;
            const userDataGroupSelects = userManagerQueryData.dataGroupSelects;
            const userCheckedCompanyId = userManagerQueryData.userCheckedCompanyId;
            const company = userManagerQueryData.company;
            const userEmail = userManagerQueryData.userEmail;
            let {
                intl: { formatMessage },
            } = this.props;
            let dataIds = '';
            let groupId = '';
            if (userDataGroupSelects) {
                userDataGroupSelects.forEach((item) => {
                    dataIds += `${item},`;
                });
            }
            if (userGroupSelects) {
                userGroupSelects.forEach((item) => {
                    groupId += `${item},`;
                });
            }
            let result = await addUserInfo(
                userNumber,
                userName,
                userPassword,
                userPhone,
                userEmail,
                userCheckedCompanyId,
                company,
                userDepart,
                userPosition,
                userRemark,
                userNickname,
                '',
                groupId,
                dataIds
            );
            if (result.success) {
                toast('success', formatMessage(locale.NewCreateSuccess));
                let { getUserInfo, page, pageSize } = this.props;
                if (getUserInfo) {
                    getUserInfo('', '', '', '', '', '', '', '', page, pageSize);
                }
            }
        }
    }

    /**
     * 编辑完成后更新页面(用户管理)
     */
    async _updateUserInfo(updateUserInfo, userManagerQueryData) {
        if (userManagerQueryData) {
            const userId = userManagerQueryData.id;
            const userNumber = userManagerQueryData.userNumber;
            const userName = userManagerQueryData.userName;
            const userDepart = userManagerQueryData.userDepart;
            const userNickname = userManagerQueryData.userNickname;
            const userPhone = userManagerQueryData.userPhone;
            const userPosition = userManagerQueryData.userPosition;
            const userRemark = userManagerQueryData.userRemark;
            const userGroupSelects = userManagerQueryData.userGroupSelects;
            const userDataGroupSelects = userManagerQueryData.dataGroupSelects;
            const userCheckedCompanyId = userManagerQueryData.userCheckedCompanyId;
            const company = userManagerQueryData.company;
            const userEmail = userManagerQueryData.userEmail;
            let {
                intl: { formatMessage },
            } = this.props;
            let dataIds = '';
            let groupId = '';
            if (Array.isArray(userDataGroupSelects)) {
                userDataGroupSelects.forEach((item) => {
                    dataIds += `${item},`;
                });
            } else {
                dataIds = userDataGroupSelects;
            }
            if (Array.isArray(userGroupSelects)) {
                userGroupSelects.forEach((item) => {
                    groupId += `${item},`;
                });
            } else {
                groupId = userGroupSelects;
            }
            let result = await updateUserInfo(
                userId,
                userNumber,
                userName,
                userPhone,
                userEmail,
                userCheckedCompanyId,
                company,
                userDepart,
                userPosition,
                userRemark,
                userNickname,
                '',
                groupId,
                dataIds
            );
            if (result.success) {
                toast('success', formatMessage(locale.EditSuccess));
                let { getUserInfo, page, pageSize } = this.props;
                if (getUserInfo) {
                    getUserInfo('', '', '', '', '', '', '', '', page, pageSize);
                }
            }
        }
    }

    /**
     * 删除成功后查询数据列表(用户管理)
     */
    async _deleteUserInfoAsync(deleteUserInfo, selectedRows, actionID, cancelLoading) {
        let {
            intl: { formatMessage },
        } = this.props;
        let selectedIds = '';
        if (selectedRows && selectedRows.length > 0) {
            if (selectedRows.length == 1) {
                selectedIds = selectedRows[0].id;
            } else {
                selectedRows.forEach((element) => {
                    selectedIds += `${element.id},`;
                });
            }
            let result = await deleteUserInfo(selectedIds);
            if (result.success) {
                toast('success', formatMessage(locale.DeleteSuccess));
                let { getUserInfo, page, pageSize } = this.props;
                if (getUserInfo) {
                    getUserInfo('', '', '', '', '', '', '', '', page, pageSize);
                }
            }
        } else {
            if (actionID) {
                let result = await deleteUserInfo(actionID);
                if (result.success) {
                    toast('success', formatMessage(locale.DeleteSuccess));
                    let { getUserInfo, page, pageSize } = this.props;
                    if (getUserInfo) {
                        getUserInfo('', '', '', '', '', '', '', '', page, pageSize);
                    }
                }
            }
        }
        if (cancelLoading) {
            cancelLoading();
        }
    }

    render() {
        let {
            intl: { formatMessage },
            selectedRows,
            intl,
        } = this.props;
        let {
            createDialigVisible,
            deleteDialogVisible,
            actionMenuType,
            userGroupMenus,
        } = this.state;
        return (
            <div style={{ paddingRight: 20 }}>
                <Row gutter={12} type='flex' justify='end' align='middle'>
                    <Col onClick={this.handSearchClick}>
                        <Button type='primary'>
                            <Icon type='search' theme='outlined' />
                            {formatMessage(locale.Search)}
                        </Button>
                    </Col>
                    <Col onClick={this.handCreateClick}>
                        <Button type='primary'>
                            <Icon type='plus' theme='outlined' />
                            {formatMessage(locale.New)}
                        </Button>
                    </Col>
                    <Col onClick={this.handlerEditClick}>
                        <Button type='primary'>
                            <Icon type='edit' theme='outlined' />
                            {formatMessage(locale.Edit)}
                        </Button>
                    </Col>
                    <Col onClick={this.handlerDeleteClick}>
                        <Button type='primary'>
                            <Icon type='minus' theme='outlined' />
                            {formatMessage(locale.Delete)}
                        </Button>
                    </Col>
                    <Col onClick={this.handlerRefreshCLick}>
                        <Button type='primary'>
                            <Icon type='reload' theme='outlined' />
                            {formatMessage(locale.Refresh)}
                        </Button>
                    </Col>
                </Row>
                <UserNewCreateDialog
                    intl={intl}
                    visible={createDialigVisible}
                    actionUserMenuHandler={this._actionMenuHandler.bind(this)}
                    onCancel={this.setState({ createDialigVisible: false })}
                    actionMenuType={actionMenuType}
                    selectedRows={selectedRows}
                    userGroupMenus={userGroupMenus}
                />
                <DeleteDialog
                    intl={formatMessage}
                    visible={deleteDialogVisible}
                    onCancel={this.setState({ deleteDialogVisible: false })}
                    onDelete={this._ondelete.bind(this)}
                />
            </div>
        );
    }
}
export default injectIntl(UserActionMenu);
