import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { locale } from '../../../../../pages/locale';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import StandardForm from '../../../../../components/standardForm';
import { toast } from '../../../../../components/toast';
import { injectIntl } from 'react-intl';
import { formItemTips, handleSpace } from '../../../../../utils/dom';
import InfoModal from '../../../../../containers/infoModal';
import Select from '../../../../../components/baseSelect';
import Enum from '../../../../../utils/enum';
import { isEmpty } from '../../../../../utils/common';
const FormItem = Form.Item;

@connect(
    (state) => ({
        systemState: state.alarmSettingReducer,
    }),
    (dispatch) => ({
        testPointAeAdd: (
            ruleName,
            testpointId,
            testpointName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.testPointAeAdd(
                    ruleName,
                    testpointId,
                    testpointName,
                    pdTypeThreshold,
                    pdTypeThresholdUnit,
                    pdType,
                    pdTypeSign,
                    alarmThreshold,
                    alarmThresholdUnit,
                    alarmThresholdSign,
                    alarmLevel
                )
            ),
        testPointAeUpdate: (
            id,
            ruleName,
            testpointId,
            testpointName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.testPointAeUpdate(
                    id,
                    ruleName,
                    testpointId,
                    testpointName,
                    pdTypeThreshold,
                    pdTypeThresholdUnit,
                    pdType,
                    pdTypeSign,
                    alarmThreshold,
                    alarmThresholdUnit,
                    alarmThresholdSign,
                    alarmLevel
                )
            ),
    })
)
@Form.create()
class AeDataConfigure extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = props;
        this.state = {
            compareList: [
                { key: 2, value: 2, name: '>' },
                { key: 1, value: 1, name: '=' },
                { key: 0, value: 0, name: '<' },
            ],
            unitList: [{ key: 1, value: 1, name: 'dB' }],
            pdTypes: [
                { key: 1, value: 1, name: formatMessage(locale.Normal) },
                { key: 2, value: 2, name: formatMessage(locale.Corona) },
                { key: 3, value: 3, name: formatMessage(locale.FloatingElectrode) },
                { key: 4, value: 4, name: formatMessage(locale.Void) },
                { key: 5, value: 5, name: formatMessage(locale.Surface) },
                { key: 6, value: 6, name: formatMessage(locale.Particle) },
                { key: 7, value: 7, name: formatMessage(locale.Noise) },
                { key: 8, value: 8, name: formatMessage(locale.Calibration) },
                { key: 9, value: 9, name: formatMessage(locale.Unknown) },
                { key: 10, value: 10, name: formatMessage(locale.InsufficientData) },
                { key: 11, value: 11, name: formatMessage(locale.DrillNoise) },
                { key: 12, value: 12, name: formatMessage(locale.EnergysavinglampsNoise) },
                { key: 13, value: 13, name: formatMessage(locale.FanNoise) },
                { key: 14, value: 14, name: formatMessage(locale.IgnitionNoise) },
                { key: 15, value: 15, name: formatMessage(locale.InterphoneNoise) },
                { key: 16, value: 16, name: formatMessage(locale.MicrowavesulfurNoise) },
                { key: 17, value: 17, name: formatMessage(locale.MotorNoise) },
                { key: 18, value: 18, name: formatMessage(locale.RadarNoise) },
                { key: 19, value: 19, name: formatMessage(locale.SparkleakdetectorNoise) },
                { key: 20, value: 20, name: formatMessage(locale.MobileNoise) },
                { key: 21, value: 21, name: formatMessage(locale.Pd) },
                { key: 22, value: 22, name: formatMessage(locale.Notpd) },
                { key: 23, value: 23, name: formatMessage(locale.Insulation) },
                { key: 24, value: 24, name: formatMessage(locale.MechanicalVibration) },
                { key: 25, value: 25, name: formatMessage(locale.LightNoise) },
            ],
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        visible: false, //是否显示
    };

    componentDidMount() {}

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                let { actionType } = this.props;
                if (actionType === 0) {
                    this.asyncAdd(values);
                } else {
                    this.asyncEdit(values);
                }
            }
        });
    };

    asyncAdd = async (values) => {
        let {
            pointInfo,
            testPointAeAdd,
            intl: { formatMessage },
            actionType,
            onCancel,
            onHandlerAERefresh,
        } = this.props;
        let {
            alarmLevel,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            ruleName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
        } = values;
        let { testpointId, testpointName } = pointInfo;
        let result = await testPointAeAdd(
            ruleName,
            testpointId,
            testpointName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        );
        if (result.success) {
            toast(
                'success',
                actionType === 0
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.EditSuccess)
            );
            onHandlerAERefresh();
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    };

    asyncEdit = async (values) => {
        let {
            pointInfo,
            testPointAeUpdate,
            intl: { formatMessage },
            actionType,
            onCancel,
            onHandlerAERefresh,
            ruleInfo,
        } = this.props;
        let {
            alarmLevel,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            ruleName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
        } = values;
        let { testpointId, testpointName } = pointInfo;
        let { id } = ruleInfo;
        let result = await testPointAeUpdate(
            id,
            ruleName,
            testpointId,
            testpointName,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdType,
            pdTypeSign,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        );
        if (result.success) {
            onHandlerAERefresh();
            toast(
                'success',
                actionType === 0
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.EditSuccess)
            );
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    };

    renderLayout() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
            systemState: { alarmResult },
            ruleInfo,
            actionType,
        } = this.props;
        let { compareList, unitList, pdTypes } = this.state;
        if (alarmResult && alarmResult.list && alarmResult.list.length > 0) {
            alarmResult.list.map((item) => {
                item.key = item.alarmLevel;
                item.value = item.alarmLevel;
                item.name = formatMessage(locale[Enum.getExceptionStatus(item.alarmLevel).value]);
            });
        }
        let {
            ruleName,
            pdType,
            pdTypeThreshold,
            pdTypeThresholdUnit,
            pdTypeSign,
            alarmLevel,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
        } = actionType === 1 && ruleInfo ? ruleInfo : {};
        return (
            <StandardForm vertical>
                <FormItem label={formatMessage(locale.RuleName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'ruleName',
                        0,
                        100,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'RuleNameTips' },
                        ruleName
                    )(<Input placeholder={formatMessage(locale.RuleNameTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.FingerprintPDType)}>
                    {getFieldDecorator('pdType', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.FingerprintPDTypeTips),
                            },
                        ],
                        initialValue: pdType,
                    })(
                        <Select
                            data={pdTypes}
                            placeholder={formatMessage(locale.FingerprintPDTypeTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.PdTypeThreshold)}>
                    {formItemTips(
                        getFieldDecorator,
                        'pdTypeThreshold',
                        0,
                        10,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'PdTypeThresholdTips' },
                        !isEmpty(pdTypeThreshold) ? `${pdTypeThreshold}` : '',
                        'numberAndPot',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(<Input placeholder={formatMessage(locale.PdTypeThresholdTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.PDThresholdUnit)}>
                    {getFieldDecorator('pdTypeThresholdUnit', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.PDThresholdUnitTips),
                            },
                        ],
                        initialValue: isEmpty(pdTypeThresholdUnit) ? 1 : pdTypeThresholdUnit,
                    })(
                        <Select
                            data={unitList}
                            placeholder={formatMessage(locale.PDThresholdUnitTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.ComparisonMethod)}>
                    {getFieldDecorator('pdTypeSign', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.ComparisonMethodTips),
                            },
                        ],
                        initialValue: pdTypeSign,
                    })(
                        <Select
                            data={compareList}
                            placeholder={formatMessage(locale.ComparisonMethodTips)}
                        />
                    )}
                </FormItem>

                <FormItem label={formatMessage(locale.AlarmLevel)}>
                    {getFieldDecorator('alarmLevel', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.AlarmLevelSelectTips),
                            },
                        ],
                        initialValue: alarmLevel,
                    })(
                        <Select
                            data={alarmResult && alarmResult.list ? alarmResult.list : []}
                            placeholder={formatMessage(locale.AlarmLevelSelectTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.AlarmThreshold)}>
                    {formItemTips(
                        getFieldDecorator,
                        'alarmThreshold',
                        0,
                        10,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'AlarmThresholdTips' },
                        !isEmpty(alarmThreshold) ? `${alarmThreshold}` : '',
                        'numberAndPot',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(<Input placeholder={formatMessage(locale.AlarmThresholdTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.ThresholdUnit)}>
                    {getFieldDecorator('alarmThresholdUnit', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.ThresholdUnitTips),
                            },
                        ],
                        initialValue: isEmpty(pdTypeThresholdUnit) ? 1 : alarmThresholdUnit,
                    })(
                        <Select
                            data={unitList}
                            placeholder={formatMessage(locale.ThresholdUnitTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.ComparisonMethod)}>
                    {getFieldDecorator('alarmThresholdSign', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.ComparisonMethodTips),
                            },
                        ],
                        initialValue: alarmThresholdSign,
                    })(
                        <Select
                            data={compareList}
                            placeholder={formatMessage(locale.ComparisonMethodTips)}
                        />
                    )}
                </FormItem>
            </StandardForm>
        );
    }
    //formatMessage(locale.AlarmThreshold)

    render() {
        let { confirmLoading } = this.state;
        let {
            actionType,
            intl: { formatMessage },
            visible,
            onCancel,
        } = this.props;
        let title;
        let modalContent = this.renderLayout();
        if (actionType == 1) {
            title = formatMessage(locale.Edit);
        } else {
            title = formatMessage(locale.New);
        }
        return (
            <InfoModal
                title={title}
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={() => {
                    onCancel();
                }}
                centered>
                {modalContent}
            </InfoModal>
        );
    }
}
export default injectIntl(AeDataConfigure);
