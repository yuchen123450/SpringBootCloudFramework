import React, { PureComponent } from 'react';
import { Form, Input, Radio, DatePicker, Select } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import moment from 'moment';
import { isEmpty, dislodgeLetter, dislodgeFontZero } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import Enum from '../../../../utils/enum';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import StandardForm from '../../../../components/standardForm';
import InfoModal from '../../../../containers/infoModal';
import { archiveAction } from '../../../../actions';
import { CONFIG } from '../../../../configs';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Radio.Button;

@connect(
    (state) => ({
        commonState: state.commonReducer,
        devState: state.deviceReducer,
        bayInfoState: state.bayReducer,
    }),
    (dispatch) => ({
        addEditDeviceInfo: (deviceInfo, oldDeviceInfo) =>
            dispatch(archiveAction.addEditDeviceInfo(deviceInfo, oldDeviceInfo)),
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
    })
)
@Form.create()
class AddOrEditDevice extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = props;
        this.state = {
            actionMenuType: this.props.actionMenuType,
            substationId: '',
            substationName: '',
            voltageLevel: '',
            voltageLevelName: '',
            bayId: '',
            bayName: '',
            deviceType: '',
            deviceTypeName: '',
            displayBay: true,
            operationCompanyId: '',
            operationCompanyName: '',
            structuralStyle: '',
            phase: '',
            ratedVoltageUnit: formatMessage(locale.kV),
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
    };

    componentDidMount() {
        // let { queryCommonType } = this.props;
        // queryCommonType(22);
    }

    handleOk = () => {
        let success = false;
        this.props.form.validateFields((err, values) => {
            success = !err;
            if (success) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                let { actionMenuType, deviceInfo, addEditDeviceInfo } = this.props;
                let {
                    deviceName,
                    officialSerial,
                    remark,
                    runningNumber,
                    localCompany,
                    assetsCompany,
                    assetsProperties,
                    assetsNumber,
                    phaseNumber,
                    ratedVoltage,
                    ratedCurrent,
                    ratedFrequency,
                    deviceModel,
                    manufacture,
                    factoryNumber,
                    productNumber,
                    manufactureDate,
                    putIntoOperationDate,
                    useEnvironment,
                    antifoulingGrade,
                    insulationClass,
                    runningState,
                    recentPutIntoOperationDate,
                    exitOperationDate,
                    latestTestDate,
                } = values;
                let { deviceId, id } = actionMenuType == 2 && deviceInfo ? deviceInfo : {};
                let {
                    substationId,
                    substationName,
                    voltageLevel,
                    voltageLevelName,
                    bayId,
                    bayName,
                    deviceType,
                    deviceTypeName,
                    operationCompanyId,
                    operationCompanyName,
                    structuralStyle,
                    phase,
                    ratedVoltageUnit,
                } = this.state;
                let devInfo = {
                    actionType: actionMenuType == 1 ? 'add' : 'edit',
                    id: actionMenuType == 1 ? '' : id,
                    officialSerial,
                    deviceId: actionMenuType == 1 ? '' : deviceId,
                    deviceName,
                    runningNumber: '',
                    deviceType,
                    deviceTypeName,
                    substationId,
                    substationName,
                    voltageLevel,
                    voltageLevelName,
                    bayId: actionMenuType == 1 && deviceType != 32 ? '' : bayId,
                    bayName: actionMenuType == 1 && deviceType != 32 ? '' : bayName,
                    deviceId,
                    runningNumber,
                    localCompany,
                    assetsCompany,
                    assetsProperties,
                    assetsNumber,
                    phaseNumber: isEmpty(phase) ? '' : phase == 0 ? 3 : 1,
                    phase,
                    ratedVoltage: isEmpty(ratedVoltage)
                        ? ''
                        : dislodgeFontZero(ratedVoltage) + ratedVoltageUnit,
                    ratedCurrent: isEmpty(ratedCurrent) ? '' : `${dislodgeFontZero(ratedCurrent)}A`,
                    ratedFrequency: isEmpty(ratedFrequency)
                        ? ''
                        : `${dislodgeFontZero(ratedFrequency)}Hz`,
                    deviceModel,
                    manufacture,
                    factoryNumber,
                    productNumber,
                    manufactureDate,
                    putIntoOperationDate,
                    useEnvironment,
                    antifoulingGrade,
                    insulationClass,
                    runningState,
                    recentPutIntoOperationDate,
                    exitOperationDate,
                    structuralStyle,
                    operationCompanyId,
                    operationCompanyName,
                    latestTestDate,
                    remark,
                };
                let oldDeviceInfo = actionMenuType == 1 ? devInfo : deviceInfo;
                this.acyncaddEditDeviceInfo(
                    devInfo,
                    addEditDeviceInfo,
                    actionMenuType,
                    oldDeviceInfo
                );
            }
        });
        return success;
    };

    acyncaddEditDeviceInfo = async (devInfo, addEditDeviceInfo, actionMenuType, oldDeviceInfo) => {
        let {
            handlerRefresh,
            intl: { formatMessage },
            onCancel,
        } = this.props;
        let result = await addEditDeviceInfo(devInfo, oldDeviceInfo);
        if (result.success) {
            toast(
                'success',
                actionMenuType == 1
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

    devTypeChange = (value, node) => {
        this.setState({
            deviceType: value,
            deviceTypeName: node.props.children,
            displayBay: value == 32,
        });
        if (value == 32) {
            let { getBayInfo } = this.props;
            let { substationId, voltageLevel, deviceType, substationName } = this.state;
            getBayInfo(substationId, '', '', substationName, voltageLevel, '', '', value, 1, 10000);
            // this.props.form.setFieldsValue({ showbay: value });
            // this.props.form.setFieldsValue({ hiddenbay: '' });
        }
    };

    onVoltageChange = (value, node) => {
        let { deviceType } = this.state;
        this.setState({
            voltageLevel: value,
            voltageLevelName: node.props.children,
        });
        if (deviceType == 32) {
            let { getBayInfo } = this.props;
            let { substationId, deviceType, substationName } = this.state;
            getBayInfo(substationId, '', '', substationName, value, '', '', deviceType, 1, 10000);
        }
        this.props.form.setFieldsValue({ substationBay: '' });
    };

    onBayChange = (value, node) => {
        this.setState({
            bayId: value,
            bayName: node.props.children,
        });
    };

    onSubstationSelect = (value, node) => {
        let { deviceType } = this.state;
        switch (node.type) {
            case 'substation':
                this.setState({
                    substationName: node.title,
                    substationId: node.key,
                });
                this.props.form.setFieldsValue({ hiddenbay: value });
                if (deviceType == 32) {
                    let { getBayInfo } = this.props;
                    let { voltageLevel, deviceType, substationName } = this.state;
                    getBayInfo(
                        node.key,
                        '',
                        '',
                        substationName,
                        voltageLevel,
                        '',
                        '',
                        deviceType,
                        1,
                        10000
                    );
                }
                break;
            case 'bay':
                let bayId = node.key;
                bayId = bayId.includes('丨')
                    ? bayId.substring(bayId.indexOf('丨') + 1, bayId.length)
                    : '';
                this.setState({
                    bayName: node.title,
                    bayId,
                });
                // this.props.form.setFieldsValue({ showbay: value });
                break;
            default:
                break;
        }
        this.props.form.setFieldsValue({ substationBay: '' });
    };

    onSubstatiionDefValueSet = (
        substationId,
        substationName,
        voltageLevel,
        voltageLevelName,
        deviceType,
        phase,
        operationCompanyId,
        operationCompanyName,
        structuralStyle,
        bayType,
        bayName,
        bayId
    ) => {
        this.setState({
            substationId,
            substationName,
            voltageLevel,
            voltageLevelName,
            deviceType,
            phase,
            operationCompanyId,
            operationCompanyName,
            structuralStyle,
            bayType,
            bayName,
            bayId,
        });
        this.props.form.setFieldsValue({ hiddenbay: substationName });
        let { getBayInfo } = this.props;
        getBayInfo(
            substationId,
            bayId,
            '',
            substationName,
            voltageLevel,
            '',
            bayType,
            deviceType,
            1,
            10000
        );
    };

    onBayDefValueSet = (deviceType, voltageLevel, voltageLevelName, bayType, bayName) => {
        this.setState({
            deviceType,
            voltageLevel,
            voltageLevelName,
            bayType,
            bayName,
        });
        //this.props.form.setFieldsValue({ showbay: bayName });
    };

    voltageSearch = (value) => {
        alert(value);
    };

    onSelect = (value, option) => {
        alert(value);
    };

    onDevBayTreeSelectExpand = (title, value, type) => {
        switch (type) {
            case 'substation':
                this.setState({
                    substationName: title,
                    substationId: value,
                    bayId: '',
                    bayName: '',
                });
                break;
            case 'bay':
                this.setState({
                    bayName: title,
                    bayId: value,
                });
                break;
            default:
                break;
        }
        // this.props.form.setFieldsValue({ showbay: title });
    };

    _onOperateTreeSelect = (value, node) => {
        if (node.type == 'company') {
            this.setState({
                operationCompanyId: node.key,
                operationCompanyName: node.title,
            });
        }
    };

    onDevOperateCompanyValueSet = (operationCompanyId, operationCompanyName) => {
        this.setState({
            operationCompanyId,
            operationCompanyName,
        });
    };

    deviceStructuralChange = (value) => {
        this.setState({
            structuralStyle: value,
        });
    };

    devPhaseChange = (value) => {
        this.setState({
            phase: value,
        });
    };

    prefixRVChange = (value) => {
        this.setState({
            ratedVoltageUnit: value,
        });
    };

    // checkEmpty = (time) => (time === '' || time === undefined || time === null)

    renderLayout() {
        let {
            intl: { formatMessage, formats },
            actionMenuType,
            form: { getFieldDecorator },
            deviceInfo,
            devState: {
                commonTypeVoltageLevel,
                commonTypeDeviceType,
                commonStructualStyle,
                commonPhase,
            },
            bayInfoState: { dataSource },
        } = this.props;

        let children = [],
            devTypeList = [],
            structualList = [],
            phaseList = [],
            childrenBay = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Option key={element.value}>{element.name}</Option>);
            });
        }
        if (commonTypeDeviceType && commonTypeDeviceType.length > 0) {
            commonTypeDeviceType.forEach((element) => {
                devTypeList.push(
                    <Option key={element.typeCode}>
                        {Enum.getDeviceTypeEnum(element.typeCode)}
                    </Option>
                );
            });
        }
        if (commonStructualStyle && commonStructualStyle.length > 0) {
            commonStructualStyle.forEach((element) => {
                structualList.push(
                    <Option key={element.typeCode}>
                        {Enum.getStructureTypeByCode(element.typeCode)}
                    </Option>
                );
            });
        }
        if (commonPhase && commonPhase.length > 0) {
            commonPhase.forEach((element) => {
                phaseList.push(
                    <Option key={element.typeCode}>{Enum.getPhaseByCode(element.typeCode)}</Option>
                );
            });
        }
        if (dataSource && dataSource.list && dataSource.list.length > 0) {
            dataSource.list.forEach((item) => {
                childrenBay.push(<Option key={item.bayId}>{item.bayName}</Option>);
            });
        }
        let {
            bayId,
            bayName,
            voltageLevel,
            voltageLevelName,
            bayType,
            officialSerial,
            id,
            substationId,
            substationName,
            runningNumber,
            runningState,
            phase,
            phaseNumber,
            useEnvironment,
            assetsCompany,
            assetsProperties,
            ratedVoltage,
            deviceModel,
            manufacture,
            productNumber,
            manufactureDate,
            putIntoOperationDate,
            recentPutIntoOperationDate,
            exitOperationDate,
            antifoulingGrade,
            latestTestDate,
            insulationClass,
            deviceType,
            assetsNumber,
            operationCompanyId,
            operationCompanyName,
            structuralStyle,
            deviceName,
            ratedCurrent,
            ratedFrequency,
            remark,
            factoryNumber,
            ratedVoltageUnit,
        } = 2 == actionMenuType && deviceInfo ? deviceInfo : this.state;
        const prefixRVSelector = getFieldDecorator('prefixRVSelector', {
            initialValue: isEmpty(ratedVoltage)
                ? formatMessage(locale.kV)
                : ratedVoltage.endsWith(formatMessage(locale.kV))
                ? formatMessage(locale.kV)
                : formatMessage(locale.V),
        })(
            <Select onChange={this.prefixRVChange}>
                <Select.Option value={formatMessage(locale.kV)} key={formatMessage(locale.kV)}>
                    {formatMessage(locale.kV)}
                </Select.Option>
                <Select.Option value={formatMessage(locale.V)} key={formatMessage(locale.V)}>
                    {formatMessage(locale.V)}
                </Select.Option>
            </Select>
        );
        const prefixDRSelector = getFieldDecorator('prefixDRSelector', {
            initialValue: formatMessage(locale.A),
        })(
            <Select onChange={this.prefixDRChange}>
                <Select.Option value={formatMessage(locale.A)} key='A'>
                    {formatMessage(locale.A)}
                </Select.Option>
            </Select>
        );
        const prefixDRFSelector = getFieldDecorator('prefixDRFSelector', {
            initialValue: formatMessage(locale.Hz),
        })(
            <Select onChange={this.prefixDRFChange}>
                <Select.Option value={formatMessage(locale.Hz)} key='Hz'>
                    {formatMessage(locale.Hz)}
                </Select.Option>
            </Select>
        );
        let formItem = [
            <FormItem key='deviceName' label={formatMessage(locale.DeviceName)}>
                {formItemTips(
                    getFieldDecorator,
                    'deviceName',
                    0,
                    90,
                    formatMessage,
                    locale,
                    { required: true, emptyHint: 'DeviceNameReq' },
                    deviceName
                )(<Input placeholder={formatMessage(locale.DeviceNameReq)} />)}
            </FormItem>,
            <FormItem key='devType' label={formatMessage(locale.DeviceType)}>
                {getFieldDecorator('devType', {
                    initialValue: isEmpty(deviceType) ? undefined : deviceType,
                    rules: [
                        {
                            required: true,
                            message: formatMessage(locale.DeviceManagerSelectTypes),
                        },
                    ],
                })(
                    <Select
                        onChange={this.devTypeChange}
                        placeholder={formatMessage(locale.DeviceManagerSelectTypes)}>
                        {devTypeList}
                    </Select>
                )}
            </FormItem>,
            <FormItem key='hiddenbay' label={formatMessage(locale.BayManagerSubstation)}>
                {getFieldDecorator('hiddenbay', {
                    rules: [
                        {
                            required: true,
                            message: formatMessage(locale.BayManagerSubstationReq),
                        },
                    ],
                })(<Input type='hidden' />)}
                {getFieldDecorator('substation', {
                    initialValue: '',
                    rules: [
                        { required: false, message: formatMessage(locale.SubstationSelectTip) },
                    ],
                })(
                    <ArchiveTree
                        moduleId={'archiveDev'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.SUBSTATION}
                        onTreeSelect={this.onSubstationSelect}
                        disabledType={[ARCHIVE_NODE_TYPE.COMPANY]}
                        placeholder={formatMessage(locale.SubstationSelectTip)}
                        defValue={{
                            key: id,
                            value: substationName,
                        }}
                        onTreeSelectExpand={this.onDevBayTreeSelectExpand.bind(this)}
                        onDefValueSet={this.onSubstatiionDefValueSet.bind(
                            this,
                            substationId,
                            substationName,
                            voltageLevel,
                            voltageLevelName,
                            deviceType,
                            phase,
                            operationCompanyId,
                            operationCompanyName,
                            structuralStyle,
                            bayType,
                            bayName,
                            bayId
                        )}
                    />
                )}
            </FormItem>,
            <FormItem key='voltageLevel' label={formatMessage(locale.VoltageClass)}>
                {getFieldDecorator('voltageLevel', {
                    initialValue: isEmpty(voltageLevel) ? undefined : `${voltageLevel}`,
                    rules: [{ required: true, message: formatMessage(locale.VoltageClassTip) }],
                })(
                    <Select
                        onChange={this.onVoltageChange}
                        placeholder={formatMessage(locale.VoltageClassTip)}>
                        {children}
                    </Select>
                )}
            </FormItem>,
            <FormItem key='runningNumber' label={formatMessage(locale.RunNum)}>
                {formItemTips(
                    getFieldDecorator,
                    'runningNumber',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    runningNumber
                )(<Input placeholder={formatMessage(locale.DeviceRunningNumTips)} />)}
            </FormItem>,
            <FormItem
                key='operatorName'
                label={formatMessage(locale.SubstationManagerOperatorName)}>
                {getFieldDecorator('operatorName', {
                    initialValue: null,
                    rules: [
                        {
                            required: false,
                            message: formatMessage(locale.SubstationManagerOperatorNameTips),
                        },
                    ],
                })(
                    <ArchiveTree
                        moduleId={'operatorName'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this._onOperateTreeSelect}
                        placeholder={formatMessage(locale.SubstationManagerOperatorNameTips)}
                        defValue={{
                            key: operationCompanyId,
                            value: operationCompanyName,
                        }}
                        onDefValueSet={this.onDevOperateCompanyValueSet.bind(
                            this,
                            operationCompanyId,
                            operationCompanyName
                        )}
                    />
                )}
            </FormItem>,
            <FormItem key='assetsCompany' label={formatMessage(locale.SubstationManagerAssetUnit)}>
                {formItemTips(
                    getFieldDecorator,
                    'assetsCompany',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    assetsCompany
                )(<Input placeholder={formatMessage(locale.DeviceAssetUnitTips)} />)}
            </FormItem>,
            <FormItem key='assetsNumber' label={formatMessage(locale.DeviceAssetsNumber)}>
                {formItemTips(
                    getFieldDecorator,
                    'assetsNumber',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    assetsNumber
                )(<Input placeholder={formatMessage(locale.DeviceAssetsNumberTips)} />)}
            </FormItem>,
            <FormItem key='structuralStyle' label={formatMessage(locale.DeviceStructuralStyle)}>
                {getFieldDecorator('structuralStyle', {
                    initialValue: isEmpty(structuralStyle) ? undefined : `${structuralStyle}`,
                })(
                    <Select
                        placeholder={formatMessage(locale.DeviceStructuralStyleTips)}
                        onChange={this.deviceStructuralChange}>
                        {structualList}
                    </Select>
                )}
            </FormItem>,
            <FormItem key='phase' label={formatMessage(locale.PhaseIdentification)}>
                {getFieldDecorator('phase', {
                    initialValue: isEmpty(phase) ? undefined : phase,
                })(
                    <Select
                        placeholder={formatMessage(locale.DevicePhaseTips)}
                        onChange={this.devPhaseChange}>
                        {phaseList}
                    </Select>
                )}
            </FormItem>,
            <FormItem key='deviceModel' label={formatMessage(locale.DeviceModelNumber)}>
                {formItemTips(
                    getFieldDecorator,
                    'deviceModel',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    deviceModel
                )(<Input placeholder={formatMessage(locale.DeviceAssetsDeviceModelTips)} />)}
            </FormItem>,
            <FormItem key='manufacture' label={formatMessage(locale.DeviceManufacture)}>
                {formItemTips(
                    getFieldDecorator,
                    'manufacture',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    manufacture
                )(<Input placeholder={formatMessage(locale.DeviceManufactureTips)} />)}
            </FormItem>,
            <FormItem key='factoryNumber' label={formatMessage(locale.DeviceFactoryNumber)}>
                {formItemTips(
                    getFieldDecorator,
                    'factoryNumber',
                    0,
                    100,
                    formatMessage,
                    locale,
                    false,
                    factoryNumber
                )(<Input placeholder={formatMessage(locale.DeviceFactoryNumberTips)} />)}
            </FormItem>,
            <FormItem key='manufactureDate' label={formatMessage(locale.DeviceManufactureDate)}>
                {getFieldDecorator('manufactureDate', {
                    initialValue: isEmpty(manufactureDate) ? undefined : moment(manufactureDate),
                })(<DatePicker className='datePicker' format={formats.date} />)}
            </FormItem>,
            <FormItem key='putIntoOperationDate' label={formatMessage(locale.UseDate)}>
                {getFieldDecorator('putIntoOperationDate', {
                    initialValue: isEmpty(putIntoOperationDate)
                        ? undefined
                        : moment(putIntoOperationDate),
                })(<DatePicker className='datePicker' format={formats.date} />)}
            </FormItem>,
            <FormItem
                key='recentPutIntoOperationDate'
                label={formatMessage(locale.DeviceRecentPutIntoOperationDate)}>
                {getFieldDecorator('recentPutIntoOperationDate', {
                    initialValue: isEmpty(recentPutIntoOperationDate)
                        ? undefined
                        : moment(recentPutIntoOperationDate),
                })(<DatePicker className='datePicker' format={formats.date} />)}
            </FormItem>,
            <FormItem key='ratedVoltage' label={formatMessage(locale.DeviceRatedVoltage)}>
                {formItemTips(
                    getFieldDecorator,
                    'ratedVoltage',
                    0,
                    20 -
                        (ratedVoltageUnit
                            ? ratedVoltageUnit.length
                            : this.state.ratedVoltageUnit.length),
                    formatMessage,
                    locale,
                    false,
                    !isEmpty(ratedVoltage) ? dislodgeLetter(ratedVoltage) : '',
                    'numberAndPot',
                    formatMessage(locale.NumberAndPotTips),
                    true
                )(
                    <Input
                        addonAfter={prefixRVSelector}
                        placeholder={formatMessage(locale.SubstationRatedVoltage)}
                    />
                )}
            </FormItem>,
            <FormItem key='ratedCurrent' label={formatMessage(locale.DeviceRatedCurrent)}>
                {formItemTips(
                    getFieldDecorator,
                    'ratedCurrent',
                    0,
                    19,
                    formatMessage,
                    locale,
                    false,
                    !isEmpty(ratedCurrent) ? dislodgeLetter(ratedCurrent) : '',
                    'numberAndPot',
                    formatMessage(locale.NumberAndPotTips),
                    true
                )(
                    <Input
                        addonAfter={prefixDRSelector}
                        placeholder={formatMessage(locale.SubstationRatedCurrent)}
                    />
                )}
            </FormItem>,
            <FormItem key='ratedFrequency' label={formatMessage(locale.DeviceRatedFrequency)}>
                {formItemTips(
                    getFieldDecorator,
                    'ratedFrequency',
                    0,
                    18,
                    formatMessage,
                    locale,
                    false,
                    !isEmpty(ratedFrequency) ? dislodgeLetter(ratedFrequency) : '',
                    'numberAndPot',
                    formatMessage(locale.NumberAndPotTips),
                    true
                )(
                    <Input
                        addonAfter={prefixDRFSelector}
                        placeholder={formatMessage(locale.SubstationRatedFrequency)}
                    />
                )}
            </FormItem>,
            <FormItem key='useEnvironment' label={formatMessage(locale.DeviceUseEnvironment)}>
                {formItemTips(
                    getFieldDecorator,
                    'useEnvironment',
                    0,
                    20,
                    formatMessage,
                    locale,
                    false,
                    useEnvironment
                )(<Input placeholder={formatMessage(locale.DeviceUseEnvironmentTips)} />)}
            </FormItem>,
        ];

        // 指定位置插入
        formItem.splice(
            4,
            0,
            this.state.deviceType == 32 ? (
                <FormItem
                    key='substationBay'
                    label={formatMessage(locale.DeviceManagerSelectSubstationBay)}>
                    {getFieldDecorator('substationBay', {
                        initialValue: deviceInfo.deviceType == 32 ? bayName : '',
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.DeviceManagerSelectSubstationBayTips),
                            },
                        ],
                    })(<Select onChange={this.onBayChange}>{childrenBay}</Select>)}
                </FormItem>
            ) : (
                <FormItem key='substationBay' style={{ margin: 0, padding: 0, display: 'none' }} />
            )
        );

        if (CONFIG.name !== 'PMDT') {
            formItem.concat([
                <FormItem
                    key='assetsProperties'
                    label={formatMessage(locale.SubstationManagerNatureOfAssets)}>
                    {formItemTips(
                        getFieldDecorator,
                        'assetsProperties',
                        0,
                        100,
                        formatMessage,
                        locale,
                        false,
                        assetsProperties
                    )(
                        <Input
                            placeholder={formatMessage(locale.DeviceManagerNatureOfAssetsTips)}
                        />
                    )}
                </FormItem>,
                <FormItem key='runningState' label={formatMessage(locale.DeviceRunningState)}>
                    {formItemTips(
                        getFieldDecorator,
                        'runningState',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        runningState
                    )(<Input placeholder={formatMessage(locale.DeviceRunningStateTips)} />)}
                </FormItem>,
                <FormItem key='officialSerial' label={formatMessage(locale.OfficialSerial)}>
                    {formItemTips(
                        getFieldDecorator,
                        'officialSerial',
                        0,
                        64,
                        formatMessage,
                        locale,
                        {
                            required: false,
                            emptyHint: 'OfficialSerial',
                            specialSymbolPattern: 'illegalWithOutComma',
                        },
                        officialSerial
                    )(<Input placeholder={formatMessage(locale.SubstationInputSerial)} />)}
                </FormItem>,
                <FormItem
                    key='exitOperationDate'
                    label={formatMessage(locale.SubstationManagerReturnDate)}>
                    {getFieldDecorator('exitOperationDate', {
                        initialValue: isEmpty(exitOperationDate)
                            ? undefined
                            : moment(exitOperationDate),
                    })(<DatePicker className='datePicker' format={formats.date} />)}
                </FormItem>,
                <FormItem key='productNumber' label={formatMessage(locale.DeviceProductNumber)}>
                    {formItemTips(
                        getFieldDecorator,
                        'productNumber',
                        0,
                        100,
                        formatMessage,
                        locale,
                        false,
                        productNumber
                    )(<Input placeholder={formatMessage(locale.DeviceProductNumberTips)} />)}
                </FormItem>,
                <FormItem key='latestTestDate' label={formatMessage(locale.DeviceLatestTestDate)}>
                    {getFieldDecorator('latestTestDate', {
                        initialValue: isEmpty(latestTestDate) ? undefined : moment(latestTestDate), //moment(latestTestDate),
                    })(<DatePicker className='datePicker' format={formats.date} />)}
                </FormItem>,
                <FormItem
                    key='antifoulingGrade'
                    label={formatMessage(locale.DeviceAntifoulingGrade)}>
                    {formItemTips(
                        getFieldDecorator,
                        'antifoulingGrade',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        antifoulingGrade
                    )(<Input placeholder={formatMessage(locale.DeviceAntifoulingGradeTips)} />)}
                </FormItem>,
                <FormItem key='insulationClass' label={formatMessage(locale.DeviceInsulationClass)}>
                    {formItemTips(
                        getFieldDecorator,
                        'insulationClass',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        insulationClass
                    )(<Input placeholder={formatMessage(locale.DeviceInsulationClassTips)} />)}
                </FormItem>,
            ]);
        }
        formItem.push(
            <FormItem key='remark' label={formatMessage(locale.Remark)}>
                {formItemTips(
                    getFieldDecorator,
                    'remark',
                    0,
                    200,
                    formatMessage,
                    locale,
                    false,
                    remark
                )(<TextArea placeholder={formatMessage(locale.RemarkTips)} />)}
            </FormItem>
        );
        return (
            <StandardForm vertical primary={[0, 1, 2, 3, 4]}>
                {formItem}
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
            title = formatMessage(locale.DeviceManagerEdit);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.DeviceManagerNew);
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
export default injectIntl(AddOrEditDevice);
