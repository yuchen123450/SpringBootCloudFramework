import React, { PureComponent } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import StandardForm from '../../../../components/standardForm';
import InfoModal from '../../../../containers/infoModal';
import { toast } from '../../../../components/toast';
import { archiveAction } from '../../../../actions';
import Enum from '../../../../utils/enum';
import { isEmpty } from '../../../../utils/common';
import { formItemTips } from '../../../../utils/dom';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Radio.Button;

@connect(
    (state) => ({
        commonState: state.commonReducer,
        bayState: state.bayReducer,
    }),
    (dispatch) => ({
        addEditBayInfo: (addBayInfo, oldBayInfo) =>
            dispatch(archiveAction.addEditBayInfo(addBayInfo, oldBayInfo)),
    })
)
@Form.create()
class AddOrUpdateBay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            actionMenuType: this.props.actionMenuType,
            bayTypeShow: true,
            substationId: '',
            substationName: '',
            voltageLevel: '',
            voltageLevelName: '',
            devType: 32,
            bayType: 1,
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        bayTypeShow: true, //间隔类型是否显示(只有GIS显示间隔类型)
        substationId: '', //变电站ID
        substationName: '', //变电站名称
        voltageLevel: '', //电压等级
        voltageLevelName: '', //电压等级名称
        devType: 32, //设备类型
        bayType: 1, //间隔类型
    };

    componentDidMount() {
        // let { queryCommonType } = this.props;
        // queryCommonType(22);
    }

    handleOk = () => {
        let {
            actionMenuType,
            bayInfo,
            bayState: { commonBayType },
            form: { validateFields },
            intl: { formatMessage },
        } = this.props;
        let {
            substationId,
            substationName,
            voltageLevel,
            voltageLevelName,
            devType,
            bayType,
        } = this.state;
        let success = false;
        validateFields((err, values) => {
            success = !err;
            if (success) {
                this.setState({ confirmLoading: true });
                let { bayName, officialSerial, remark } = values;
                let { id, bayId, bayIndex, deviceType, createTime, modifyTime } =
                    actionMenuType == 2 && bayInfo ? bayInfo : {};
                let bayTypeInfo = [];
                if (commonBayType && commonBayType.length > 0) {
                    commonBayType.forEach((item) => {
                        bayTypeInfo.push({
                            index: item.typeCode,
                            type: item.typeCode,
                            bayTypeName: item.typeName,
                        });
                    });
                }
                let addBayInfo = {
                    actionType: actionMenuType === 1 ? 'add' : 'edit',
                    id: actionMenuType === 1 ? '' : id,
                    officialSerial,
                    bayId: actionMenuType === 1 ? '' : bayId,
                    bayName,
                    substationId,
                    substationName,
                    bayType,
                    bayTypeName: bayTypeInfo[bayType - 1].bayTypeName,
                    bayIndex: bayIndex,
                    voltageLevel,
                    voltageLevelName,
                    deviceType: actionMenuType == 1 ? devType : deviceType,
                    deviceTypeName: formatMessage(locale.CombinedElectricAppliance),
                    createTime,
                    modifyTime,
                    remark,
                };
                let oldBayInfo = actionMenuType === 1 ? addBayInfo : bayInfo;
                this.asyncAddEditBayInfo(addBayInfo, actionMenuType, oldBayInfo);
            }
        });
        return success;
    };

    asyncAddEditBayInfo = async (addBayInfo, actionMenuType, oldBayInfo) => {
        let {
            addEditBayInfo,
            handlerRefresh,
            intl: { formatMessage },
            onCancel,
        } = this.props;
        let result = await addEditBayInfo(addBayInfo, oldBayInfo);
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

    bayTypeChange = (value, node) => {
        this.setState({
            bayType: value,
        });
    };

    onVoltageChange = (value, node) => {
        this.setState({
            voltageLevel: value,
            voltageLevelName: node.props.children,
        });
    };

    onSubstationSelect = (value, node) => {
        switch (node.type) {
            case 'substation':
                this.setState({
                    substationId: node.key,
                    substationName: node.title,
                });
                this.props.form.setFieldsValue({ hiddenbay: value });
                break;
            default:
                break;
        }
    };

    onSubstatiionDefValueSet = (substationId, substationName, voltageLevel, voltageLevelName) => {
        this.setState({
            substationId,
            substationName,
            voltageLevel,
            voltageLevelName,
        });
        this.props.form.setFieldsValue({ hiddenbay: substationName });
    };

    // checkElements = (value) => (value === '' || value === undefined || value === null);

    renderLayout() {
        let {
            intl: { formatMessage },
            actionMenuType,
            form: { getFieldDecorator },
            bayInfo,
            bayState: { commonTypeVoltageLevel, commonBayType },
        } = this.props;
        let children = [],
            bayTypeList = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Option key={element.value}>{element.name}</Option>);
            });
        }
        if (commonBayType && commonBayType.length > 0) {
            commonBayType.forEach((element) => {
                bayTypeList.push(
                    <Option key={element.typeCode}>{Enum.getBayTypeName(element.typeCode)}</Option>
                );
            });
        }
        let {
            bayName,
            voltageLevel,
            voltageLevelName,
            bayType,
            officialSerial,
            id,
            substationId,
            substationName,
            remark,
        } = 2 == actionMenuType && bayInfo ? bayInfo : {};
        return (
            <StandardForm vertical primary={[0, 1, 2, 3]}>
                <FormItem label={formatMessage(locale.BayName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'bayName',
                        0,
                        100,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'BayNameReq' },
                        bayName
                    )(<Input placeholder={formatMessage(locale.BayNameReq)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.BayType)}>
                    {getFieldDecorator('bayType', {
                        initialValue: isEmpty(bayType) ? undefined : `${bayType}`,
                        rules: [{ required: true, message: formatMessage(locale.BayTypeReq) }],
                    })(
                        <Select
                            onChange={this.bayTypeChange}
                            placeholder={formatMessage(locale.BayTypeReq)}>
                            {bayTypeList}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.BayManagerSubstation)}>
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
                            {
                                required: false,
                                message: formatMessage(locale.BayManagerSubstationReq),
                            },
                        ],
                    })(
                        <ArchiveTree
                            moduleId={'bayCompany'}
                            moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                            rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            leafNodeType={ARCHIVE_NODE_TYPE.SUBSTATION}
                            onTreeSelect={this.onSubstationSelect}
                            disabledType={[ARCHIVE_NODE_TYPE.COMPANY]}
                            placeholder={formatMessage(locale.BayManagerSubstationReq)}
                            defValue={{
                                key: id,
                                value: substationName,
                            }}
                            onDefValueSet={this.onSubstatiionDefValueSet.bind(
                                this,
                                substationId,
                                substationName,
                                voltageLevel,
                                voltageLevelName
                            )}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.VoltageClass)}>
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
                </FormItem>
                <FormItem label={formatMessage(locale.OfficialSerial)}>
                    {formItemTips(
                        getFieldDecorator,
                        'officialSerial',
                        0,
                        100,
                        formatMessage,
                        locale,
                        {
                            required: false,
                            emptyHint: 'SubstationInputSerial',
                            specialSymbolPattern: 'illegalWithOutComma',
                        },
                        officialSerial
                    )(<Input placeholder={formatMessage(locale.SubstationInputSerial)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.Remark)}>
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
            title = formatMessage(locale.BayManagerEdit);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.BayManagerCreate);
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
export default injectIntl(AddOrUpdateBay);
