import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Badge, Tabs, Button, Icon } from 'antd';
import { locale } from '../../../../../pages/locale';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import { toast } from '../../../../../components/toast';
import { injectIntl } from 'react-intl';
import { isEmpty } from '../../../../../utils/common';
import Enum from '../../../../../utils/enum';
import SingleThresholdConfigure from './singleThresholdConfigure';
import AeDataConfigure from './aeDataConfigure';
import TestpointConfigure from './testpointConfigure';
import StandardTable from '../../../../../components/standardTable';
import TableAction from '../../../../../containers/tableAction';
import TableHandler from '../../../../../containers/tableHandler';
import moment from 'moment';
import Ellipsis from '../../../../../components/ellipsis';
const TabPane = Tabs.TabPane;

@connect(
    (state) => ({
        testpointInfoState: state.testpointReducer,
    }),
    (dispatch) => ({
        singleThresholdQuery: (testpointIds, testpointType) =>
            dispatch(archiveAction.singleThresholdQuery(testpointIds, testpointType)),
        singleThresholdDelte: (selectedIds, testpointType) =>
            dispatch(archiveAction.singleThresholdDelte(selectedIds, testpointType)),

        testPointRuleQuery: (testpointId) =>
            dispatch(archiveAction.testPointRuleQuery(testpointId)),
        testPointRuleDelte: (selectedIds) =>
            dispatch(archiveAction.testPointRuleDelte(selectedIds)),

        testPointAeQuery: (testpointId) => dispatch(archiveAction.testPointAeQuery(testpointId)),
        testPointAeDelte: (selectedIds) => dispatch(archiveAction.testPointAeDelte(selectedIds)),
    })
)
@Form.create()
class TestpointAlarmConfigure extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            actionType: 0,
            tevAlarmVisible: false,
            aeAlarmVisible: false,
            aeAddType: 0,
            testPointVisible: false, //添加测点诊断
            currentTestpointId: '',
            loading: false,
            tevTestSetInfo: {},
            ruleInfo: {},
            aeSetInfo: {},
        };
    }

    static defaultProps = {
        actionType: 0, //操作按钮type 0 新增 1 编辑
    };

    componentDidMount() {}

    UNSAFE_componentWillReceiveProps(newProps) {
        let { testpointId, testpointType } = newProps.pointInfo;
        let { singleThresholdQuery, testPointRuleQuery, testPointAeQuery } = newProps;
        let { currentTestpointId } = this.state;
        if (testpointId && testpointId != currentTestpointId) {
            this.setState({ currentTestpointId: testpointId }, () => {
                if (testpointType === 0 || testpointType === 26) {
                    setTimeout(() => {
                        singleThresholdQuery(testpointId, testpointType);
                    }, 100);
                }
                testPointRuleQuery(testpointId);
                if (testpointType === 4) {
                    setTimeout(() => {
                        testPointAeQuery(testpointId);
                    }, 100);
                }
            });
        }
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                let { pointName, remark, testpointPurpose } = values;
                this.asyncAddOrEditPoint(pointName, remark, testpointPurpose);
            }
        });
    };

    handlerDataCreate = (testpointType) => {
        switch (testpointType) {
            case 0:
                this.handlerTevAlarmSetting();
                break;
            case 4:
                this.handlerPDType();
                break;
            case 26:
                this.handlerTevAlarmSetting();
                break;
            default:
                break;
        }
    };

    handlerTevAlarmSetting = () => {
        this.setState({
            tevAlarmVisible: true,
            actionType: 0,
        });
    };

    handlerPDType = () => {
        this.setState({ aeAlarmVisible: true, actionType: 0 });
    };

    handlerDiagnosis = () => {
        this.setState({ aeAddType: 1, aeAlarmVisible: true });
    };

    handlerTestPointRuleCreate = (testpointType) => {
        this.onTestPointLevel();
    };

    onTestPointLevel = () => {
        this.setState({
            testPointVisible: true,
            actionType: 0,
        });
    };

    handlerClickTev = (actionID, object) => {
        this.setState({
            actionType: 1,
            tevAlarmVisible: true,
            ruleInfo: object,
        });
    };

    handlerAERules = (actionID, object) => {
        this.setState({
            actionType: 1,
            aeAlarmVisible: true,
            ruleInfo: object,
        });
    };

    handlerTEV = (actionID, object) => {
        this.setState({
            actionType: 1,
            testPointVisible: true,
            ruleInfo: object,
        });
    };

    handlerDelete = (actionID, type) => {
        let { singleThresholdDelte, testPointRuleDelte, pointInfo, testPointAeDelte } = this.props;
        let { testpointType } = pointInfo ? pointInfo : {};
        if (type === 0) {
            this.confirmDel(type, singleThresholdDelte, actionID, testpointType);
        } else if (type === 1) {
            this.confirmDel(type, testPointRuleDelte, actionID);
        } else if (type === 3) {
            this.confirmDel(type, testPointAeDelte, actionID);
        }
    };

    confirmDel = (type, delMethod, actionID, testpointType) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                if (delMethod) {
                    let result = await delMethod(actionID, testpointType);
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.refreshData(type);
                    }
                }
            },
        });
    };

    refreshData = (type) => {
        switch (type) {
            case 0:
                this.onHandlerRefresh();
                break;
            case 1:
                this.onHandlerTevRulesRefresh();
                break;
            case 3:
                this.onHandlerAERefresh();
                break;
            default:
                break;
        }
    };

    onHandlerRefresh = () => {
        let {
            pointInfo: { testpointId, testpointType },
            singleThresholdQuery,
        } = this.props;
        singleThresholdQuery(testpointId, testpointType);
    };

    onHandlerTevRulesRefresh = () => {
        let {
            pointInfo: { testpointId },
            testPointRuleQuery,
        } = this.props;
        testPointRuleQuery(testpointId);
    };

    onHandlerAERefresh = () => {
        let {
            pointInfo: { testpointId },
            testPointAeQuery,
        } = this.props;
        testPointAeQuery(testpointId);
    };

    renderLayout() {
        let {
            intl: { formatMessage, formats },
            testpointInfoState: { tevThreshold, tevTestpointRules, aeThreshold },
            pointInfo,
        } = this.props;
        let { loading } = this.state;
        let { testpointType } = pointInfo;
        let columns = [
            {
                title: formatMessage(locale.Name),
                dataIndex: 'ruleName',
                key: 'ruleName',
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
                title: formatMessage(locale.AlarmLevel),
                dataIndex: 'alarmLevel',
                key: 'alarmLevel',
                width: 120,
                render: (item) => {
                    let res = Enum.getExceptionStatus(item);
                    return <Badge status={res.status} text={formatMessage(locale[res.value])} />;
                },
            },
            {
                title: formatMessage(locale.Threshold),
                dataIndex: 'alarmThreshold',
                key: 'alarmThreshold',
                width: 120,
                render: (alarmThreshold, object) =>
                    Enum.getCompareWay(object.alarmThresholdSign) +
                    alarmThreshold +
                    Enum.getUnitEnum(object.alarmThresholdUnit),
            },
            {
                title: formatMessage(locale.TestPointName),
                dataIndex: 'testpointName',
                width: 180,
                key: 'testpointName',
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
                visible: false,
                render: (createTime) =>
                    isEmpty(createTime) ? '' : moment(createTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.SpecificationModifyTime),
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                width: 200,
                visible: false,
                render: (modifyTime) =>
                    isEmpty(modifyTime) ? '' : moment(modifyTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.DataType),
                dataIndex: 'testpointType',
                key: 'testpointType',
                render: (testpointType) => Enum.getTypeEnum(testpointType),
            },
            {
                title: formatMessage(locale.Operate),
                dataIndex: 'id',
                key: 'id',
                fixed: 'right',
                width: 130,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={['Edit']}
                        batchActionsMore={['Delete']}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerClickTev(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDelete(actionID, 0);
                            }
                        }}
                    />
                ),
            },
        ];

        let tevRulecolumns = [
            {
                title: formatMessage(locale.Name),
                dataIndex: 'ruleName',
                key: 'ruleName',
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
                title: formatMessage(locale.AlarmLevel),
                dataIndex: 'alarmLevel',
                key: 'alarmLevel',
                width: 120,
                render: (item) => {
                    let res = Enum.getExceptionStatus(item);
                    return <Badge status={res.status} text={formatMessage(locale[res.value])} />;
                },
            },
            {
                title: formatMessage(locale.Total),
                dataIndex: 'totalCount',
                key: 'totalCount',
                width: 120,
            },
            {
                title: formatMessage(locale.ExceptionNums),
                dataIndex: 'abnormalCount',
                key: 'abnormalCount',
                width: 180,
            },
            {
                title: formatMessage(locale.CreateTime),
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
                visible: false,
                render: (createTime) =>
                    isEmpty(createTime) ? '' : moment(createTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.SpecificationModifyTime),
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                width: 200,
                visible: false,
                render: (modifyTime) =>
                    isEmpty(modifyTime) ? '' : moment(modifyTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.TestPointName),
                dataIndex: 'testpointName',
                key: 'testpointName',
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
                width: 130,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={['Edit']}
                        batchActionsMore={['Delete']}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerTEV(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDelete(actionID, 1);
                            }
                        }}
                    />
                ),
            },
        ];

        let aecolumns = [
            {
                title: formatMessage(locale.Name),
                dataIndex: 'ruleName',
                key: 'ruleName',
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
                title: formatMessage(locale.AlarmLevel),
                dataIndex: 'alarmLevel',
                key: 'alarmLevel',
                width: 120,
                render: (item) => {
                    let res = Enum.getExceptionStatus(item);
                    return <Badge status={res.status} text={formatMessage(locale[res.value])} />;
                },
            },
            {
                title: formatMessage(locale.FingerprintPDType),
                dataIndex: 'pdType',
                key: 'pdType',
                width: 100,
                render: (pdType) => formatMessage(locale[Enum.getCDiagSignalTypeEnum(pdType)]),
            },
            {
                title: `${formatMessage(locale.PdShorthand)}${formatMessage(locale.Threshold)}`,
                dataIndex: 'pdTypeThreshold',
                key: 'pdTypeThreshold',
                width: 150,
                render: (pdTypeThreshold, object) =>
                    Enum.getCompareWay(object.pdTypeSign) +
                    pdTypeThreshold +
                    Enum.getUnitEnum(object.pdTypeThresholdUnit),
            },
            {
                title: `${formatMessage(locale.Alarm)}${formatMessage(locale.Threshold)}`,
                dataIndex: 'alarmThreshold',
                key: 'alarmThreshold',
                width: 150,
                render: (alarmThreshold, object) =>
                    Enum.getCompareWay(object.alarmThresholdSign) +
                    alarmThreshold +
                    Enum.getUnitEnum(object.alarmThresholdUnit),
            },
            {
                title: formatMessage(locale.CreateTime),
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
                visible: false,
                render: (createTime) =>
                    isEmpty(createTime) ? '' : moment(createTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.SpecificationModifyTime),
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                width: 200,
                visible: false,
                render: (modifyTime) =>
                    isEmpty(modifyTime) ? '' : moment(modifyTime).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.TestPointName),
                dataIndex: 'testpointName',
                key: 'testpointName',
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
                width: 130,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={['Edit']}
                        batchActionsMore={['Delete']}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerAERules(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDelete(actionID, 3);
                            }
                        }}
                    />
                ),
            },
        ];
        let dataColumn = [];
        let testPointColumn = [];
        let dataSource = [];
        let testPointSource = [];
        if (testpointType === 0) {
            dataColumn = columns;
            testPointColumn = tevRulecolumns;
            dataSource = tevThreshold;
            testPointSource = tevTestpointRules;
        } else if (testpointType === 4) {
            dataColumn = aecolumns;
            testPointColumn = tevRulecolumns;
            dataSource = aeThreshold;
            testPointSource = tevTestpointRules;
        } else if (testpointType === 26) {
            dataColumn = columns;
            dataSource = tevThreshold;
            testPointColumn = tevRulecolumns;
            testPointSource = tevTestpointRules;
        } else {
            testPointColumn = tevRulecolumns;
            testPointSource = tevTestpointRules;
        }
        return (
            <Tabs
                defaultActiveKey={[0, 4, 26].includes(testpointType) ? '1' : '2'}
                onChange={this.callback}>
                {[0, 4, 26].includes(testpointType) ? (
                    <TabPane tab={formatMessage(locale.DataDiagnose)} key='1'>
                        <StandardTable
                            style={{ marginBottom: 40 }}
                            pagination={false}
                            loading={loading}
                            columns={dataColumn}
                            current={1}
                            title={() => (
                                <TableAction>
                                    <Row gutter={12} type='flex' justify='end' align='middle'>
                                        <Col>
                                            <Button
                                                type='primary'
                                                onClick={this.handlerDataCreate.bind(
                                                    this,
                                                    testpointType
                                                )}
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
                            dataSource={isEmpty(dataSource) ? [] : dataSource}
                        />
                    </TabPane>
                ) : null}
                <TabPane tab={formatMessage(locale.TestpointDiagnose)} key='2'>
                    <StandardTable
                        style={{ marginBottom: 40 }}
                        pagination={false}
                        loading={loading}
                        columns={testPointColumn}
                        current={1}
                        title={() => (
                            <TableAction>
                                <Row gutter={12} type='flex' justify='end' align='middle'>
                                    <Col>
                                        <Button
                                            type='primary'
                                            onClick={this.handlerTestPointRuleCreate.bind(
                                                this,
                                                testpointType
                                            )}
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
                        dataSource={isEmpty(testPointSource) ? [] : testPointSource}
                    />
                </TabPane>
            </Tabs>
        );
    }

    render() {
        let {
            confirmLoading,
            tevAlarmVisible,
            aeAlarmVisible,
            testPointVisible,
            actionType,
            ruleInfo,
        } = this.state;
        let {
            visible,
            pointInfo,
            intl: { formatMessage },
            onCancel,
        } = this.props;
        let modalContent = this.renderLayout();
        return (
            <Modal
                title={`${Enum.getTypeEnum(pointInfo.testpointType)} ${formatMessage(
                    locale.Configuration
                )}`}
                visible={visible}
                confirmLoading={confirmLoading}
                bodyStyle={{ maxHeight: '60%' }}
                width='57%'
                footer={null}
                centered
                onOk={this.handleOk}
                onCancel={() => {
                    onCancel();
                }}
                destroyOnClose
                maskClosable>
                {modalContent}
                <SingleThresholdConfigure
                    visible={tevAlarmVisible}
                    pointInfo={pointInfo}
                    actionType={actionType}
                    ruleInfo={ruleInfo}
                    onCancel={() => {
                        this.setState({ tevAlarmVisible: false });
                    }}
                    onHandlerRefresh={this.onHandlerRefresh}
                />
                <AeDataConfigure
                    visible={aeAlarmVisible}
                    actionType={actionType}
                    pointInfo={pointInfo}
                    ruleInfo={ruleInfo}
                    onHandlerAERefresh={this.onHandlerAERefresh}
                    onCancel={() => {
                        this.setState({ aeAlarmVisible: false });
                    }}
                />
                <TestpointConfigure
                    visible={testPointVisible}
                    pointInfo={pointInfo}
                    ruleInfo={ruleInfo}
                    actionType={actionType}
                    onHandlerTevRulesRefresh={this.onHandlerTevRulesRefresh}
                    onCancel={() => {
                        this.setState({
                            testPointVisible: false,
                        });
                    }}
                />
            </Modal>
        );
    }
}
export default injectIntl(TestpointAlarmConfigure);
