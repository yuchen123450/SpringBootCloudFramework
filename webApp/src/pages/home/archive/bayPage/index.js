import React, { PureComponent } from 'react';
import { Select, Form, Input, Modal, Row, Col, Button as AntdButton, Icon } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import SplitterLayout from '../../../../containers/splitterLayout';
import StandardTable from '../../../../components/standardTable';
import StandardForm from '../../../../components/standardForm';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import {
    getVisualDevTypeKey,
    getVisualBayKey,
} from '../../../../containers/archiveTree/archiveCacheUtil';
import TableAction from '../../../../containers/tableAction';
import SiderDrawer from '../../../../containers/siderDrawer';
import SearchCard from '../../../../containers/searchCard';
import AddOrUpdateBay from './addOrUpdateBay';
import { archiveAction } from '../../../../actions';
import { toast } from '../../../../components/toast';
import moment from 'moment';
import Enum from '../../../../utils/enum';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);

@connect(
    (state) => ({
        commonState: state.commonReducer,
        bayInfoState: state.bayReducer,
    }),
    (dispatch) => ({
        getBayInfo: (
            substationIds,
            bayId,
            companyId,
            substationName,
            voltageLevel,
            bayNames,
            bayType,
            deviceType,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getBayInfo(
                    substationIds,
                    bayId,
                    companyId,
                    substationName,
                    voltageLevel,
                    bayNames,
                    bayType,
                    deviceType,
                    page,
                    limit
                )
            ),
        addEditBayInfo: (bayInfo) => dispatch(archiveAction.addEditBayInfo(bayInfo)),
        deleteBayInfo: (selecedIds, selectedParentIds, selectedKeys, selectedItems) =>
            dispatch(
                archiveAction.deleteBayInfo(
                    selecedIds,
                    selectedParentIds,
                    selectedKeys,
                    selectedItems
                )
            ),
        queryCommonType: (typeKindCode, typeKindName, typeCode, typeName) =>
            dispatch(archiveAction.queryCommonType(typeKindCode, typeKindName, typeCode, typeName)),
    })
)
@Form.create()
class BayManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
            selectedItems: [],
            cleanSelectedKeys: false,
            actionMenuType: 1,
            loading: true,
            page: 1,
            limit: 10,
            substationId: '',
            bayId: '',
            addVisible: false,
            substationName: '',
            voltageLevel: '',
            bayType: '',
            bayNames: '',
            companyId: '',
            selectCompanyId: '-1',
            selectValue: '',
            selectKey: '',
            actionID: '',
            companyInfo: {},
            deviceType: 32,
            clearEnterListener: false,
        };
    }

    static defaultProps = {
        actionMenuType: 1,
        clearEnterListener: false,
    };

    componentDidMount() {
        let { queryCommonType } = this.props;
        queryCommonType(2);
        queryCommonType(22);
    }

    loadData = async (
        substationId,
        bayId,
        companyId,
        substationName,
        voltageLevel,
        bayType,
        bayNames,
        dataSource,
        deviceType,
        page,
        limit
    ) => {
        let { getBayInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getBayInfo(
            substationId,
            bayId,
            companyId,
            substationName,
            voltageLevel,
            bayNames,
            bayType,
            deviceType,
            page,
            limit
        );
        this.setState({
            loading: false,
            page: page,
            limit: limit,
            substationId,
            companyId,
            substationName,
            voltageLevel,
            bayType,
            deviceType,
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        let { substationId, bayId, companyId, limit, deviceType } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                let { substationName, voltageLevel, bayType, bayName } = values;
                this.loadData(
                    substationId,
                    bayId,
                    companyId,
                    substationName,
                    voltageLevel,
                    bayType,
                    bayName,
                    null,
                    deviceType,
                    1,
                    limit
                );
            }
        });
    };

    handlerCreate = () => {
        this.setState({
            addVisible: true,
            actionMenuType: 1,
            clearEnterListener: true,
        });
    };

    handlerEdit = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length == 1) {
            this.setState({
                addVisible: true,
                actionMenuType: 2,
                clearEnterListener: true,
            });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.UserCenterEditSelectTips),
            });
        }
    };

    handlerDelete = () => {
        let {
            intl: { formatMessage },
            deleteBayInfo,
        } = this.props;
        let { selectedRowKeys, selectedParentIds, selectedUniqueKeys, selectedItems } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),

                onOk: async () => {
                    if (deleteBayInfo) {
                        let result = await deleteBayInfo(
                            selectedRowKeys.join(','),
                            selectedParentIds,
                            selectedUniqueKeys,
                            selectedItems
                        );
                        if (result.success) {
                            toast('success', formatMessage(locale.DeleteSuccess));
                            this.handlerRefresh();
                            selectedRowKeys = '';
                            selectedParentIds = [];
                            selectedUniqueKeys = [];
                            selectedItems = [];
                            this.setState({
                                selectedRowKeys,
                                selectedParentIds,
                                selectedUniqueKeys,
                                selectedItems,
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

    handlerReset = () => {
        this.setState(
            {
                substationName: '',
                voltageLevel: '',
                bayType: '',
                bayNames: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    handlerRefresh = () => {
        let {
            substationId,
            bayId,
            page,
            limit,
            companyId,
            substationName,
            voltageLevel,
            bayType,
            bayNames,
            deviceType,
        } = this.state;
        this.loadData(
            substationId,
            bayId,
            companyId,
            substationName,
            voltageLevel,
            bayType,
            bayNames,
            null,
            deviceType,
            page,
            limit
        );
    };

    onSelectCallBack = (selectedRowKeys, selectedItems) => {
        let selectedParentIds = [];
        let selectedUniqueKeys = [];
        selectedItems.map((item) => {
            selectedParentIds.push(getVisualDevTypeKey(item));
            selectedUniqueKeys.push(getVisualBayKey(item));
        });
        this.setState({
            selectedRowKeys,
            selectedParentIds,
            selectedUniqueKeys,
            selectedItems,
        });
    };

    onCompanySelect = (value, node) => {
        this.setState({
            selectCompanyId: value,
            companyId: value,
            substationId: '',
        });
    };

    onCompanyDefValueSet = (selectCompanyId) => {
        if (selectCompanyId == -1) {
            this.setState({
                selectCompanyId,
                companyId: selectCompanyId,
            });
        }
    };

    showFirstTreeValue = (key, title, isLeaf, value, parentKey) => {
        let { selectCompanyId } = this.state;
        if (selectCompanyId == -1) {
            this.setState({
                selectCompanyId: key,
                selectValue: title,
                selectKey: key,
            });
        }
    };

    handlerEditClickOnTable = (actionID, object) => {
        this.setState({
            addVisible: true,
            actionID,
            bayInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    handlerDeleteClickOnTable = (actionID, object) => {
        let {
            intl: { formatMessage },
            deleteBayInfo,
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    selectedRowKeys,
                    selectedParentIds,
                    selectedUniqueKeys,
                    selectedItems,
                } = this.state;
                if (deleteBayInfo) {
                    let result = await deleteBayInfo(
                        actionID,
                        [getVisualDevTypeKey(object)],
                        [getVisualBayKey(object)],
                        [object]
                    );
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.handlerRefresh();
                        if (selectedRowKeys && selectedRowKeys.length > 0) {
                            selectedRowKeys.splice(
                                selectedRowKeys.findIndex((item) => item === actionID),
                                1
                            );
                            selectedParentIds.splice(
                                selectedParentIds.findIndex(
                                    (item) => item === getVisualDevTypeKey(object)
                                ),
                                1
                            );
                            selectedUniqueKeys.splice(
                                selectedUniqueKeys.findIndex(
                                    (item) => item === getVisualBayKey(object)
                                ),
                                1
                            );
                            selectedItems.splice(
                                selectedItems.findIndex((item) => item.bayId === object.bayId),
                                1
                            );
                            this.setState({
                                selectedRowKeys,
                                selectedParentIds,
                                selectedUniqueKeys,
                                selectedItems,
                            });
                        }
                    }
                }
            },
        });
    };

    getArchiveInfo = (type, dataRef) => {
        let _this = this;
        if (dataRef.type != ARCHIVE_NODE_TYPE.SUBSTATION) {
            let key = dataRef.key;
            let parseContent = key.includes('丨')
                ? key.substring(key.lastIndexOf('丨') + 1, key.length)
                : '';
            switch (dataRef.type) {
                case ARCHIVE_NODE_TYPE.VOLTAGE:
                    _this.state.voltageLevel = parseContent;
                    break;
                case ARCHIVE_NODE_TYPE.DEVICTTYPE:
                    _this.state.deviceType = parseContent;
                    break;
                case ARCHIVE_NODE_TYPE.DEVICE:
                    _this.state.deviceId = parseContent;
                    break;
                case ARCHIVE_NODE_TYPE.BAY:
                    _this.state.bayId = parseContent;
                    break;
                default:
                    break;
            }
            this.getArchiveInfo(type, dataRef.parentRef);
        } else {
            _this.state.substationId = dataRef.key;
        }
        switch (type) {
            case ARCHIVE_NODE_TYPE.SUBSTATION:
                _this.state.voltageLevel = '';
                _this.state.deviceType = '';
                _this.state.bayId = '';
                break;
            case ARCHIVE_NODE_TYPE.VOLTAGE:
                _this.state.bayId = '';
                _this.state.deviceType = '';
                break;
            case ARCHIVE_NODE_TYPE.DEVICTTYPE:
                _this.state.deviceId = '';
                _this.state.bayId = '';
                break;
            case ARCHIVE_NODE_TYPE.DEVICE:
                _this.state.bayId = '';
                break;
            case ARCHIVE_NODE_TYPE.BAY:
                _this.state.deviceId = '';
                break;
            default:
                break;
        }
        return this.state;
    };

    onCancel = () => {
        this.setState({ addVisible: false, clearEnterListener: false });
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
            selectedItems: [],
        });
    };

    render() {
        let {
            selectCompanyId,
            selectedRowKeys,
            actionMenuType,
            loading,
            page,
            limit,
            bayId,
            substationId,
            addVisible,
            companyId,
            substationName,
            voltageLevel,
            bayType,
            bayNames,
            bayInfo,
            deviceType,
            clearEnterListener,
        } = this.state;
        const {
            intl: { formatMessage, formats },
            bayInfoState: { dataSource, commonTypeVoltageLevel, commonBayType },
            isMobile,
            form: { getFieldDecorator },
        } = this.props;
        const columns = [
            {
                title: formatMessage(locale.BayName),
                dataIndex: 'bayName',
                key: 'bayName',
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
                title: formatMessage(locale.BayType),
                dataIndex: 'bayTypeName',
                key: 'bayTypeName',
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
                title: formatMessage(locale.DeviceType),
                dataIndex: 'deviceTypeName',
                key: 'deviceTypeName',
                width: 150,
                render: (value, object) => {
                    let content =
                        isEmpty(object.deviceType) && Number.isInteger(object.deviceType)
                            ? value
                            : Enum.getDeviceTypeEnum(parseInt(object.deviceType));
                    return isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    );
                },
            },
            {
                title: formatMessage(locale.VoltageClass),
                dataIndex: 'voltageLevelName',
                key: 'voltageLevelName',
                width: 150,
            },
            {
                title: formatMessage(locale.SubstationName),
                dataIndex: 'substationName',
                key: 'substationName',
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
                title: formatMessage(locale.CreateTime),
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
                render: (createTime) =>
                    isEmpty(createTime) ? '' : moment(createTime).format(formats.dateTime),
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
                width: 150,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[{ title: 'Edit', auth: 'NewOrEditBayName' }]}
                        batchActionsMore={[{ title: 'Delete', auth: 'DeleteBayName' }]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerEditClickOnTable(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDeleteClickOnTable(actionID, object);
                            }
                        }}
                    />
                ),
            },
        ];
        let children = [],
            bayTypeList = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Select.Option key={element.value}>{element.name}</Select.Option>);
            });
        }
        if (commonBayType && commonBayType.length > 0) {
            commonBayType.forEach((element) => {
                bayTypeList.push(
                    <Select.Option key={element.typeCode}>
                        {Enum.getBayTypeName(element.typeCode)}
                    </Select.Option>
                );
            });
        }
        return (
            <SplitterLayout
                percentage={true}
                secondaryInitialSize={isMobile ? 100 : 80}
                secondaryMinSize={isMobile ? 100 : 60}>
                <SiderDrawer
                    className='page-layout-sider-drawer'
                    title={formatMessage(locale.ArchiveManagerArchiveTree)}
                    mode={isMobile ? 'drawer' : 'sider'}>
                    <ArchiveTree
                        style={{ width: '100%', padding: ' 4px 4px 0' }}
                        moduleId={'baySelectCompany'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this.onCompanySelect}
                        selectFirstNode={true}
                    />
                    <ArchiveTree
                        moduleId={'bayPage'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeTParentype={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.VOLTAGE}
                        selectFirstNode={true}
                        rootNodeParentId={selectCompanyId}
                        onResultEmpty={() => {
                            this.setState({ loading: false });
                        }}
                        onClick={(key, dataRef, title, type) => {
                            let result = this.getArchiveInfo(type, dataRef);
                            this.loadData(
                                result.substationId,
                                bayId,
                                companyId,
                                substationName,
                                result.voltageLevel,
                                bayType,
                                bayNames,
                                null,
                                result.deviceType,
                                page,
                                limit
                            );
                        }}
                    />
                </SiderDrawer>
                <Scrollbar>
                    <SearchCard
                        handlerSearch={this.handSearchClick}
                        handlerReset={this.handlerReset}
                        clearEnterListener={clearEnterListener}
                        style={{ margin: 0, padding: 0 }}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.SubstationName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'substationName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.SubstationNameReq)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.BayName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'bayName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.BayNameReq)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.VoltageClass)}>
                                {getFieldDecorator('voltageLevel')(
                                    <Select placeholder={formatMessage(locale.VoltageClassTip)}>
                                        {children}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.BayType)}>
                                {getFieldDecorator('bayType')(
                                    <Select placeholder={formatMessage(locale.BayTypeReq)}>
                                        {bayTypeList}
                                    </Select>
                                )}
                            </Form.Item>
                        </StandardForm>
                    </SearchCard>
                    <StandardTable
                        loading={loading}
                        columns={columns}
                        current={page}
                        title={() => (
                            <TableAction
                                batchActions={[{ title: 'Delete', auth: 'DeleteBayName' }]}
                                handleAction={(menu) => {
                                    if (menu.key === 'Delete') {
                                        this.handlerDelete();
                                    }
                                }}
                                cleanSelectedKeys={this.cleanSelectedKeys}
                                rowCount={selectedRowKeys.length}>
                                <Row gutter={12} type='flex' justify='end' align='middle'>
                                    <Col>
                                        <Button
                                            auth='NewOrEditBayName'
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
                        dataSource={dataSource === null ? [] : dataSource.list}
                        onChange={(pagination) => {
                            this.loadData(
                                substationId,
                                bayId,
                                companyId,
                                substationName,
                                voltageLevel,
                                bayType,
                                bayNames,
                                null,
                                deviceType,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={dataSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: dataSource.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack}
                    />
                    <AddOrUpdateBay
                        visible={addVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        bayInfo={bayInfo}
                        handlerRefresh={this.handlerRefresh.bind(this)}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(BayManagement);
