import React, { Component } from 'react';
import { Form, Row, Col, Button as AntdButton, Select, Icon, Spin, Modal } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { systemAction } from '../../../../actions';
import { toast } from '../../../../components/toast';
import StandardTable from '../../../../components/standardTable';
import StandardForm from '../../../../components/standardForm';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import SearchCard from '../../../../containers/searchCard';
import TableAction from '../../../../containers/tableAction';
import { isEmpty } from '../../../../utils/common';
import TableHandler from '../../../../containers/tableHandler';
import DataAuthManagement from './dataAuthManagement';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        commonState: state.commonReducer,
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //获取用户数据权限列表
        getRecordGroup: (name, companyId, recordGroupType, page, limit) =>
            dispatch(systemAction.getRecordGroup(name, companyId, recordGroupType, page, limit)),
        //删除数据权限
        deleteRecordGroup: (selectedIds) => dispatch(systemAction.deleteRecordGroup(selectedIds)),
        //修改数据权限
        updateRecordGroup: (id, name, remark, strIds, strIdType) =>
            dispatch(systemAction.updateRecordGroup(id, name, remark, strIds, strIdType)),
        queryRecordGroup: (name, page, limit) =>
            dispatch(systemAction.queryRecordGroup(name, page, limit)),
        //新增用户数据权限
        addRecordGroup: (name, remark, strIds, strIdType) =>
            dispatch(systemAction.addRecordGroup(name, remark, strIds, strIdType)),
    })
)
@Form.create()
class SystemDataPermission extends Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.state = {
            type: 1,
            selectedRowKeys: [],
            loading: true,
            data: [],
            hasData: false,
            page: 1,
            pageSize: 10,
            dataGroup: {},
            dataInfo: {},
            fetching: false,
            dataGroupValue: [],
            dataGroupData: [],
            dataName: '',
            actionMenuType: 1,
            clearEnterListener: false,
            firstLoading: true,
            recordGroupType: 2,
            localLang: props.intl.locale,
            rowId: '',
        };
        this.editClick = false;
    }

    static defaultProps = {
        type: 1, //类型 数据管理
        selectedRowKeys: [], //用户选中的数据key
        loading: true, //是否加载中
        data: [], //数据权限数据集合
        hasData: false, //是否有数据
        page: 1, //页码
        pageSize: 10, //每页请求数据长度
        dataGroup: {}, //数据组数据(查询)
        dataInfo: {}, //需要编辑的数据信息
    };

    componentDidMount() {
        let { dataName, page, pageSize } = this.state;
        this.loadData(dataName, page, pageSize);
    }

    loadData = async (name, page, pageSize) => {
        let { getRecordGroup } = this.props;
        this.setState({
            loading: true,
        });
        let result = await getRecordGroup(name, '', '', page, pageSize);
        if (
            this.state.firstLoading &&
            result &&
            result.success &&
            result.data.list &&
            result.data.list.length > 0
        ) {
            this.handlerEdit(result.data.list[0], result.data.list[0].recordGroupType, 3);
            this.setState({
                rowId: result.data.list[0].id,
            });
        }
        this.setState({
            loading: false,
            dataName: name,
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

    _onSearch(value) {
        let { dataGroup } = value;
        if (dataGroup) {
            this.setState({
                dataGroup,
            });
        }
    }

    handlerEdit = (object, recordGroupType, actionMenuType = 2) => {
        this.setState(
            {
                dataInfo: object,
                actionMenuType,
                clearEnterListener: true,
                recordGroupType,
                rowId: object.id,
            },
            () => {
                let { name, remark } = object;
                this.editClick = false;
                this.child.handlerSetDefValue(name, recordGroupType, remark);
                recordGroupType === 2
                    ? this.child.getSubstations(true, actionMenuType === 3)
                    : this.child.getCompanies(true, actionMenuType === 3);
            }
        );
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
                    deleteRecordGroup,
                    intl: { formatMessage },
                } = this.props;
                let { selectedRowKeys } = this.state;
                if (deleteRecordGroup) {
                    let result = await deleteRecordGroup(actionID);
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

    updateSelectedRowKeys = (selectedIds) => {
        let { isBatchDelete, selectedRowKeys } = this.state;
        if (isBatchDelete) {
            selectedRowKeys = '';
        } else {
            selectedRowKeys.splice(selectedRowKeys.findIndex((item) => item === selectedIds), 1);
        }
        this.setState({
            selectedRowKeys,
        });
    };

    tableLoading = () => {
        this.setState({
            loading: true,
        });
    };

    cancelLoading = () => {
        this.setState({
            loading: false,
        });
    };

    currentPageChange = (page) => {
        this.setState({
            page,
        });
    };

    fetchDataGroupSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        let { dataGroupValue } = this.state;
        this.setState({ userGroupData: [], fetching: true });
        let { queryRecordGroup } = this.props;
        if (queryRecordGroup && isEmpty(dataGroupValue)) {
            this.getDataGroupByName(queryRecordGroup, value, fetchId);
        }
    };

    handleDataGroupChange = (value) => {
        this.setState(
            {
                dataGroupValue: value,
                dataGroupData: [],
                fetching: false,
            },
            () => {
                let { onSearch } = this.props;
                if (onSearch) {
                    onSearch({ dataGroup: value });
                }
            }
        );
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

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            let { dataGroup } = values; //dataGroup.key   userGroup.key
            let dataGroupElement = '';
            if (dataGroup && dataGroup.length > 0) {
                dataGroup.forEach((element) => {
                    dataGroupElement += `${element.key},`;
                });
            }
            dataGroupElement = dataGroupElement.includes(',')
                ? dataGroupElement.substring(0, dataGroupElement.lastIndexOf(','))
                : '';
            let { page, pageSize } = this.state;
            this.loadData(dataGroupElement, page, pageSize);
        });
    };

    handlerCreate = () => {
        let { recordGroupType, actionMenuType } = this.state;
        if (this.child) {
            this.child.setLoading();
            this.child.handlerResetAllFields();
        }
        this.setState(
            {
                actionMenuType: 1,
                clearEnterListener: true,
                rowId: '',
            },
            () => {
                this.child.handlerSetDefValue('', recordGroupType, '');
                recordGroupType === 2
                    ? this.child.getSubstations(false, actionMenuType === 3)
                    : this.child.getCompanies(false, actionMenuType === 3);
            }
        );
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
                        deleteRecordGroup,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteRecordGroup) {
                        let result = await deleteRecordGroup(selectedRowKeys.join(','));
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

    onCancelOperate = () => {
        this.setState({ deleteVisible: false });
    };

    handlerReset = () => {
        this.setState(
            {
                dataName: '',
                selectedRowKeys: [],
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
        let { dataName, page, pageSize } = this.state;
        this.loadData(dataName, page, pageSize);
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    onRef = (ref) => {
        this.child = ref;
    };

    recordGroupTypeChange = (recordGroupType) => {
        this.setState({
            recordGroupType,
        });
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
                    let { actionMenuType, recordGroupType } = this.state;
                    actionMenuType === 1
                        ? recordGroupType === 2
                            ? this.child.getSubstations(false, actionMenuType === 3)
                            : this.child.getCompanies(false, actionMenuType === 3)
                        : recordGroupType === 2
                        ? this.child.getSubstations(true, actionMenuType === 3)
                        : this.child.getCompanies(true, actionMenuType === 3);
                }
            );
            return true;
        }
        return true;
    }

    clickRow = (dataGroup) => {
        if (!this.editClick) {
            this.child.setLoading();
            this.handlerEdit(dataGroup, dataGroup.recordGroupType, 3);
            this.setState({
                rowId: dataGroup.id,
            });
        }
    };

    render() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;
        let {
            selectedRowKeys,
            loading,
            page,
            dataInfo,
            dataGroupValue,
            dataGroupData,
            dataName,
            actionMenuType,
            clearEnterListener,
            rowId,
        } = this.state;
        const {
            userCenterState: { dataRecordSource },
        } = this.props;
        const columns = [
            {
                title: formatMessage(locale.Name),
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
                title: formatMessage(locale.SystemLogOperateModule),
                dataIndex: 'recordGroupType',
                key: 'recordGroupType',
                width: 150,
                render: (type) => {
                    if (!isEmpty(type)) {
                        switch (type) {
                            case 2:
                                return formatMessage(locale.Substation);
                            case 3:
                                return formatMessage(locale.Company);
                            default:
                                break;
                        }
                    }
                },
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
                        batchActions={[
                            { title: 'Edit', auth: 'NewOrEditDataVisibilityRange' },
                            { title: 'Delete', auth: 'DeleteDataVisibilityRange' },
                        ]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.editClick = true;
                                this.handlerEdit(object, object.recordGroupType);
                            }
                            if (menu === 'Delete') {
                                this.editClick = true;
                                this._handlerDeleteClick(actionID);
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
                                <Form.Item label={formatMessage(locale.Name)}>
                                    {getFieldDecorator('dataGroup')(
                                        <Select
                                            mode='multiple'
                                            labelInValue
                                            value={dataGroupValue}
                                            placeholder={formatMessage(
                                                locale.UserCenterDataGroupTips
                                            )}
                                            notFoundContent={null}
                                            filterOption={false}
                                            onSearch={this.fetchDataGroupSearch}
                                            onChange={this.handleDataGroupChange}
                                            style={{ width: '100%' }}>
                                            {dataGroupData.map((d) => (
                                                <Select.Option key={d.value}>
                                                    {d.text}
                                                </Select.Option>
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
                                    batchActions={[
                                        { title: 'Delete', auth: 'DeleteDataVisibilityRange' },
                                    ]}
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
                                                auth='NewOrEditDataVisibilityRange'
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
                            dataSource={dataRecordSource === null ? [] : dataRecordSource.list}
                            onChange={(pagination) => {
                                this.loadData(dataName, pagination.current, pagination.pageSize);
                            }}
                            current={page}
                            total={dataRecordSource.totalRecords}
                            totalTip={formatMessage(locale.TableCount, {
                                count: dataRecordSource.totalRecords,
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
                        <DataAuthManagement
                            actionMenuType={actionMenuType}
                            handlerRefreshClick={this.handlerRefreshClick}
                            dataInfo={dataInfo}
                            handlerEdit={this.handlerEdit}
                            recordGroupTypeChange={this.recordGroupTypeChange}
                            onRef={this.onRef}
                        />
                    </Col>
                </Row>
            </Scrollbar>
        );
    }
}
export default injectIntl(SystemDataPermission);
