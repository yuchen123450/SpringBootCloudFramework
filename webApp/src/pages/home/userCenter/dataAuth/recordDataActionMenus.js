import React, { PureComponent } from 'react';
import { Row, Col, Icon, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import { injectIntl } from 'react-intl';
import RecordDataNewCreateDialog from './recordDataNewCreateDialog';
import DeleteDialog from '../../../specifications/confirmDialog';
import { systemAction } from '../../../../actions';
import { toast } from '../../../../components/toast';
import {
    SYSTEM_RECORD_GROUP_UPDATE_RECORD_GROUP,
    SYSTEM_RECORD_GROUP_DELETE_RECORD_GROUP,
    SYSTEM_USER_GROUP_GET_USER_GROUP_MENUS,
} from '../../../../actions/types';
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //获取用户权限列表
        getUserGroup: (page, limit, name) => dispatch(systemAction.getUserGroup(page, limit, name)),
        //新增用户数据权限
        addRecordGroup: (name, remark, strIds, strIdType) =>
            dispatch(systemAction.addRecordGroup(name, remark, strIds, strIdType)),
        //获取用户数据权限列表
        getRecordGroup: (name, page, limit) =>
            dispatch(systemAction.getRecordGroup(name, page, limit)),
        //修改数据权限
        updateRecordGroup: (id, name, remark, strIds, strIdType) =>
            dispatch(systemAction.updateRecordGroup(id, name, remark, strIds, strIdType)),
        //删除数据权限
        deleteRecordGroup: (selectedIds) => dispatch(systemAction.deleteRecordGroup(selectedIds)),
    })
)
class SystemActionMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
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
        type: 1, //操作类型
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
            case SYSTEM_RECORD_GROUP_UPDATE_RECORD_GROUP:
            case SYSTEM_RECORD_GROUP_DELETE_RECORD_GROUP: {
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
        let { getRecordGroup } = this.props;
        getRecordGroup('', 1, 10);
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
            //todo 执行删除操作
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
    handlerRefreshCLick = () => {
        let {
            getRecordGroup,
            intl: { formatMessage },
            page,
            pageSize,
            loading,
            cancelLoading,
        } = this.props;
        if (loading) {
            loading();
        }
        if (getRecordGroup) {
            this.refreshRecordGroup(getRecordGroup, formatMessage, page, pageSize, cancelLoading);
        }
    };

    refreshRecordGroup = async (getRecordGroup, formatMessage, page, pageSize, cancelLoading) => {
        let result = await getRecordGroup('', page, pageSize);
        if (result.success) {
            toast('success', formatMessage(locale.RefreshSuccess));
        }
        if (cancelLoading) {
            cancelLoading();
        }
    };

    /**
     * 删除操作
     */
    _ondelete(actionID) {
        let { deleteRecordGroup, selectedRows, loading, cancelLoading } = this.props;
        if (loading) {
            loading();
        }
        if (deleteRecordGroup) {
            this._deleteDataPermission(deleteRecordGroup, selectedRows, cancelLoading);
        }
    }

    /**
     * 新建 编辑 操作集合
     * actionMenuType 点击对应的操作按钮类型
     */
    _actionMenuHandler(actionMenuType, dataPermissionQuery) {
        let { addRecordGroup, updateRecordGroup } = this.props;
        switch (actionMenuType) {
            case 1:
                if (addRecordGroup) {
                    this._addDataPermissionAsync(addRecordGroup, dataPermissionQuery);
                }
                break;
            case 2:
                if (updateRecordGroup) {
                    this._updateDataInfo(updateRecordGroup, dataPermissionQuery);
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
            dataGroup,
            getRecordGroup,
            loading,
            cancelLoading,
            pageSize,
            currentPageChange,
        } = this.props;
        if (loading) {
            loading();
        }
        if (dataGroup) {
            let recordGroupNames = '';
            if (dataGroup.length > 0) {
                dataGroup.forEach((item) => {
                    recordGroupNames += item.key;
                });
            }
            this.queryRecordGroup(
                getRecordGroup,
                recordGroupNames,
                cancelLoading,
                pageSize,
                currentPageChange
            );
        }
    };

    queryRecordGroup = async (
        getRecordGroup,
        recordGroupNames,
        cancelLoading,
        pageSize,
        currentPageChange
    ) => {
        await getRecordGroup(recordGroupNames, 1, pageSize);
        if (cancelLoading) {
            cancelLoading();
        }
        if (currentPageChange) {
            currentPageChange(1);
        }
    };

    /**
     * 添加成功后查询数据(数据权限)name,remark,strIds,strIdType
     */
    async _addDataPermissionAsync(addRecordGroup, dataPermissionQuery) {
        let { dataSubstationChecks } = dataPermissionQuery;
        let strIds = '';
        if (dataSubstationChecks) {
            dataSubstationChecks.forEach((item) => {
                strIds += `${item.node.key},`;
            });
        }
        let {
            intl: { formatMessage },
            page,
            pageSize,
        } = this.props;
        let result = await addRecordGroup(
            dataPermissionQuery.dataPermissionName,
            dataPermissionQuery.dataRemark,
            strIds,
            dataPermissionQuery.dataType
        );
        if (result.success) {
            toast('success', formatMessage(locale.NewCreateSuccess));
            let { getRecordGroup } = this.props;
            if (getRecordGroup) {
                getRecordGroup('', page, pageSize);
            }
        }
    }
    /**
     * 修改成功后查询数据(数据权限)
     */
    async _updateDataInfo(updateRecordGroup, dataPermissionQuery) {
        let {
            intl: { formatMessage },
            page,
            pageSize,
        } = this.props;
        let strIds = '';
        if (dataPermissionQuery.dataSubstationChecks) {
            dataPermissionQuery.dataSubstationChecks.forEach((item) => {
                strIds += `${item.node.key},`;
            });
        }
        let result = await updateRecordGroup(
            dataPermissionQuery.id,
            dataPermissionQuery.dataPermissionName,
            dataPermissionQuery.dataRemark,
            strIds,
            dataPermissionQuery.dataType
        );
        if (result.success) {
            toast('success', formatMessage(locale.EditSuccess));
            let { getRecordGroup } = this.props;
            if (getRecordGroup) {
                getRecordGroup('', page, pageSize);
            }
        }
    }
    /**
     * 删除成功后查询数据列表(数据管理)
     *
     */
    async _deleteDataPermission(deleteRecordGroup, selectedRows, cancelLoading) {
        let {
            intl: { formatMessage },
            page,
            pageSize,
        } = this.props;
        let selectedIds = '';
        if (selectedRows) {
            if (selectedRows.length == 1) {
                selectedIds = selectedRows[0].id;
            } else {
                selectedRows.forEach((element) => {
                    selectedIds += `${element.id},`;
                });
            }
        }
        let result = await deleteRecordGroup(selectedIds);
        if (result.success) {
            toast('success', formatMessage(locale.DeleteSuccess));
            let { getRecordGroup } = this.props;
            if (getRecordGroup) {
                getRecordGroup('', page, pageSize);
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
                <RecordDataNewCreateDialog
                    intl={intl}
                    visible={createDialigVisible}
                    actionRecordDataMenuHandler={this._actionMenuHandler.bind(this)}
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
export default injectIntl(SystemActionMenu);
