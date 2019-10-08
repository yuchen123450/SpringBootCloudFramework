import React, { PureComponent } from 'react';
import { Form, Modal, Button as AntdButton, Input, Row, Col, Icon, Select } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import StandardForm from '../../../../components/standardForm';
import SplitterLayout from '../../../../containers/splitterLayout';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import SiderDrawer from '../../../../containers/siderDrawer';
import SearchCard from '../../../../containers/searchCard';
import TableAction from '../../../../containers/tableAction';
import AddOrUpdatePoint from './addOrUpdatePoint';
import { archiveAction, systemAction } from '../../../../actions';
import Enum from '../../../../utils/enum';
import moment from 'moment';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import TestpointAlarmConfigure from './alarmConfigure/testpointAlarmConfigure';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        testpointInfoState: state.testpointReducer,
        systemState: state.alarmSettingReducer,
    }),
    (dispatch) => ({
        getTestpointInfo: (
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpointName,
            deviceType,
            testpointType,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getTestpointInfo(
                    substationId,
                    bayId,
                    deviceId,
                    voltageLevel,
                    testpointName,
                    deviceType,
                    testpointType,
                    page,
                    limit
                )
            ),
        addEditTestpointInfo: (
            actionType,
            id,
            deviceId,
            testpointName,
            testpointId,
            testpointIndex,
            position,
            testpointType,
            assetTestpointInfoId,
            remark
        ) =>
            dispatch(
                archiveAction.addEditTestpointInfo(
                    actionType,
                    id,
                    deviceId,
                    testpointName,
                    testpointId,
                    testpointIndex,
                    position,
                    testpointType,
                    assetTestpointInfoId,
                    remark
                )
            ),
        deleteTestpointInfo: (selectedIds) =>
            dispatch(archiveAction.deleteTestpointInfo(selectedIds)),
        getChannelType: () => dispatch(archiveAction.getChannelType()),
        getVoltageClass: () => dispatch(archiveAction.getVoltageClass()),
        queryCommonType: (typeKindCode, typeKindName, typeCode, typeName) =>
            dispatch(archiveAction.queryCommonType(typeKindCode, typeKindName, typeCode, typeName)),
        alarmLevelCustom: (alarmLevel, page, limit) =>
            dispatch(systemAction.alarmLevelCustom(alarmLevel, page, limit)),
    })
)
@Form.create()
class TestpointManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            page: 1,
            limit: 10,
            actionMenuType: 1,
            loading: true,
            addVisible: false,
            substationId: '',
            bayId: '',
            deviceId: '',
            voltageLevel: '',
            testpoinName: '',
            deviceType: '',
            selectValue: '',
            selectCompanyId: '-1',
            selectKey: '',
            pointInfo: {},
            isBatchDelete: false,
            testpointType: '',
            clearEnterListener: false,
            configureVisible: false,
        };
    }

    static defaultProps = {};

    componentDidMount() {
        let { queryCommonType, alarmLevelCustom } = this.props;
        queryCommonType(20);
        alarmLevelCustom();
    }

    getData = async (
        substationId,
        bayId,
        deviceId,
        voltageLevel,
        testpoinName,
        deviceType,
        testpointType,
        page,
        limit
    ) => {
        let { getTestpointInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getTestpointInfo(
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpoinName,
            deviceType,
            testpointType,
            page,
            limit
        );
        this.setState({
            loading: false,
            page: page,
            limit: limit,
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpoinName,
            deviceType,
            testpointType,
        });
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        let { substationId, bayId, deviceId, voltageLevel, deviceType, limit } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                const pointTestPointName =
                    values.pointTestPointName === undefined ? '' : values.pointTestPointName;
                const pointTestPointType =
                    values.pointTestPointType === undefined ? '' : values.pointTestPointType;
                this.getData(
                    substationId,
                    bayId,
                    deviceId,
                    voltageLevel,
                    pointTestPointName,
                    deviceType,
                    pointTestPointType,
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
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteTestpointInfo,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteTestpointInfo) {
                        let result = await deleteTestpointInfo(selectedRowKeys.join(','));
                        if (result.success) {
                            toast('success', formatMessage(locale.DeleteSuccess));
                            this.handlerRefresh();
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

    handlerRefresh = () => {
        let {
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpoinName,
            deviceType,
            testpointType,
            page,
            limit,
        } = this.state;
        this.getData(
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpoinName,
            deviceType,
            testpointType,
            page,
            limit
        );
    };

    handlerReset = () => {
        this.setState(
            {
                testpoinName: '',
                testpointType: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    onSelectCallBack = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
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

    onCompanyDefValueSet = (selectCompanyId) => {
        if (selectCompanyId === -1) {
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

    handlerEditClickOnTable = (actionID, object) => {
        this.setState({
            addVisible: true,
            actionID,
            pointInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    handlerDeleteClickOnTable = (actionID) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    deleteTestpointInfo,
                    intl: { formatMessage },
                } = this.props;
                let { selectedRowKeys } = this.state;
                if (deleteTestpointInfo) {
                    let result = await deleteTestpointInfo(actionID);
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.handlerRefresh();
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
            _this.state.substationIds = dataRef.key;
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
        this.setState({ addVisible: false, configureVisible: false, clearEnterListener: false });
    };

    handlerConfiguration = (actionID, object) => {
        this.setState({
            configureVisible: true,
            actionID,
            pointInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    /**
     * 针对返回的id进行去重操作保证前台页面的显示
     */
    filterObj = (objcArray) => {
        for (var i = 0; i < objcArray.length; i++) {
            for (var j = i + 1; j < objcArray.length; ) {
                if (objcArray[i].id == objcArray[j].id) {
                    //通过id属性进行匹配；
                    objcArray.splice(j, 1); //去除重复的对象；
                } else {
                    j++;
                }
            }
        }
        return objcArray;
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        let {
            intl: { formatMessage, formats },
            testpointInfoState: { testPoints },
            isMobile,
            form: { getFieldDecorator },
            testpointInfoState: { testPointTypeList },
        } = this.props;
        let {
            page,
            limit,
            actionMenuType,
            loading,
            addVisible,
            substationId,
            bayId,
            deviceId,
            voltageLevel,
            testpoinName,
            deviceType,
            selectCompanyId,
            pointInfo,
            testpointType,
            selectedRowKeys,
            clearEnterListener,
            configureVisible,
        } = this.state;
        let pointTypeChidren = [];
        if (testPointTypeList && testPointTypeList.length > 0) {
            testPointTypeList.forEach((element) => {
                pointTypeChidren.push(
                    <Select.Option key={element.typeCode}>
                        {Enum.getTypeEnum(element.typeCode)}
                    </Select.Option>
                );
            });
        }
        let pointResult = [];
        if (testPoints && testPoints.list && testPoints.list.length > 0) {
            pointResult = this.filterObj(testPoints.list);
        }
        const columns = [
            {
                title: formatMessage(locale.TestPointName),
                dataIndex: 'testpointName',
                key: 'testpointName',
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
                title: formatMessage(locale.TestPointManagerTestpointIndex),
                dataIndex: 'testpointIndex',
                key: 'testpointIndex',
                visible: false,
                width: 100,
            },
            {
                title: formatMessage(locale.TestPointManagerPosition),
                dataIndex: 'position',
                key: 'position',
                visible: false,
                width: 100,
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
                title: formatMessage(locale.TestPointManagerTestType),
                dataIndex: 'testpointType',
                key: 'testpointType',
                width: 200,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {Enum.getTypeEnum(content)}
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
                        <Ellipsis tooltip fullWidthRecognition lines>{`${content}`}</Ellipsis>
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
                        batchActions={[{ title: 'Edit', auth: 'NewOrEditTestPoint' }]}
                        batchActionsMore={
                            object.testpointPurpose === 2 &&
                            [0, 4, 7, 10, 26].includes(object.testpointType)
                                ? [
                                      {
                                          title: 'Configuration',
                                          auth: 'ConfigurationDiagnosticRules',
                                      },
                                      { title: 'Delete', auth: 'DeleteTestPoint' },
                                  ]
                                : [{ title: 'Delete', auth: 'DeleteTestPoint' }]
                        }
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerEditClickOnTable(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDeleteClickOnTable(actionID);
                            } else if (menu.key === 'Configuration') {
                                this.handlerConfiguration(actionID, object);
                            }
                        }}
                    />
                ),
            },
        ];

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
                        moduleId={'pointSelectCompanyIndex'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this.onCompanySelect}
                        needGlobalCacheCheck={true}
                        selectFirstNode={true}
                    />
                    <ArchiveTree
                        moduleId={'archive-asset'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.DEVICE}
                        needGlobalCacheCheck={true}
                        selectFirstNode={true}
                        onResultEmpty={() => {
                            this.setState({ loading: false });
                        }}
                        rootNodeParentId={selectCompanyId}
                        onClick={(key, dataRef, title, type) => {
                            let result = this.getArchiveInfo(type, dataRef);
                            this.getData(
                                result.substationIds,
                                result.bayId,
                                result.deviceId,
                                result.voltageLevel,
                                testpoinName,
                                result.deviceType,
                                testpointType,
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
                            <Form.Item label={formatMessage(locale.TestPointName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'pointTestPointName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale
                                )(
                                    <Input
                                        placeholder={formatMessage(
                                            locale.TestPointManagerTestpointNameReq
                                        )}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.TestPointManagerTestType)}>
                                {getFieldDecorator('pointTestPointType')(
                                    <Select
                                        placeholder={formatMessage(locale.TestPointSelectTestType)}>
                                        {pointTypeChidren}
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
                                batchActions={[{ title: 'Delete', auth: 'DeleteTestPoint' }]}
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
                                            auth='NewOrEditTestPoint'
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
                        dataSource={pointResult}
                        onChange={(pagination) => {
                            this.getData(
                                substationId,
                                bayId,
                                deviceId,
                                voltageLevel,
                                testpoinName,
                                deviceType,
                                testpointType,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={testPoints.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: testPoints.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack.bind(this)}
                    />
                    <AddOrUpdatePoint
                        visible={addVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        handlerRefresh={this.handlerRefresh.bind(this)}
                        pointInfo={pointInfo}
                    />
                    <TestpointAlarmConfigure
                        visible={configureVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        handlerRefresh={this.handlerRefresh.bind(this)}
                        pointInfo={pointInfo}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(TestpointManagement);
