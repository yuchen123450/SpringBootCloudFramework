import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Form, Spin, Row, Col, Button as AntdButton, Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import StandardTable from '../../../../components/standardTable';
import { systemAction } from '../../../../actions';
import { toast } from '../../../../components/toast';
import SearchCard from '../../../../containers/searchCard';
import StandardForm from '../../../../components/standardForm';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import TableAction from '../../../../containers/tableAction';
import { isEmpty, debounce, deepClone } from '../../../../utils/common';
import TableHandler from '../../../../containers/tableHandler';
import RoleAuthManagement from './roleAuthManagement';
import { authComponent } from '../../../../components/authComponent';
import Enum from '../../../../utils/enum';

const Button = authComponent(AntdButton);
const Option = Select.Option;

@connect(
    (state) => ({
        commonState: state.commonReducer,
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //获取用户组权限列表
        getUserGroup: (page, limit, name) => dispatch(systemAction.getUserGroup(page, limit, name)),
        //删除用户组
        deleteUserGroup: (selectedIds) => dispatch(systemAction.deleteUserGroup(selectedIds)),
        //更新用户组信息
        updateUserGroup: (id, name, menuIds, remark) =>
            dispatch(systemAction.updateUserGroup(id, name, menuIds, remark)),
        //获取用户组下的菜单
        getUserGroupMenus: (id) => dispatch(systemAction.getUserGroupMenus(id)),
        //获取用户组
        searchUserGroup: (page, limit, name) =>
            dispatch(systemAction.searchUserGroup(page, limit, name)),
        //新增用户组
        addUserGroup: (name, menuIds, remark) =>
            dispatch(systemAction.addUserGroup(name, menuIds, remark)),
        getSysMenu: (id) => dispatch(systemAction.getSysMenu(id)), //parentMenu, node
    })
)
@Form.create()
class SystemUserGroupManager extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUserGroupSearch = debounce(this.fetchUserGroupSearch, 500);
        this.state = {
            type: 2,
            selectedRowKeys: [],
            selectedRows: [],
            loading: true,
            data: [],
            hasData: false,
            page: 1,
            pageSize: 10,
            userGroup: {},
            userGroupInfo: {},
            createDialigVisible: false,
            userGroupMenus: [],

            userGroupData: [],
            userGroupValue: [],
            fetching: false,
            userGroupNames: '',
            actionMenuType: 1,
            clearEnterListener: false,
            systemMenuOrigin: [],
            editMenuOrigin: [],
            localLang: props.intl.locale,
            systemMenuDefNotChecked: [],
            firstLoading: true,
            rowId: '',
        };
        this.editClick = false;
    }

    static defaultProps = {
        type: 2, //类型 用户组管理
        selectedRowKeys: [], //用户选中的数据key
        loading: true, //是否加载中
        data: [], //用户组数据集合
        hasData: false, //是否有数据
        page: 1, //页码
        pageSize: 10, //每页请求数据长度
        userGroup: {}, //用户组信息(查询)
        userGroupInfo: {}, //用户组item(编辑操作);
        createDialigVisible: false, //是否显示创建dialog
        userGroupMenus: [], //请求的用户菜单选择
    };

    async componentDidMount() {
        let { page, pageSize, userGroupNames } = this.state;
        this.loadData(userGroupNames, page, pageSize);
        this.initData();
    }

    initData = async () => {
        let { getSysMenu } = this.props;
        await getSysMenu(-1);
        await this.handlerCreate();
        this.getOriginNotCheckedMenus();
    };

    getOriginNotCheckedMenus = () => {
        let { systemMenuOrigin } = this.state;
        if (Array.isArray(systemMenuOrigin)) {
            let systemMenuDefNotChecked = deepClone(systemMenuOrigin);
            systemMenuDefNotChecked.map((item) => {
                item.checked = false;
                item.indeterminate = false;
                if (item.children && Array.isArray(item.children)) {
                    item.children.map((ele) => {
                        ele.checked = false;
                        ele.indeterminate = false;
                        if (ele.children && Array.isArray(ele.children)) {
                            ele.children.map((operate) => {
                                operate.checked = false;
                                operate.indeterminate = false;
                            });
                        }
                    });
                }
            });
            this.setState({ systemMenuDefNotChecked });
        }
    };

    loadData = async (userGroupNames, page, pageSize) => {
        let { getUserGroup } = this.props;
        this.setState({
            loading: true,
        });
        let result = await getUserGroup(page, pageSize, userGroupNames);
        if (
            this.state.firstLoading &&
            result &&
            result.success &&
            result.data.list &&
            result.data.list.length > 0
        ) {
            this.handlerEdit(result.data.list[0], 3);
            this.setState({ rowId: result.data.list[0].id });
        }
        this.setState({
            loading: false,
            userGroupNames,
            page,
            pageSize,
            firstLoading: false,
        });
    };

    _selectCallBack(callBackKeys, selectedRows) {
        this.setState({
            selectedRowKeys: callBackKeys,
            selectedRows,
        });
    }

    _onSearch(value) {
        let { userGroup } = value;
        if (userGroup) {
            this.setState({
                userGroup,
            });
        }
    }

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
                    this.handlerCreate();
                }
            );
            return true;
        }
        return true;
    }

    handlerEditData = (object, actionMenuType) => {
        let { menuList, isDefault } = object;
        let { systemMenuDefNotChecked } = this.state;
        let result = deepClone(systemMenuDefNotChecked);
        if (result && Array.isArray(result)) {
            result.map((item) => {
                let findFirstMenu = menuList.find((ele) => item.id === ele.id);
                let groupIndex = 0;
                if (undefined !== findFirstMenu) {
                    if (Array.isArray(item.children)) {
                        item.children.map((ele) => {
                            if (Array.isArray(findFirstMenu.children)) {
                                let findTwoLevelMenu = findFirstMenu.children.find(
                                    (twoLevelMenu) => twoLevelMenu.id === ele.id
                                );
                                let operateIndex = 0;
                                if (undefined !== findTwoLevelMenu) {
                                    if (Array.isArray(ele.children)) {
                                        ele.children.map((oprate) => {
                                            let operate = findTwoLevelMenu.operationList.find(
                                                (operateMenu) => operateMenu.id === oprate.id
                                            );
                                            if (undefined !== operate) {
                                                oprate.checked = true;
                                                operateIndex++;
                                            }
                                        });
                                    }
                                    if (operateIndex > 0) {
                                        ele.indeterminate = true;
                                        if (operateIndex === ele.children.length) {
                                            ele.checked = true;
                                            ele.indeterminate = false;
                                            groupIndex++;
                                        }
                                    } else {
                                        if (undefined !== findTwoLevelMenu) {
                                            if (
                                                findTwoLevelMenu.operationList.length === 0 &&
                                                ele.children.length === 0
                                            ) {
                                                ele.checked = findTwoLevelMenu.visible;
                                                ele.indeterminate = false;
                                                groupIndex++;
                                            } else {
                                                ele.indeterminate = findTwoLevelMenu.visible;
                                                ele.checked = false;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                    if (groupIndex > 0) {
                        item.indeterminate = true;
                        if (groupIndex === item.children.length) {
                            item.checked = true;
                            item.indeterminate = false;
                        }
                    } else {
                        if (findFirstMenu.children.length > 0) {
                            item.indeterminate = true;
                        } else {
                            item.checked = true;
                            item.indeterminate = false;
                        }
                    }
                }
            });
        }
        if ((isDefault && isDefault === 1) || actionMenuType === 3) {
            result.map((item) => {
                item.disabled = true;
                if (item && item.children && Array.isArray(item.children)) {
                    item.children.map((element) => {
                        element.disabled = true;
                        if (element && element.children && Array.isArray(element.children)) {
                            element.children.map((operate) => {
                                operate.disabled = true;
                            });
                        }
                    });
                }
            });
        }
        return result;
    };

    handlerEdit = (userGroupInfo, actionMenuType = 2) => {
        let editMenuOrigin = this.handlerEditData(
            isEmpty(userGroupInfo) ? this.state.userGroupInfo : userGroupInfo,
            actionMenuType
        );
        if (isEmpty(userGroupInfo)) {
            this.setState(
                {
                    editMenuOrigin,
                    actionMenuType,
                    clearEnterListener: true,
                    rowId: userGroupInfo.id,
                },
                () => {
                    this.editClick = false;
                    this.child.handlerSetDefValue(userGroupInfo);
                }
            );
        } else {
            this.setState(
                {
                    editMenuOrigin,
                    userGroupInfo,
                    actionMenuType,
                    clearEnterListener: true,
                    rowId: userGroupInfo.id,
                },
                () => {
                    this.editClick = false;
                    this.child.handlerSetDefValue(userGroupInfo);
                }
            );
        }
    };

    _handlerDeleteClick = (actionID, object) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (object && object.isDefault && object.isDefault === 1) {
            toast('warn', formatMessage(locale.RoleCannotDel));
            return;
        }
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    deleteUserGroup,
                    intl: { formatMessage },
                } = this.props;

                if (deleteUserGroup) {
                    let result = await deleteUserGroup(actionID);
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
                    this.editClick = false;
                }
            },
            onCancel: () => {
                this.editClick = false;
            },
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            let { userGroup } = values; //dataGroup.key   userGroup.key
            let userGroupElement = '';
            if (userGroup && userGroup.length > 0) {
                userGroup.forEach((element) => {
                    userGroupElement += `${element.key},`;
                });
            }
            userGroupElement = userGroupElement.includes(',')
                ? userGroupElement.substring(0, userGroupElement.lastIndexOf(','))
                : '';
            let { page, pageSize } = this.state;
            this.loadData(userGroupElement, page, pageSize);
        });
    };

    fetchUserGroupSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ userGroupData: [], fetching: true });
        let { searchUserGroup } = this.props;
        if (searchUserGroup && isEmpty(this.state.userGroupValue)) {
            this.getUserGroupByName(searchUserGroup, value, fetchId);
            // getUserGroup(1, 500, value);
        }
    };

    async getUserGroupByName(searchUserGroup, value, fetchId) {
        let result = await searchUserGroup(1, 500, value);
        if (result && result.success) {
            if (fetchId !== this.lastFetchId) {
                // for fetch callback order
                return;
            }
            const userGroupData = result.data.list.map((userGroup) => ({
                text: `${userGroup.name}`,
                value: userGroup.name,
            }));
            this.setState({ userGroupData, fetching: false });
        }
    }

    handleUserGroupChange = (value) => {
        this.setState({
            userGroupValue: value,
            userGroupData: [],
            fetching: false,
        });
        let { onSearch } = this.props;
        if (onSearch) {
            onSearch({ userGroup: value });
        }
    };

    handlerDelete = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys, selectedRows } = this.state;
        if (selectedRows && Array.isArray(selectedRows)) {
            if (selectedRows.some((item) => item.isDefault && item.isDefault === 1)) {
                toast('warn', formatMessage(locale.ExistCannotDelRole));
                return;
            }
        }
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteUserGroup,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteUserGroup) {
                        let result = await deleteUserGroup(selectedRowKeys.join(','));
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
        let {
            userCenterState: { systemMenus },
        } = this.props;
        let systemMenuOrigin = [];
        this.getSystemMenus(systemMenuOrigin, systemMenus);
        if (this.child) {
            this.child.setLoading();
            this.child.handlerResetAllFields();
        }
        if (!isEmpty(systemMenuOrigin)) {
            this.setState({ systemMenuOrigin, actionMenuType: 1, rowId: '' });
        }
    };

    getSystemMenus = (systemMenuShow, systemMenus) => {
        if (Array.isArray(systemMenus)) {
            systemMenus.forEach((item) => {
                let childrenItems = [];
                let groupIndex = 0;
                let firstLevelIndeterminate = false;
                if (item.children) {
                    item.children.forEach((group) => {
                        if (group && group.operationList && Array.isArray(group.operationList)) {
                            let operationItems = [];
                            let operateIndex = 0;
                            let noOperateMenu = true;
                            group.operationList.forEach((ele) => {
                                noOperateMenu = false;
                                operationItems.push({
                                    id: ele.id,
                                    title: this.getMenuName(ele.name),
                                    value: ele.id,
                                    key: ele.name,
                                    checked: ele.visible,
                                    disabled: false,
                                    indeterminate: false,
                                });
                                if (ele.visible) {
                                    operateIndex++;
                                }
                            });
                            childrenItems.push({
                                id: group.id,
                                title: this.getMenuName(group.name),
                                value: group.id,
                                key: group.name,
                                children: operationItems,
                                disabled: false,
                                checked: noOperateMenu
                                    ? group.visible
                                    : operateIndex === 0
                                    ? group.visible
                                    : operateIndex === group.operationList.length,
                                indeterminate: noOperateMenu
                                    ? !group.visible
                                    : operateIndex === 0
                                    ? group.visible
                                    : operateIndex === group.operationList.length
                                    ? false
                                    : group.visible,
                            });
                            if (operateIndex === group.operationList.length) {
                                groupIndex++;
                            }
                            if (group.visible) {
                                firstLevelIndeterminate = true;
                            }
                        }
                    });
                }
                systemMenuShow.push({
                    id: item.id,
                    title: this.getMenuName(item.name),
                    value: item.id,
                    key: item.name,
                    children: childrenItems,
                    disabled: false, //item.name === 'MenuUserCenter' ? true : false,
                    checked: groupIndex === item.children.length,
                    indeterminate:
                        groupIndex === item.children.length
                            ? false
                            : firstLevelIndeterminate
                            ? true
                            : groupIndex > 0
                            ? true
                            : false,
                });
            });
        }
    };

    handlerReset = () => {
        this.cleanSelectedKeys();
        this.setState(
            {
                userGroupNames: '',
            },
            () => {
                this.handlerRefreshClick();
            }
        );
        this.props.form.resetFields();
    };

    /**
     * 刷新操作
     */
    handlerRefreshClick = () => {
        let { userGroupNames, page, pageSize } = this.state;
        this.loadData(userGroupNames, page, pageSize);
    };

    getMenuName = (key, item) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let querylocal = locale[key];
        if (undefined !== querylocal) {
            return formatMessage(locale[key]);
        } else {
            return '';
        }
    };

    onCancel = () => {
        this.setState({ createDialigVisible: false, clearEnterListener: false });
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    onRef = (ref) => {
        this.child = ref;
    };

    clickRow = (userGroup) => {
        if (!this.editClick) {
            this.child.setLoading();
            this.handlerEdit(userGroup, 3);
            this.setState({
                rowId: userGroup.id,
            });
        }
    };

    render() {
        let {
            intl: { formatMessage },
            userCenterState: { userGroupDataSource },
            form: { getFieldDecorator },
        } = this.props;
        let {
            selectedRowKeys,
            loading,
            page,
            userGroupInfo,
            fetching,
            userGroupData,
            userGroupNames,
            actionMenuType,
            clearEnterListener,
            systemMenuOrigin,
            editMenuOrigin,
            rowId,
        } = this.state;
        const columns = [
            {
                title: formatMessage(locale.UserCenterUserGroupName),
                dataIndex: 'name',
                key: 'name',
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
                width: 150,
                align: 'center',
                fixed: 'right',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[
                            {
                                title: 'Edit',
                                auth: 'NewOrEditRole',
                                disabled: object.isDefault === 1,
                            },
                            {
                                title: 'Delete',
                                auth: 'DeleteRole',
                                disabled: object.isDefault === 1,
                            },
                        ]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.editClick = true;
                                this.handlerEdit(object, 2);
                            }
                            if (menu === 'Delete') {
                                this.editClick = true;
                                this._handlerDeleteClick(actionID, object);
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
                            <StandardForm>
                                <Form.Item label={formatMessage(locale.UserCenterUserGroupName)}>
                                    {getFieldDecorator('userGroup')(
                                        <Select
                                            mode='multiple'
                                            labelInValue
                                            placeholder={formatMessage(
                                                locale.UserCenterUserGroupTips
                                            )}
                                            notFoundContent={null}
                                            filterOption={false}
                                            onSearch={this.fetchUserGroupSearch}
                                            onChange={this.handleUserGroupChange}>
                                            {userGroupData.map((d) => (
                                                <Option key={d.value}>{d.text}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </StandardForm>
                        </SearchCard>
                        <StandardTable
                            loading={loading}
                            columns={columns}
                            title={() => (
                                <TableAction
                                    batchActions={[{ title: 'Delete', auth: 'DeleteRole' }]}
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
                                                auth='NewOrEditRole'
                                                type='primary'
                                                onClick={this.handlerCreate}
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
                            dataSource={
                                userGroupDataSource === null ? [] : userGroupDataSource.list
                            }
                            onChange={(pagination) => {
                                this.loadData(
                                    userGroupNames,
                                    pagination.current,
                                    pagination.pageSize
                                );
                            }}
                            current={page}
                            total={userGroupDataSource.totalRecords}
                            totalTip={formatMessage(locale.TableCount, {
                                count: userGroupDataSource.totalRecords,
                            })}
                            selectedRowKeys={selectedRowKeys}
                            selectCallBack={this._selectCallBack.bind(this)}
                            onRow={(record) => ({
                                onClick: (e) => this.clickRow(record, e),
                            })}
                            rowId={rowId}
                        />
                    </Col>
                    <Col span={14} style={{ position: 'absolute', top: 0, bottom: 0, right: 0 }}>
                        <RoleAuthManagement
                            handlerCreate={this.handlerCreate}
                            handlerEdit={this.handlerEdit}
                            actionMenuType={actionMenuType}
                            data={actionMenuType === 1 ? systemMenuOrigin : editMenuOrigin}
                            userGroupInfo={userGroupInfo}
                            handlerRefreshClick={this.handlerRefreshClick}
                            onRef={this.onRef}
                        />
                    </Col>
                </Row>
            </Scrollbar>
        );
    }
}
export default injectIntl(SystemUserGroupManager);
