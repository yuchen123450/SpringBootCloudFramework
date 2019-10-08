import React, { PureComponent } from 'react';
import { Form, Input, Modal, Select, Row, Col, Button as AntdButton, Icon } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
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
    getVisualDevParentKey,
    getVisualDevKey,
} from '../../../../containers/archiveTree/archiveCacheUtil';
import TableAction from '../../../../containers/tableAction';
import SiderDrawer from '../../../../containers/siderDrawer';
import SearchCard from '../../../../containers/searchCard';
import AddOrEditDevice from './addOrEditDevice';
import { archiveAction } from '../../../../actions';
import moment from 'moment';
import Enum from '../../../../utils/enum';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        deviceInfoState: state.deviceReducer,
    }),
    (dispatch) => ({
        getDeviceInfo: (
            substationIds,
            deviceIds,
            bayIds,
            deviceTypes,
            companyId,
            voltage,
            substationName,
            bayName,
            deviceName,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getDeviceInfo(
                    substationIds,
                    deviceIds,
                    bayIds,
                    deviceTypes,
                    companyId,
                    voltage,
                    substationName,
                    bayName,
                    deviceName,
                    page,
                    limit
                )
            ),
        addEditDeviceInfo: (deviceInfo) => dispatch(archiveAction.addEditDeviceInfo(deviceInfo)),
        deleteDeviceInfo: (selecedIds, selectedParentIds, selectedKeys, selectedItems) =>
            dispatch(
                archiveAction.deleteDeviceInfo(
                    selecedIds,
                    selectedParentIds,
                    selectedKeys,
                    selectedItems
                )
            ),
        queryCommonType: (typeKindCode, typeKindName, typeCode, typeName) =>
            dispatch(archiveAction.queryCommonType(typeKindCode, typeKindName, typeCode, typeName)),
        generateDefPoints: (ids) => dispatch(archiveAction.generateDefPoints(ids)),
    })
)
@Form.create()
class DeviceManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
            selectedItems: [],
            actionMenuType: 1,
            loading: true,
            page: 1,
            limit: 10,
            addVisible: false,
            deleteVisible: false,
            companyId: '',
            voltage: '',
            substationName: '',
            bayName: '',
            deviceName: '',
            selectValue: '',
            selectCompanyId: '-1',
            selectKey: '',
            actionID: '',
            deviceInfo: {},

            substationId: '',
            deviceId: '',
            bayId: '',
            deviceType: '',
            voltageLevel: '',
            clearEnterListener: false,
        };
    }

    static defaultProps = {
        selectedRowKeys: [], //table选择的行数据集合(key)
        actionMenuType: 1, //操作类型 1 新增 2 编辑
        loading: true, // 是否加载中
        page: 1, //当前页码
        limit: 10, //每页查询数量
        addVisible: false, //是否显示添加dialog
        deleteVisible: false, //是否显示删除dialog
        companyId: '', //公司id
        voltage: '', //电压等级
        substationName: '', //变电站名称
        bayName: '', //间隔名称
        deviceName: '', //设备名称
        selectValue: '', //默认选择的值
        selectCompanyId: '-1', //默认选择的公司id
    };

    componentDidMount() {
        let { queryCommonType } = this.props;
        queryCommonType(2); //电压等级
        queryCommonType(3); //设备类型
        queryCommonType(7); //结构形式
        queryCommonType(14); //相别
    }

    getData = async (
        substationId,
        deviceId,
        bayId,
        deviceType,
        companyId,
        voltage,
        substationName,
        bayName,
        deviceName,
        page,
        limit
    ) => {
        let { getDeviceInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getDeviceInfo(
            substationId,
            deviceId,
            bayId,
            deviceType,
            companyId,
            voltage,
            substationName,
            bayName,
            deviceName,
            page,
            limit
        );
        this.setState({
            loading: false,
            page: page,
            limit: limit,
            substationId,
            deviceId,
            bayId,
            deviceType,
            companyId,
            voltage,
            substationName,
            bayName,
            deviceName,
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
        } = this.props;
        let { selectedRowKeys, selectedParentIds, selectedUniqueKeys, selectedItems } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteDeviceInfo,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteDeviceInfo) {
                        let result = await deleteDeviceInfo(
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

    handlerRefresh = () => {
        let {
            substationId,
            deviceId,
            bayId,
            deviceType,
            companyId,
            voltage,
            substationName,
            bayName,
            deviceName,
            page,
            limit,
        } = this.state;
        this.getData(
            substationId,
            deviceId,
            bayId,
            deviceType,
            companyId,
            voltage,
            substationName,
            bayName,
            deviceName,
            page,
            limit
        );
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        let { substationId, deviceId, bayId, companyId, limit } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                const deviceName = isEmpty(values.deviceName) ? '' : values.deviceName;
                const devSubstationName = isEmpty(values.devSubstationName)
                    ? ''
                    : values.devSubstationName;
                const devBayName = isEmpty(values.devBayName) ? '' : values.devBayName;
                const deviceType = isEmpty(values.deviceType) ? '' : values.deviceType;
                const voltageLevel = isEmpty(values.voltageLevel) ? '' : values.voltageLevel;
                this.getData(
                    substationId,
                    deviceId,
                    bayId,
                    deviceType,
                    companyId,
                    voltageLevel,
                    devSubstationName,
                    devBayName,
                    deviceName,
                    1,
                    limit
                );
            }
        });
    };

    handlerReset = () => {
        this.setState(
            {
                deviceType: '',
                voltageLevel: '',
                substationName: '',
                bayName: '',
                deviceName: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    generateDefPoints = async (ids) => {
        let {
            generateDefPoints,
            intl: { formatMessage },
        } = this.props;
        let result = await generateDefPoints(ids);
        if (result.success) {
            toast('success', formatMessage(locale.NewCreateSuccess));
        }
    };

    onSelectCallBack = (selectedRowKeys, selectedItems) => {
        let selectedParentIds = [];
        let selectedUniqueKeys = [];
        selectedItems.map((item) => {
            selectedParentIds.push(getVisualDevParentKey(item));
            selectedUniqueKeys.push(getVisualDevKey(item));
        });
        this.setState({
            selectedRowKeys,
            selectedParentIds,
            selectedUniqueKeys,
            selectedItems,
        });
    };
    onCompanyDefValueSet = (selectCompanyId) => {
        if (selectCompanyId == -1) {
            this.setState({
                selectCompanyId,
            });
        }
    };

    onCompanySelect = (value, node) => {
        this.setState({
            selectCompanyId: value,
            substationIds: '',
        });
    };

    showFirstTreeValue = (key, title, isLeaf, value, parentKey) => {
        let { selectCompanyId } = this.state;
        if (selectCompanyId === -1) {
            this.setState({
                selectCompanyId: key,
                selectValue: value,
                selectKey: key,
            });
        }
    };

    handlerEditClickOnTable = (actionID, object) => {
        this.setState({
            addVisible: true,
            actionID,
            deviceInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    handlerDeleteClickOnTable = (actionID, object) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    deleteDeviceInfo,
                    intl: { formatMessage },
                } = this.props;
                let {
                    selectedRowKeys,
                    selectedParentIds,
                    selectedUniqueKeys,
                    selectedItems,
                } = this.state;
                if (deleteDeviceInfo) {
                    let result = await deleteDeviceInfo(
                        actionID,
                        [getVisualDevParentKey(object)],
                        [getVisualDevKey(object)],
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
                                    (item) => item === getVisualDevParentKey(object)
                                ),
                                1
                            );
                            selectedUniqueKeys.splice(
                                selectedUniqueKeys.findIndex(
                                    (item) => item === getVisualDevKey(object)
                                ),
                                1
                            );
                            selectedItems.splice(
                                selectedItems.findIndex(
                                    (item) => item.deviceId === object.deviceId
                                ),
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

    handlerDefPoints = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DeviceGenerateDefPointsTitle),
                content: formatMessage(locale.DeviceGenerateDefPointsContent),
                onOk: async () => {
                    let {
                        generateDefPoints,
                        intl: { formatMessage },
                    } = this.props;
                    let result = await generateDefPoints(selectedRowKeys.join(','));
                    if (result.success) {
                        toast('success', formatMessage(locale.NewCreateSuccess));
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

    handlerDefPointsOnTable = (actionID) => {
        this.generateDefPoints(actionID);
    };

    onCancelOperate = () => {
        this.setState({ deleteVisible: false });
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
                _this.state.deviceId = '';
                _this.state.bayId = '';
                break;
            case ARCHIVE_NODE_TYPE.VOLTAGE:
                _this.state.deviceType = '';
                _this.state.deviceId = '';
                _this.state.bayId = '';
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
            actionMenuType,
            loading,
            page,
            limit,
            addVisible,
            substationId,
            deviceId,
            deviceType,
            bayId,
            companyId,
            voltageLevel,
            substationName,
            bayName,
            deviceName,
            selectCompanyId,
            deviceInfo,
            selectedRowKeys,
            clearEnterListener,
        } = this.state;
        const {
            intl: { formatMessage, formats },
            deviceInfoState: { dataSource },
            isMobile,
            form: { getFieldDecorator },
            deviceInfoState: { commonTypeVoltageLevel, commonTypeDeviceType },
        } = this.props;
        const columns = [
            {
                title: formatMessage(locale.DeviceName),
                dataIndex: 'deviceName',
                key: 'deviceName',
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
                title: formatMessage(locale.BayName),
                dataIndex: 'bayName',
                key: 'bayName',
                width: 200,
                render: (value, object) => {
                    let content = (value = isEmpty(object.deviceType)
                        ? ''
                        : object.deviceType == 32
                        ? value
                        : '');
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
                        batchActions={[{ title: 'Edit', auth: 'NewOrEditDevice' }]}
                        batchActionsMore={[
                            { title: 'Delete', auth: 'DeleteDevice' },
                            { title: 'ArchiveManagerGenerateDefPoints', auth: 'GenerateDefPoints' },
                        ]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerEditClickOnTable(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDeleteClickOnTable(actionID, object);
                            } else if (menu.key === 'ArchiveManagerGenerateDefPoints') {
                                this.handlerDefPointsOnTable(actionID);
                            }
                        }}
                    />
                ),
            },
        ];
        let children = [],
            devTypeList = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Select.Option key={element.value}>{element.name}</Select.Option>);
            });
        }
        if (commonTypeDeviceType && commonTypeDeviceType.length > 0) {
            commonTypeDeviceType.forEach((element) => {
                devTypeList.push(
                    <Select.Option key={element.typeCode}>
                        {Enum.getDeviceTypeEnum(element.typeCode)}
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
                        moduleId={'devSelectCompany'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this.onCompanySelect}
                        needGlobalCacheCheck={true}
                        selectFirstNode={true}
                    />
                    <ArchiveTree
                        moduleId={'device'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.DEVICTTYPE}
                        onTreeSelect={this._onStationTreeSelect}
                        rootNodeParentId={selectCompanyId}
                        needGlobalCacheCheck={true}
                        selectFirstNode={true}
                        onResultEmpty={() => {
                            this.setState({ loading: false });
                        }}
                        onClick={(key, dataRef, title, type) => {
                            let result = this.getArchiveInfo(type, dataRef);
                            this.getData(
                                result.substationId,
                                result.deviceId,
                                result.bayId,
                                result.deviceType,
                                companyId,
                                result.voltageLevel,
                                substationName,
                                bayName,
                                deviceName,
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
                        clearEnterListener={clearEnterListener}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.DeviceName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'deviceName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.DeviceNameReq)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.SubstationName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'devSubstationName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.SubstationNameReq)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.BayName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'devBayName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.BayNameReq)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.DeviceType)}>
                                {getFieldDecorator('deviceType')(
                                    <Select
                                        placeholder={formatMessage(
                                            locale.DeviceManagerSelectTypes
                                        )}>
                                        {devTypeList}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.VoltageClass)}>
                                {getFieldDecorator('voltageLevel')(
                                    <Select placeholder={formatMessage(locale.VoltageClassTip)}>
                                        {children}
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
                                batchActions={[
                                    { title: 'Delete', auth: 'DeleteDevice' },
                                    {
                                        title: 'ArchiveManagerGenerateDefPoints',
                                        auth: 'GenerateDefPoints',
                                    },
                                ]}
                                handleAction={(menu) => {
                                    switch (menu.key) {
                                        case 'Delete':
                                            this.handlerDelete();
                                            break;
                                        case 'ArchiveManagerGenerateDefPoints':
                                            this.handlerDefPoints();
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
                                            auth='NewOrEditDevice'
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
                            this.getData(
                                substationId,
                                deviceId,
                                bayId,
                                deviceType,
                                companyId,
                                voltageLevel,
                                substationName,
                                bayName,
                                deviceName,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={dataSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: dataSource.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack.bind(this)}
                    />
                    <AddOrEditDevice
                        visible={addVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        handlerRefresh={this.handlerRefresh.bind(this)}
                        deviceInfo={deviceInfo}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(DeviceManagement);
