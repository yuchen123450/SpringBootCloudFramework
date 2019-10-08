import React, { Component } from 'react';
import { Form, Input, Modal, DatePicker, Row } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../pages/locale';
import StandardForm from '../../../../../components/standardForm';
import StandardTable from '../../../../../components/standardTable';
import Scrollbar from '../../../../../components/baseScroll';
import Ellipsis from '../../../../../components/ellipsis';
import SearchCard from '../../../../../containers/searchCard';
import { archiveAction } from '../../../../../actions';
import Select from '../../../../../components/baseSelect';
import BaseIcon from '../../../../../components/baseIcon';
import SensorDetails from './sensorDetails';
import Enum from '../../../../../utils/enum';
import moment from 'moment';
import { isArrayEqual, isEmpty } from '../../../../../utils/common';
import { formItemTips, getExplorerScreenRectParams } from '../../../../../utils/dom';
import TableHandler from '../../../../../containers/tableHandler';
import TableAction from '../../../../../containers/tableAction';
import SensorConfigureModal from './sensorConfigureModal';

const FormItem = Form.Item;

@connect(
    (state) => ({
        monitorReducerState: state.monitorReducer,
    }),
    (dispatch) => ({
        getSensorInfo: (
            substationId,
            monitorId,
            aduId,
            aduName,
            aduType,
            connectionStatus,
            hardwareVersion,
            softwareVersion,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            gprsSignalLevel,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getSensorInfo(
                    substationId,
                    monitorId,
                    aduId,
                    aduName,
                    aduType,
                    connectionStatus,
                    hardwareVersion,
                    softwareVersion,
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    gprsSignalLevel,
                    page,
                    limit
                )
            ),
    })
)
@Form.create()
class SensorPage extends Component {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = props;
        this.state = {
            primary: [0, 1, 2],
            loading: false,
            page: 1,
            limit: 10,
            sensorInfoVisible: false,
            monitorId: '',
            sensorInfo: {},
            netStatusList: [
                { key: 0, value: 0, name: formatMessage(locale.MonitorDisConnect) },
                { key: 1, value: 1, name: formatMessage(locale.MonitorOnline) },
            ],
            sensorTypeList: [
                { key: 0, value: 0, name: formatMessage(locale.MonitorInternalSensor) },
                { key: 1, value: 1, name: formatMessage(locale.MonitorUHFSensor) },
                { key: 2, value: 2, name: formatMessage(locale.MonitorUHFSensorLora) },
                { key: 3, value: 3, name: formatMessage(locale.MonitorHFCT) },
                { key: 4, value: 4, name: formatMessage(locale.MonitorExrternalThreeInOneSensor) },
                { key: 5, value: 5, name: formatMessage(locale.MonitorArresterCurrentSensor) },
                { key: 6, value: 6, name: formatMessage(locale.MonitorArresterVoltageSensor) },
                { key: 7, value: 7, name: formatMessage(locale.MonitorVibration) },
                { key: 8, value: 8, name: formatMessage(locale.MonitorEnvSenor) },
                { key: 9, value: 9, name: formatMessage(locale.MonitorMech) },
                { key: 10, value: 10, name: formatMessage(locale.MonitorMechSensor) },
                { key: 11, value: 11, name: formatMessage(locale.MonitorTransformerAESensor) },
                { key: 12, value: 12, name: formatMessage(locale.MonitorGISAESensor) },
            ],
            installationStartTime: '',
            installationEndTime: '',
            lastConnectionStartTime: '',
            lastConnectionEndTime: '',
            selectedRowKeys: [],
            sensorParConfgVisible: false,
            selectedRows: [],
            configureAduType: '',
        };
    }
    static defaultProps = {};

    componentDidMount() {
        let {
            monitorInfo: { monitorId },
        } = this.props;
        let {
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            page,
            limit,
        } = this.state;
        setTimeout(() => {
            this.loadData(
                monitorId,
                '',
                '',
                '',
                '',
                '',
                '',
                installationStartTime,
                installationEndTime,
                lastConnectionStartTime,
                lastConnectionEndTime,
                '',
                page,
                limit,
                null
            );
        }, 400);
    }

    loadData = async (
        monitorId,
        aduId,
        aduName,
        aduType,
        connectionStatus,
        hardwareVersion,
        softwareVersion,
        installationStartTime,
        installationEndTime,
        lastConnectionStartTime,
        lastConnectionEndTime,
        gprsSignalLevel,
        page,
        limit,
        dataSource
    ) => {
        let { getSensorInfo, substationId = '' } = this.props;
        this.setState({
            loading: true,
        });
        await getSensorInfo(
            substationId,
            monitorId,
            aduId,
            aduName,
            aduType,
            connectionStatus,
            hardwareVersion,
            softwareVersion,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            gprsSignalLevel,
            page,
            limit
        );
        if (dataSource === null) {
            this.setState({
                loading: false,
                monitorId,
                aduId,
                aduName,
                aduType,
                connectionStatus,
                hardwareVersion,
                softwareVersion,
                installationStartTime,
                installationEndTime,
                lastConnectionStartTime,
                lastConnectionEndTime,
                gprsSignalLevel,
                page,
                limit,
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    };

    handleClose = () => {
        this.setState({
            sensorInfoVisible: false,
        });
    };

    handlerDetails = (sensorInfo) => {
        this.setState({
            sensorInfoVisible: true,
            sensorInfo,
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {
                    monitorInfo: { monitorId },
                } = this.props;
                let { aduName, aduId, aduType, lastConnectionState } = values;
                let {
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    page,
                    limit,
                } = this.state;
                this.loadData(
                    monitorId,
                    aduId,
                    aduName,
                    aduType,
                    lastConnectionState,
                    '',
                    '',
                    installationStartTime,
                    installationEndTime,
                    lastConnectionStartTime,
                    lastConnectionEndTime,
                    '',
                    page,
                    limit,
                    null
                );
            }
        });
    };

    handlerReset = () => {
        this.setState(
            {
                aduId: '',
                aduName: '',
                aduType: '',
                lastConnectionState: '',
                monitorConnectionGroup: '',
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

    onSelectCallBack = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    batchConfigure = () => {
        let { selectedRowKeys, selectedRows } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            selectedRows = selectedRows.map((item) => item.aduType);
            if (isArrayEqual(selectedRows)) {
                this.setState({
                    configureAduType: selectedRows[0],
                    sensorParConfgVisible: true,
                });
            } else {
                this.moadWaring('SSDConfigureTips');
            }
        } else {
            this.moadWaring('SelectedNone');
        }
    };

    moadWaring = (content) => {
        let {
            intl: { formatMessage },
        } = this.props;
        return Modal.warning({
            title: formatMessage(locale.TipMessage),
            content: formatMessage(locale[content]),
        });
    };

    getTestPointName = (obj) => {
        if (obj && obj.deviceList && obj.deviceList.length > 0) {
            if (obj.deviceList[0].testpointList && obj.deviceList[0].testpointList.length > 0) {
                return obj.deviceList[0].testpointList.map((item) => item.testpointName);
            }
        }
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
            monitorReducerState: { dataSource },
        } = this.props;
        const {
            page,
            loading,
            sensorInfoVisible,
            monitorId,
            sensorInfo,
            netStatusList,
            sensorTypeList,
            installationStartTime,
            installationEndTime,
            lastConnectionStartTime,
            lastConnectionEndTime,
            aduId,
            aduName,
            aduType,
            lastConnectionState,
            selectedRowKeys,
            sensorParConfgVisible,
            configureAduType,
        } = this.state;

        const columnsSensor = [
            {
                title: formatMessage(locale.Name),
                dataIndex: 'aduName',
                key: 'aduName',
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
                dataIndex: 'lastConnectionState',
                key: 'lastConnectionState',
                width: 150,
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
                title: formatMessage(locale.Electricity),
                dataIndex: 'battery',
                key: 'battery',
                width: 100,
                render: (value) => (isEmpty(value) ? '' : `${value}%`),
            },
            {
                title: formatMessage(locale.SignalStrength) + formatMessage(locale.DBM),
                dataIndex: 'rssi',
                key: 'rssi',
                width: 180,
            },
            {
                title: formatMessage(locale.LastUploadTime),
                dataIndex: 'lastDataUploadTime',
                key: 'lastDataUploadTime',
                width: 180,
                render: (time) => (isEmpty(time) ? '' : moment.unix(time).format(formats.dateTime)),
            },
            {
                title: formatMessage(locale.LastConnectTime),
                dataIndex: 'lastConnectionTime',
                key: 'lastConnectionTime',
                width: 180,
                render: (time) => (isEmpty(time) ? '' : moment.unix(time).format(formats.dateTime)),
            },
            {
                title: formatMessage(locale.RemainingTime),
                dataIndex: 'remainingWorkingTime',
                key: 'remainingWorkingTime',
                width: 180,
            },
            {
                title: formatMessage(locale.SensorCode),
                dataIndex: 'aduId',
                key: 'aduId',
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
                title: formatMessage(locale.Type),
                dataIndex: 'aduType',
                key: 'aduType',
                width: 220,
                render: (code) => Enum.getSensorAudType(code),
            },
            {
                title: formatMessage(locale.DeviceName),
                dataIndex: 'deviceName',
                key: 'deviceName',
                width: 200,
                render: (value, obj) => {
                    let content =
                        obj && obj.deviceList && obj.deviceList.length > 0
                            ? obj.deviceList[0].deviceName
                            : '';
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
                title: formatMessage(locale.TestPointName),
                dataIndex: 'testpointName',
                key: 'testpointName',
                width: 200,
                render: (value, obj) => {
                    let content = this.getTestPointName(obj);
                    return isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content.join('/')}
                        </Ellipsis>
                    );
                },
            },
            {
                title: formatMessage(locale.HardwareVersion),
                dataIndex: 'hardwareVersion',
                key: 'hardwareVersion',
                width: 200,
            },
            {
                title: formatMessage(locale.InstallationDate),
                dataIndex: 'installationTime',
                key: 'installationTime',
                width: 200,
                visible: false,
                render: (time) => (isEmpty(time) ? '' : moment.unix(time).format(formats.dateTime)),
            },
            {
                title: formatMessage(locale.FirmwareVersion),
                dataIndex: 'aduVersion',
                key: 'aduVersion',
                width: 150,
            },
            {
                title: formatMessage(locale.Operate),
                dataIndex: 'id',
                key: 'id',
                fixed: 'right',
                align: 'center',
                width: 150,
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={
                            object && object.aduType && [1, 2, 3, 4].includes(object.aduType)
                                ? [
                                      'Details',
                                      {
                                          title: 'Configuration',
                                          auth: 'ConfigurationMonitorSensor',
                                      },
                                  ]
                                : ['Details']
                        }
                        handleAction={(menu) => {
                            switch (menu) {
                                case 'Details':
                                    this.handlerDetails(object);
                                    break;
                                case 'Configuration':
                                    this.setState({
                                        sensorParConfgVisible: true,
                                        sensorInfo: object,
                                        configureAduType: object.aduType,
                                    });
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
            <Scrollbar>
                <SearchCard handlerSearch={this.handSearchClick} handlerReset={this.handlerReset}>
                    <StandardForm>
                        <FormItem label={formatMessage(locale.TestPointManagerSensorName)}>
                            {formItemTips(
                                getFieldDecorator,
                                'aduName',
                                0,
                                64,
                                formatMessage,
                                locale
                            )(
                                <Input
                                    placeholder={formatMessage(
                                        locale.TestPointManagerSensorNameReq
                                    )}
                                />
                            )}
                        </FormItem>
                        <FormItem label={formatMessage(locale.SensorCode)}>
                            {formItemTips(getFieldDecorator, 'aduId', 0, 64, formatMessage, locale)(
                                <Input placeholder={formatMessage(locale.SensorCodeInputTips)} />
                            )}
                        </FormItem>
                        <FormItem label={formatMessage(locale.SensorType)}>
                            {getFieldDecorator('aduType')(
                                <Select
                                    data={sensorTypeList}
                                    placeholder={formatMessage(locale.SensorTypeSelectTips)}
                                />
                            )}
                        </FormItem>
                        <FormItem label={formatMessage(locale.NetStatus)}>
                            {getFieldDecorator('lastConnectionState')(
                                <Select
                                    data={netStatusList}
                                    placeholder={formatMessage(locale.NetStatusSelectTips)}
                                />
                            )}
                        </FormItem>
                        <FormItem label={formatMessage(locale.InstallationDate)}>
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
                        </FormItem>
                        <FormItem label={formatMessage(locale.LastUploadTime)}>
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
                        </FormItem>
                    </StandardForm>
                </SearchCard>
                <StandardTable
                    loading={loading}
                    columns={columnsSensor}
                    title={() => (
                        <TableAction
                            batchActions={[
                                { title: 'Configuration', auth: 'ConfigurationMonitorSensor' },
                            ]}
                            handleAction={(menu) => {
                                if (menu.key === 'Configuration') {
                                    this.batchConfigure();
                                }
                            }}
                            cleanSelectedKeys={this.cleanSelectedKeys}
                            rowCount={selectedRowKeys.length}
                        />
                    )}
                    current={page}
                    rowKey={(record) => record.id}
                    dataSource={dataSource === null ? [] : dataSource.list}
                    onChange={(pagination) => {
                        this.loadData(
                            monitorId,
                            aduId,
                            aduName,
                            aduType,
                            lastConnectionState,
                            '',
                            '',
                            installationStartTime,
                            installationEndTime,
                            lastConnectionStartTime,
                            lastConnectionEndTime,
                            '',
                            pagination.current,
                            pagination.pageSize,
                            null
                        );
                    }}
                    total={dataSource.totalRecords}
                    totalTip={formatMessage(locale.TableCount, {
                        count: dataSource.totalRecords,
                    })}
                    selectedRowKeys={selectedRowKeys}
                    selectCallBack={this.onSelectCallBack.bind(this)}
                />
                <Modal
                    title={formatMessage(locale.Details)}
                    visible={sensorInfoVisible}
                    onOk={this.handleClose}
                    onCancel={this.handleClose}
                    destroyOnClose
                    width='60%'
                    centered
                    height={`${param.offsetHeight * 0.4}px`}
                    bodyStyle={{
                        padding: 0,
                        height: '100%',
                        maxHeight: `${param.offsetHeight * 0.4}px`,
                    }}
                    footer={false}>
                    <SensorDetails sensorInfo={sensorInfo} />
                </Modal>
                <SensorConfigureModal
                    visible={sensorParConfgVisible}
                    sensorInfo={sensorInfo}
                    aduType={configureAduType}
                    onCancel={() => {
                        this.setState({ sensorParConfgVisible: false });
                    }}
                />
            </Scrollbar>
        );
    }
}
export default injectIntl(SensorPage);
