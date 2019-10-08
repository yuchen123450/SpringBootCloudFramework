import React, { PureComponent } from 'react';
import { Form, Input, Row, Modal, DatePicker, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import SplitterLayout from '../../../../containers/splitterLayout';
import SiderDrawer from '../../../../containers/siderDrawer';
import StandardForm from '../../../../components/standardForm';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import ArchiveTree, {
    ARCHIVE_TREE_TYPE,
    ARCHIVE_NODE_TYPE,
    DATA_SOURCE_MODE,
} from '../../../../containers/archiveTree';
import SearchCard from '../../../../containers/searchCard';
import { archiveAction } from '../../../../actions';
import BaseIcon from '../../../../components/baseIcon';
import Select from '../../../../components/baseSelect';
import { isEmpty } from '../../../../utils/common';
import { getExplorerScreenRectParams } from '../../../../utils/dom';
import SensorHostDetails from './host/sensorHostDetails';
import TableAction from '../../../../containers/tableAction';
import Enum from '../../../../utils/enum';
import SensorPage from './sensor/sensorPage';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import MonitorConfigure from './host/monitorConfigure';
import TableHandler from '../../../../containers/tableHandler';
import { toast } from '../../../../components/toast';
import MonitorStatus from './host/monitorStatus';
import moment from 'moment';

@connect(
    (state) => ({
        monitorReducerState: state.monitorReducer,
    }),
    (dispatch) => ({
        //请求主机信息
        getHostSensorInfo: (
            substationId,
            connectionStatus,
            monitorType,
            monitorId,
            monitorConnectionGroup,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getHostSensorInfo(
                    substationId,
                    connectionStatus,
                    monitorType,
                    monitorId,
                    monitorConnectionGroup,
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    page,
                    limit
                )
            ),
        //采集数据指令下发
        collectDataIssued: (selectedIds) => dispatch(archiveAction.collectDataIssued(selectedIds)),
        //获取主机状态指令
        getMonitorStatus: (id) => dispatch(archiveAction.collectDataIssued(id)),
    })
)
@Form.create()
class SensorManager extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = props;
        this.state = {
            loading: false,
            expandedRowKeys: [],
            page: 1,
            limit: 10,
            visible: false,
            selectedRowKeys: [],
            selectCompanyId: '-1',
            substationId: '',
            connectionStatus: '',
            monitorType: '',
            monitorId: '',
            monitorConnectionGroup: '',
            installationTime: '',
            lastConnectionTime: '',
            monitorInfo: {},
            monitorTypeList: [
                { key: 0, value: 0, name: formatMessage(locale.MonitorWallMount) },
                { key: 1, value: 1, name: formatMessage(locale.Monitor2U) },
                { key: 2, value: 2, name: formatMessage(locale.MonitorCollectionNode) },
                { key: 3, value: 3, name: formatMessage(locale.MonitorLowpowerSolarHost) },
            ],
            netStatusList: [
                { key: 0, value: 0, name: formatMessage(locale.MonitorDisConnect) },
                { key: 1, value: 1, name: formatMessage(locale.MonitorOnline) },
            ],
            installationStartTime: '',
            installationEndTime: '',
            lastConnectionStartTime: '',
            lastConnectionEndTime: '',
            monitorInstrumentType: 1, //1:主机 2：传感器
            configureVisible: false,
            monitorStatusVisible: false,
            resSelectedRows: [],
        };
    }

    static defaultProps = {};

    componentDidMount() {}

    loadData = async (
        substationId,
        connectionStatus,
        monitorType,
        monitorId,
        monitorConnectionGroup,
        installationStartTime,
        installationEndTime,
        lastConnectionStartTime,
        lastConnectionEndTime,
        page,
        limit
    ) => {
        let { getHostSensorInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getHostSensorInfo(
            substationId,
            connectionStatus,
            monitorType,
            monitorId,
            monitorConnectionGroup,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            page,
            limit
        );
        this.setState({
            loading: false,
            substationId,
            connectionStatus,
            monitorType,
            monitorId,
            monitorConnectionGroup,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            page,
            limit,
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                let {
                    connectionStatus = '',
                    monitorType = '',
                    monitorId = '',
                    monitorConnectionGroup = '',
                } = values;
                let {
                    substationId,
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    page,
                    limit,
                } = this.state;
                this.loadData(
                    substationId,
                    connectionStatus,
                    monitorType,
                    monitorId,
                    monitorConnectionGroup,
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    page,
                    limit
                );
            }
        });
    };

    handlerReset = () => {
        this.setState(
            {
                connectionStatus: '',
                monitorType: '',
                monitorId: '',
                monitorConnectionGroup: '',
                installationStartTime: '',
                installationEndTime: '',
                lastConnectionStartTime: '',
                lastConnectionEndTime: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    handlerHostDetails = (monitorInfo) => {
        this.setState({ visible: true, monitorInfo, monitorInstrumentType: 1 });
    };

    handleClose = () => {
        this.setState({
            visible: false,
            configureVisible: false,
        });
    };

    onSelectCallBack = (selectedRowKeys, resSelectedRows) => {
        this.setState({
            selectedRowKeys,
            resSelectedRows,
        });
    };

    onCompanySelect = (value, node) => {
        this.setState({
            selectCompanyId: value,
        });
    };

    onInstallTimeChange = (value, dateString) => {
        this.setState({
            installationStartTime: Number(moment(dateString[0]).format('X')),
            installationEndTime: Number(moment(dateString[1]).format('X')),
        });
    };

    onLastConnectChange = (value, dateString) => {
        this.setState({
            lastConnectionStartTime: Number(moment(dateString[0]).format('X')),
            lastConnectionEndTime: Number(moment(dateString[1]).format('X')),
        });
    };

    handlerSensorDetails = (monitorInfo) => {
        this.setState({ visible: true, monitorInfo, monitorInstrumentType: 2 });
    };

    handlerConfigure = (monitorInfo) => {
        this.setState({
            configureVisible: true,
            monitorInfo,
        });
    };

    /**
     * 采集数据指令下发
     */
    handlerDataCollection = () => {
        let {
            intl: { formatMessage },
            collectDataIssued,
        } = this.props;
        let { selectedRowKeys } = this.state;
        Modal.confirm({
            title: formatMessage(locale.OrderIssuedTitle),
            content: formatMessage(locale.OrderIssuedContent),
            onOk: async () => {
                if (collectDataIssued) {
                    let result = await collectDataIssued(selectedRowKeys.join(','));
                    if (result.success) {
                        toast('success', formatMessage(locale.CollectDataIssuedSuccess));
                        this.setState({
                            selectedRowKeys: [],
                        });
                    }
                }
            },
        });
    };

    handlerBatch = (type) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            switch (type) {
                case 1:
                    this.handlerDataCollection();
                    break;
                case 2:
                    this.batchConfigure();
                    break;
                default:
                    break;
            }
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.SelectedNone),
            });
        }
    };

    batchConfigure = () => {
        let { resSelectedRows } = this.state;
    };

    handlerGetStatus = (monitorInfo) => {
        this.setState({
            monitorStatusVisible: true,
            monitorInfo,
        });
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            intl: { formatMessage, formats },
            isMobile,
            monitorReducerState: { dataHostSource },
        } = this.props;
        const {
            loading,
            connectionStatus,
            monitorType,
            monitorId,
            monitorConnectionGroup,
            page,
            limit,
            visible,
            substationId,
            selectCompanyId,
            monitorInfo,
            monitorTypeList,
            netStatusList,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            monitorInstrumentType,
            configureVisible,
            selectedRowKeys,
            monitorStatusVisible,
        } = this.state;
        let sensorHostColumns = [
            {
                title: formatMessage(locale.HostName),
                dataIndex: 'monitorName',
                key: 'monitorName',
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
                title: formatMessage(locale.NetStatus),
                dataIndex: 'connectionStatus',
                key: 'connectionStatus',
                width: 130,
                render: (value) => {
                    let content;
                    if (value === 0) {
                        content = (
                            <span>
                                <BaseIcon icon='alarm-status.svg' />
                                {formatMessage(locale.MonitorDisConnect)}
                            </span>
                        );
                    } else if (value === 1) {
                        content = (
                            <span>
                                <BaseIcon icon='normal-status.svg' />
                                {formatMessage(locale.MonitorOnline)}
                            </span>
                        );
                    }
                    return content;
                },
            },
            {
                title: formatMessage(locale.SignalStrength),
                dataIndex: 'gprsSignalLevel',
                key: 'gprsSignalLevel',
                width: 130,
                render: (value, monitorInfo) => {
                    let content;
                    if (monitorInfo && monitorInfo.webType) {
                        if (monitorInfo.webType == 0 || monitorInfo.webType == 1) {
                            if (!isEmpty(value) && !isNaN(value)) {
                                parseInt(value) >= 0 && parseInt(value) <= 5
                                    ? (content = (
                                          <BaseIcon
                                              icon={`sign_${value}.svg`}
                                              style={{ fontSize: 28 }}
                                          />
                                      ))
                                    : '';
                            }
                        } else if (monitorInfo.webType == 2) {
                            value = formatMessage(locale.MonitorWiredNetwork);
                            content = <BaseIcon icon='internet.svg' style={{ fontSize: 28 }} />;
                        }
                    }
                    return (
                        <Tooltip placement='top' title={value} arrowPointAtCenter>
                            {content}
                        </Tooltip>
                    );
                },
            },
            {
                title: formatMessage(locale.MonitorIsValid),
                dataIndex: 'isValid',
                key: 'isValid',
                width: 100,
                render: (isValid) =>
                    isEmpty(isValid)
                        ? ''
                        : isValid === 0
                        ? formatMessage(locale.False)
                        : formatMessage(locale.True),
            },
            // {
            //     title: formatMessage(locale.DataIssued),
            //     dataIndex: 'data',
            //     key: 'data',
            //     width: 150,
            // },
            {
                title: formatMessage(locale.HostGroupNumber),
                dataIndex: 'monitorConnectionGroup',
                key: 'monitorConnectionGroup',
                width: 200,
            },
            {
                title: formatMessage(locale.HostNumber),
                dataIndex: 'monitorId',
                key: 'monitorId',
                width: 200,
                render: (value) => {
                    let content = isEmpty(value) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {value}
                        </Ellipsis>
                    );
                    return (
                        <Row
                            gutter={6}
                            align='middle'
                            justify='start'
                            type='flex'
                            key={value}
                            style={{ margin: '10px 0' }}>
                            {content}
                        </Row>
                    );
                },
            },
            {
                title: formatMessage(locale.LastUploadTime),
                dataIndex: 'lastDataUploadTime',
                key: 'lastConnectionTime',
                visible: false,
                width: 200,
                render: (time) => (isEmpty(time) ? '' : moment.unix(time).format(formats.dateTime)),
            },
            {
                title: formatMessage(locale.LastConnectTime),
                dataIndex: 'lastConnectionTime',
                key: 'lastConnectionTime',
                visible: false,
                width: 200,
                render: (time) => (isEmpty(time) ? '' : moment.unix(time).format(formats.dateTime)),
            },
            {
                title: `${formatMessage(locale.Electricity)}(%)`,
                dataIndex: 'monitorBattery',
                key: 'monitorBattery',
                visible: false,
                width: 100,
            },
            {
                title: formatMessage(locale.HostType),
                dataIndex: 'monitorType',
                key: 'monitorType',
                width: 200,
                render: (code) => Enum.getMonitorType(code),
            },
            {
                title: formatMessage(locale.FirmwareVersion),
                dataIndex: 'hardwareVersion',
                key: 'hardwareVersion',
            },
            {
                title: formatMessage(locale.Operate),
                dataIndex: 'id',
                key: 'id',
                fixed: 'right',
                align: 'center',
                width: 200,
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[
                            'Details',
                            { title: 'MonitorSensor', auth: 'ViewMonitorSensorInfo' },
                        ]}
                        batchActionsMore={[
                            { title: 'Configuration', auth: 'ConfigurationHost' },
                            { title: 'DataCollection', auth: 'DataCollection' },
                            { title: 'GetStatus', auth: 'GetHostStatus' },
                        ]}
                        handleAction={(menu) => {
                            switch (menu) {
                                case 'Details':
                                    this.handlerHostDetails(object);
                                    break;
                                case 'MonitorSensor':
                                    this.handlerSensorDetails(object);
                                    break;
                                default:
                                    break;
                            }
                        }}
                        handleActionMore={(menu) => {
                            switch (menu.key) {
                                case 'Configuration':
                                    this.handlerConfigure(object);
                                    break;
                                case 'DataCollection':
                                    this.handlerDataCollection(object);
                                    break;
                                case 'GetStatus':
                                    this.handlerGetStatus(object);
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                ),
            },
        ];
        let param = getExplorerScreenRectParams();
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
                        moduleId={'sensorManagerCompany'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this.onCompanySelect}
                        selectFirstNode={true}
                        dataSourceMode={DATA_SOURCE_MODE.SENSOR}
                    />
                    <ArchiveTree
                        moduleId={'sensorManagerSubstation'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeTParentype={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.SUBSTATION}
                        selectFirstNode={true}
                        rootNodeParentId={selectCompanyId}
                        onResultEmpty={() => {
                            this.setState({ loading: false });
                        }}
                        dataSourceMode={DATA_SOURCE_MODE.SENSOR}
                        onClick={(key) => {
                            this.loadData(
                                key,
                                connectionStatus,
                                monitorType,
                                monitorId,
                                monitorConnectionGroup,
                                installationStartTime,
                                installationEndTime,
                                lastConnectionStartTime,
                                lastConnectionEndTime,
                                page,
                                limit
                            );
                        }}
                    />
                </SiderDrawer>
                <Scrollbar>
                    <SearchCard
                        handlerSearch={this.handSearchClick}
                        handlerReset={this.handlerReset}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.HostNumber)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'monitorId',
                                    0,
                                    64,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.HostNumberTips)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.HostType)}>
                                {getFieldDecorator('monitorType')(
                                    <Select
                                        data={monitorTypeList}
                                        placeholder={formatMessage(locale.HostTypeTips)}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.NetStatus)}>
                                {getFieldDecorator('connectionStatus')(
                                    <Select
                                        data={netStatusList}
                                        placeholder={formatMessage(locale.NetStatusTips)}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.HostGroupNumber)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'monitorConnectionGroup',
                                    0,
                                    64,
                                    formatMessage,
                                    locale
                                )(<Input placeholder={formatMessage(locale.HostGroupNumTips)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.InstallationDate)}>
                                {getFieldDecorator('installationTime')(
                                    <DatePicker.RangePicker
                                        className='datePicker'
                                        ranges={{
                                            [formatMessage(locale.Today)]: [
                                                moment().startOf('day'),
                                                moment().endOf('day'),
                                            ],
                                            [formatMessage(locale.ThisMonth)]: [
                                                moment().startOf('month'),
                                                moment().endOf('month'),
                                            ],
                                        }}
                                        format={formats.dateTime}
                                        showTime={{
                                            hideDisabledOptions: true,
                                        }}
                                        onChange={this.onInstallTimeChange}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.LastUploadTime)}>
                                {getFieldDecorator('lastConnectionTime')(
                                    <DatePicker.RangePicker
                                        className='datePicker'
                                        ranges={{
                                            [formatMessage(locale.Today)]: [
                                                moment().startOf('day'),
                                                moment().endOf('day'),
                                            ],
                                            [formatMessage(locale.ThisMonth)]: [
                                                moment().startOf('month'),
                                                moment().endOf('month'),
                                            ],
                                        }}
                                        format={formats.dateTime}
                                        showTime={{
                                            hideDisabledOptions: true,
                                        }}
                                        onChange={this.onLastConnectChange}
                                    />
                                )}
                            </Form.Item>
                        </StandardForm>
                    </SearchCard>
                    <StandardTable
                        size='middle'
                        loading={loading}
                        columns={sensorHostColumns}
                        current={page}
                        title={() => (
                            <TableAction
                                batchActions={[
                                    { title: 'DataCollection', auth: 'DataCollection' },
                                    { title: 'Configuration', auth: 'ConfigurationHost' },
                                ]}
                                handleAction={(menu) => {
                                    if (menu.key === 'DataCollection') {
                                        this.handlerBatch(1);
                                    } else if (menu.key === 'Configuration') {
                                        this.handlerBatch(2);
                                    }
                                }}
                                cleanSelectedKeys={this.cleanSelectedKeys}
                                rowCount={selectedRowKeys.length}
                            />
                        )}
                        rowKey={(record) => record.id}
                        dataSource={dataHostSource === null ? [] : dataHostSource.list}
                        onChange={(pagination) => {
                            this.loadData(
                                substationId,
                                connectionStatus,
                                monitorType,
                                monitorId,
                                monitorConnectionGroup,
                                installationStartTime,
                                installationEndTime,
                                lastConnectionStartTime,
                                lastConnectionEndTime,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={dataHostSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: dataHostSource.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack.bind(this)}
                    />
                    {!configureVisible ? (
                        <Modal
                            title={
                                monitorInfo && monitorInfo.monitorName
                                    ? monitorInfo.monitorName
                                    : formatMessage(locale.Details)
                            }
                            visible={visible}
                            onOk={this.handleClose}
                            onCancel={this.handleClose}
                            destroyOnClose={true}
                            width={monitorInstrumentType === 1 ? '60%' : '85%'}
                            height={
                                monitorInstrumentType === 1
                                    ? `${param.offsetHeight * 0.4}px`
                                    : `${param.offsetHeight * 0.8}px`
                            }
                            bodyStyle={{
                                background: monitorInstrumentType !== 1 ? '#f0f2f5' : '',
                                padding: 0,
                                height: '100%',
                                maxHeight: `${param.offsetHeight *
                                    (monitorInstrumentType === 1 ? 0.4 : 0.8)}px`,
                            }}
                            footer={null}>
                            {monitorInstrumentType === 1 ? (
                                <SensorHostDetails monitorInfo={monitorInfo} />
                            ) : (
                                <SensorPage monitorInfo={monitorInfo} substationId={substationId} />
                            )}
                        </Modal>
                    ) : null}
                    <MonitorConfigure
                        visible={configureVisible}
                        monitorInfo={monitorInfo}
                        handlerSearch={this.handSearchClick}
                        hideModal={() => {
                            this.setState({
                                configureVisible: false,
                            });
                        }}
                    />
                    <MonitorStatus
                        visible={monitorStatusVisible}
                        monitorInfo={monitorInfo}
                        hideModal={() => {
                            this.setState({
                                monitorStatusVisible: false,
                            });
                        }}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(SensorManager);
