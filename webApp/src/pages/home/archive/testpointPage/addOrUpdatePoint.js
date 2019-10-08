import React, { PureComponent } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { locale } from '../../../../pages/locale';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../actions';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import StandardForm from '../../../../components/standardForm';
import { toast } from '../../../../components/toast';
import { injectIntl } from 'react-intl';
import InfoModal from '../../../../containers/infoModal';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import Enum from '../../../../utils/enum';

const FormItem = Form.Item;
const Option = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

@connect(
    (state) => ({
        commonState: state.commonReducer,
        testpointInfoState: state.testpointReducer,
        deviceInfoState: state.deviceReducer,
        substationInfoState: state.substationReducer,
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
            testpointPurpose,
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
                    testpointPurpose,
                    remark
                )
            ),
        getSubstationInfo: (
            companyId,
            companyName,
            substationNames,
            voltageLevels,
            countryId,
            provinceId,
            cityCountyId,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getSubstationInfo(
                    companyId,
                    companyName,
                    substationNames,
                    voltageLevels,
                    countryId,
                    provinceId,
                    cityCountyId,
                    page,
                    limit
                )
            ), // just substationNames and voltageLevels
    })
)
@Form.create()
class AddOrUpdatePoint extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = this.props;
        this.state = {
            visible: this.props.visible,
            actionMenuType: this.props.actionMenuType,
            selectCompanyId: '-1',
            selectSubstationId: '-1',
            selectDeviceId: '',
            selectDeviceType: '',
            pointTypeList: [
                {
                    pointType: 0,
                    pointName: formatMessage(locale.TEVAmplitude),
                    TEVTestPosition: this.initTevPosition(formatMessage),
                },
                {
                    pointType: 4,
                    pointName: formatMessage(locale.AEAmplitude),
                    AETestPosition: [
                        { positionType: 10, positionName: formatMessage(locale.PositionFront) },
                        { positionType: 11, positionName: formatMessage(locale.PositionBack) },
                    ],
                },
                {
                    pointType: 5,
                    pointName: formatMessage(locale.AEFly),
                },
                {
                    pointType: 3,
                    pointName: formatMessage(locale.AEPhase),
                },
                {
                    pointType: 2,
                    pointName: formatMessage(locale.AEWave),
                },
                {
                    pointType: 7,
                    pointName: formatMessage(locale.UHFPRPS),
                    UHFTestPosition: [
                        { positionType: 12, positionName: formatMessage(locale.PositionFront) },
                        { positionType: 13, positionName: formatMessage(locale.PositionBack) },
                    ],
                },
                { pointType: 10, pointName: formatMessage(locale.HFCTPRPS) },
                {
                    pointType: 12,
                    pointName: formatMessage(locale.Infrared),
                    InfraredTestPosition: [
                        { positionType: 14, positionName: formatMessage(locale.PositionFront) },
                        { positionType: 15, positionName: formatMessage(locale.PositionBack) },
                    ],
                },
                {
                    pointType: 73,
                    pointName: 'TEV Pulse',
                    tevPulseTestPosition: this.initTevPosition(formatMessage),
                },
            ],
            currentSelectTestType: 0,
            currentTestPosition: 2,
            AEPosition: 10,
            UHFPosition: 12,
            InfraredPosition: 14,
            editTestTypeChange: false,
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        visible: false, //是否显示
    };

    initTevPosition = (formatMessage) => [
        { positionType: 2, positionName: formatMessage(locale.TEVFrontCenter) },
        { positionType: 3, positionName: formatMessage(locale.TEVFrontDown) },
        { positionType: 4, positionName: formatMessage(locale.TEVBackUp) },
        { positionType: 5, positionName: formatMessage(locale.TEVBackCenter) },
        { positionType: 6, positionName: formatMessage(locale.TEVBackDown) },
        { positionType: 7, positionName: formatMessage(locale.TEVSlideUp) },
        { positionType: 8, positionName: formatMessage(locale.TEVSlideCenter) },
        { positionType: 9, positionName: formatMessage(locale.TEVSlideDown) },
    ];

    componentDidMount() {}

    UNSAFE_componentWillReceiveProps(newProps) {
        let visible = newProps.visible;
        let currentPageVisivle = this.state.visible;
        if (visible && visible != currentPageVisivle) {
            this.setState({
                visible: true,
            });
            let { getDeviceInfo, getSubstationInfo } = this.props;
            if (getDeviceInfo) {
                getDeviceInfo('-1', '', '', '', '', '', '', '', '', 1, 10000);
                getSubstationInfo('', '', '', '', '', '', '', 1, 10000);
            }
        }
    }

    handleOk = () => {
        let success = false;
        this.props.form.validateFields((err, values) => {
            success = !err;
            if (success) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                let { pointName, remark, testpointPurpose } = values;
                this.asyncAddOrEditPoint(pointName, remark, testpointPurpose);
            }
        });
        return success;
    };

    asyncAddOrEditPoint = async (pointName, remark, testpointPurpose) => {
        let {
            selectDeviceId,
            currentSelectTestType,
            currentTestPosition,
            selectDeviceType,
            AEPosition,
            UHFPosition,
            InfraredPosition,
        } = this.state;
        let {
            actionMenuType,
            pointInfo,
            intl: { formatMessage },
            addEditTestpointInfo,
            handlerRefresh,
            onCancel,
        } = this.props;
        let { id, testpointId, testpointInfoId } =
            actionMenuType == 2 && pointInfo ? pointInfo : this.state;
        const assetTestpointInfoId = testpointInfoId;
        if (selectDeviceType != 10) {
            currentTestPosition = '';
        } else {
            if (currentSelectTestType == 4) {
                currentTestPosition = AEPosition;
            } else if (currentSelectTestType == 7) {
                currentTestPosition = UHFPosition;
            } else if (currentSelectTestType == 12) {
                currentTestPosition = InfraredPosition;
            }
        }
        let result = await addEditTestpointInfo(
            actionMenuType === 1 ? 'add' : 'edit',
            id,
            selectDeviceId,
            pointName,
            testpointId,
            '',
            currentTestPosition,
            currentSelectTestType,
            assetTestpointInfoId,
            testpointPurpose,
            remark
        );
        if (result.success) {
            toast(
                'success',
                actionMenuType === 1
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.EditSuccess)
            );
            if (handlerRefresh) {
                handlerRefresh();
            }
            if (actionMenuType != 1) {
                onCancel();
            }
        }
        this.setState({
            confirmLoading: false,
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        let { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    };

    onCompanySelect = (value, node) => {
        this.setState({
            selectCompanyId: value,
            selectSubstationId: '',
        });
        let { getSubstationInfo } = this.props;
        getSubstationInfo(value, '', '', '', '', '', '', 1, 10000);
        this.props.form.setFieldsValue({ hiddenCompany: value });
        this.props.form.setFieldsValue({ pointSubstation: undefined });
    };

    onSubstationSelect = (value) => {
        let { getDeviceInfo } = this.props;
        let { selectCompanyId } = this.state;
        if (getDeviceInfo) {
            getDeviceInfo(value, '', '', '', selectCompanyId, '', '', '', '', 1, 10000);
        }
        this.setState({
            selectSubstationId: value,
        });
        //this.props.form.setFieldsValue({ hiddenSubstation: value });
    };

    onChangeTEVTest = (e) => {
        console.log('radio2 checked', e.target.value);
        this.setState({
            currentTestPosition: e.target.value,
        });
    };

    onUHFChangePointTest = (e) => {
        console.log('radio2 checked', e.target.value);
        this.setState({
            UHFPosition: e.target.value,
        });
    };

    onChangeAEPosition = (e) => {
        this.setState({
            AEPosition: e.target.value,
        });
    };

    onChangeInfraredPosition = (e) => {
        this.setState({
            InfraredPosition: e.target.value,
        });
    };

    testTypeChange = (value, node) => {
        this.setState({
            currentSelectTestType: value,
            editTestTypeChange: true,
            //  currentAETestType:value ==2?currentAETestType:100,
        });
    };

    handlerDevTypeChange = (value, node) => {
        this.setState({
            selectDeviceId: value,
            selectDeviceType: node.props.title,
            //  currentAETestType:100,
        });
    };

    onSubstationDefValueSet = (deviceType, testpointType, position, deviceId) => {
        if (deviceType != undefined) {
            let AEPosition, UHFPosition;
            if (testpointType == 4) {
                AEPosition = position;
            } else if (testpointType == 7) {
                UHFPosition = position;
            }
            this.setState({
                selectDeviceType: deviceType,
                currentSelectTestType: testpointType == undefined ? 0 : testpointType,
                currentTestPosition: position,
                AEPosition: AEPosition == undefined ? 10 : AEPosition,
                UHFPosition: UHFPosition == undefined ? 12 : UHFPosition,
                selectDeviceId: deviceId,
                editTestTypeChange: false,
            });
            this.props.form.setFieldsValue({ hiddenCompany: deviceType });
            // this.props.form.setFieldsValue({ hiddenSubstation: deviceType });
        }
    };

    handlerSubstationChange = (value) => {
        let { getDeviceInfo } = this.props;
        let { selectCompanyId } = this.state;
        if (getDeviceInfo) {
            getDeviceInfo(value, '', '', '', selectCompanyId, '', '', '', '', 1, 10000);
        }
        this.props.form.setFieldsValue({ pointDevName: undefined });
        this.setState({
            selectSubstationId: value,
            selectDeviceId: '',
        });
    };

    renderLayout() {
        let {
            intl: { formatMessage },
            actionMenuType,
            form: { getFieldDecorator },
            pointInfo,
            deviceInfoState: { dataSource },
            testpointInfoState: { testPointTypeList },
            substationInfoState: { substationDataSource },
        } = this.props;
        let {
            selectCompanyId,
            pointTypeList,
            selectDeviceType,
            currentSelectTestType,
            editTestTypeChange,
        } = this.state;
        let {
            id,
            testpointId,
            testpointName,
            deviceId,
            deviceName,
            substationName,
            testpointType,
            deviceType,
            position,
            companyName,
            remark,
            testpointPurpose,
        } = 2 == actionMenuType && pointInfo ? pointInfo : this.state;
        let devChildren = [],
            pointTypeChidren = [],
            tevPointTestList = [],
            uhfPointTestList = [],
            aePointTestList = [],
            substationChildren = [],
            infraredPointList = [];
        if (dataSource && dataSource.list && dataSource.list.length > 0) {
            dataSource.list.forEach((element) => {
                devChildren.push(
                    <Option key={element.deviceId} title={element.deviceType}>
                        {element.deviceName}
                    </Option>
                );
            });
        }
        if (
            substationDataSource &&
            substationDataSource.list &&
            substationDataSource.list.length > 0
        ) {
            substationDataSource.list.forEach((element) => {
                if (element && element.substationId && element.substationName) {
                    substationChildren.push(
                        <Option key={element.substationId} title={element.substationName}>
                            {element.substationName}
                        </Option>
                    );
                }
            });
        }
        if (pointTypeList && testPointTypeList && testPointTypeList.length > 0) {
            testPointTypeList.forEach((element) => {
                pointTypeChidren.push(
                    <Select.Option key={element.typeCode}>
                        {Enum.getTypeEnum(element.typeCode)}
                    </Select.Option>
                );
            });
            pointTypeList[0].TEVTestPosition.forEach((element) => {
                tevPointTestList.push({ label: element.positionName, value: element.positionType });
            });
            pointTypeList[5].UHFTestPosition.forEach((element) => {
                uhfPointTestList.push({ label: element.positionName, value: element.positionType });
            });
            pointTypeList[1].AETestPosition.forEach((element) => {
                aePointTestList.push({ label: element.positionName, value: element.positionType });
            });
            pointTypeList[7].InfraredTestPosition.forEach((element) => {
                infraredPointList.push({
                    label: element.positionName,
                    value: element.positionType,
                });
            });
        }
        return (
            <StandardForm vertical>
                <FormItem label={formatMessage(locale.TestPointFunction)}>
                    {getFieldDecorator('testpointPurpose', {
                        initialValue: isEmpty(testpointPurpose) ? '1' : `${testpointPurpose}`,
                    })(
                        <Radio.Group buttonStyle='solid' className='radioGroup'>
                            <Radio.Button value='1' className='radioButton'>
                                {formatMessage(locale.LiveDetection)}
                            </Radio.Button>
                            <Radio.Button value='2' className='radioButton'>
                                {formatMessage(locale.SmartSensor)}
                            </Radio.Button>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.TestPointName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'pointName',
                        0,
                        100,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'TestPointManagerTestpointNameReq' },
                        testpointName
                    )(
                        <Input
                            placeholder={formatMessage(locale.TestPointManagerTestpointNameReq)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.ElectricPowerCompany)}>
                    {getFieldDecorator('hiddenCompany', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.ElectricPowerCompanyTips),
                            },
                        ],
                    })(<Input type='hidden' />)}
                    {getFieldDecorator('pointCompany', {
                        initialValue: companyName,
                        rules: [
                            {
                                required: false,
                                message: formatMessage(locale.ElectricPowerCompanyTips),
                            },
                        ],
                    })(
                        <ArchiveTree
                            moduleId={'pointSelectCompany'}
                            moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                            rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            onTreeSelect={this.onCompanySelect}
                            defValue={{
                                key: testpointId,
                                value: companyName,
                            }}
                            placeholder={formatMessage(locale.ElectricPowerCompanyTips)}
                            onDefValueSet={this.onSubstationDefValueSet.bind(
                                this,
                                deviceType,
                                testpointType,
                                position,
                                deviceId
                            )}
                            disabled={actionMenuType == 2}
                            needCacheCheck={false}
                        />
                    )}
                </FormItem>

                <FormItem label={formatMessage(locale.SubstationName)}>
                    {getFieldDecorator('pointSubstation', {
                        initialValue: substationName,
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.BayManagerSubstationReq),
                            },
                        ],
                    })(
                        <Select
                            placeholder={formatMessage(locale.SubstationSelectTip)}
                            onChange={this.handlerSubstationChange}
                            disabled={actionMenuType == 2}>
                            {substationChildren}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.DeviceName)}>
                    {getFieldDecorator('pointDevName', {
                        initialValue: deviceName,
                        rules: [
                            { required: true, message: formatMessage(locale.TestPointSelectDev) },
                        ],
                    })(
                        <Select
                            placeholder={formatMessage(locale.TestPointSelectDev)}
                            onChange={this.handlerDevTypeChange}
                            disabled={actionMenuType == 2}>
                            {devChildren}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.TestPointManagerTestType)}>
                    {getFieldDecorator('pointTypeName', {
                        initialValue: `${currentSelectTestType}`,
                        rules: [
                            {
                                required: false,
                                message: formatMessage(locale.TestPointSelectTestType),
                            },
                        ],
                    })(<Select onChange={this.testTypeChange}>{pointTypeChidren}</Select>)}
                </FormItem>
                {currentSelectTestType == pointTypeList[0].pointType && selectDeviceType == 10 ? (
                    <FormItem label={formatMessage(locale.TestPointPosition)}>
                        {getFieldDecorator('tevPointTypeName', {
                            initialValue:
                                position == undefined || editTestTypeChange ? 2 : position, //position == undefined ? 2 : position, TEV
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage(locale.TestPointManagerTestpointNameReq),
                                },
                            ],
                        })(
                            <RadioGroup
                                options={tevPointTestList}
                                onChange={this.onChangeTEVTest}
                            />
                        )}
                    </FormItem>
                ) : (
                    <FormItem style={{ margin: 0, padding: 0, display: 'none' }} />
                )}
                {currentSelectTestType == pointTypeList[8].pointType && selectDeviceType == 10 ? (
                    <FormItem label={formatMessage(locale.TestPointPosition)}>
                        {getFieldDecorator('tevPointTypeName', {
                            initialValue:
                                position == undefined || editTestTypeChange ? 2 : position, //position == undefined ? 2 : position, TEV
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage(locale.TestPointManagerTestpointNameReq),
                                },
                            ],
                        })(
                            <RadioGroup
                                options={tevPointTestList}
                                onChange={this.onChangeTEVTest}
                            />
                        )}
                    </FormItem>
                ) : (
                    <FormItem style={{ margin: 0, padding: 0, display: 'none' }} />
                )}
                {currentSelectTestType == pointTypeList[1].pointType && selectDeviceType == 10 ? (
                    <FormItem label={formatMessage(locale.TestPointPosition)}>
                        {getFieldDecorator('pointAEPosition', {
                            initialValue:
                                position == undefined || editTestTypeChange ? 10 : position,
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage(locale.TestPointManagerTestpointNameReq),
                                },
                            ],
                        })(
                            <RadioGroup
                                options={aePointTestList}
                                onChange={this.onChangeAEPosition}
                            />
                        )}
                    </FormItem>
                ) : (
                    <FormItem style={{ margin: 0, padding: 0, display: 'none' }} />
                )}
                {currentSelectTestType == pointTypeList[7].pointType && selectDeviceType == 10 ? (
                    <FormItem label={formatMessage(locale.TestPointPosition)}>
                        {getFieldDecorator('pointInfraredPosition', {
                            initialValue:
                                position == undefined || editTestTypeChange ? 14 : position,
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage(locale.TestPointManagerTestpointNameReq),
                                },
                            ],
                        })(
                            <RadioGroup
                                options={infraredPointList}
                                onChange={this.onChangeInfraredPosition}
                            />
                        )}
                    </FormItem>
                ) : (
                    <FormItem style={{ margin: 0, padding: 0, display: 'none' }} />
                )}
                {currentSelectTestType == pointTypeList[5].pointType && selectDeviceType == 10 ? (
                    <FormItem label={formatMessage(locale.TestPointPosition)}>
                        {getFieldDecorator('pointUHFPosition', {
                            initialValue:
                                position == undefined || editTestTypeChange ? 12 : position,
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage(locale.TestPointManagerTestpointNameReq),
                                },
                            ],
                        })(
                            <RadioGroup
                                options={uhfPointTestList}
                                onChange={this.onUHFChangePointTest}
                            />
                        )}
                    </FormItem>
                ) : (
                    <FormItem style={{ margin: 0, padding: 0, display: 'none' }} />
                )}
                <FormItem label={formatMessage(locale.Remark)}>
                    {formItemTips(
                        getFieldDecorator,
                        'remark',
                        0,
                        200,
                        formatMessage,
                        locale,
                        { required: false, emptyHint: 'InputTip' },
                        remark
                    )(<TextArea placeholder={formatMessage(locale.RemarkTips)} />)}
                </FormItem>
            </StandardForm>
        );
    }

    render() {
        let { confirmLoading } = this.state;
        let {
            actionMenuType,
            intl: { formatMessage },
            visible,
        } = this.props;
        let title;
        let ModalContent = this.renderLayout();
        let okHandle = {};
        if (actionMenuType == 2) {
            title = formatMessage(locale.TestPointEdit);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.TestPointNew);
            okHandle = {
                onOkGo: this.handleOk,
            };
        }
        return (
            <InfoModal
                title={title}
                visible={visible}
                confirmLoading={confirmLoading}
                {...okHandle}
                onCancel={this.handleCancel}>
                {ModalContent}
            </InfoModal>
        );
    }
}
export default injectIntl(AddOrUpdatePoint);
