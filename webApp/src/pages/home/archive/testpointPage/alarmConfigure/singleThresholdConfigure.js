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
        singleThresholdAdd: (
            testpointType,
            ruleName,
            testpointId,
            testpointName,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.singleThresholdAdd(
                    testpointType,
                    ruleName,
                    testpointId,
                    testpointName,
                    alarmThreshold,
                    alarmThresholdUnit,
                    alarmThresholdSign,
                    alarmLevel
                )
            ),
        singleThresholdUpdate: (
            id,
            testpointType,
            ruleName,
            testpointId,
            testpointName,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.singleThresholdUpdate(
                    id,
                    testpointType,
                    ruleName,
                    testpointId,
                    testpointName,
                    alarmThreshold,
                    alarmThresholdUnit,
                    alarmThresholdSign,
                    alarmLevel
                )
            ),
    })
)
@Form.create()
class SingleThresholdConfigure extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            compareList: [
                { key: 2, value: 2, name: '>' },
                { key: 1, value: 1, name: '=' },
                { key: 0, value: 0, name: '<' },
            ],
            unitList: [{ key: 1, value: 1, name: 'dB' }],
            unitTempList: [{ key: 17, value: 17, name: '℃' }],
            currentTestpointId: '',
        };
    }

    static defaultProps = {};

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
            singleThresholdAdd,
            intl: { formatMessage },
            actionType,
            onCancel,
            onHandlerRefresh,
        } = this.props;
        let {
            alarmLevel,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            ruleName,
        } = values;
        let { testpointType, testpointId, testpointName } = pointInfo;
        let result = await singleThresholdAdd(
            testpointType,
            ruleName,
            testpointId,
            testpointName,
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
            onHandlerRefresh();
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    };

    asyncEdit = async (values) => {
        let {
            pointInfo,
            singleThresholdUpdate,
            intl: { formatMessage },
            actionType,
            onCancel,
            ruleInfo,
            onHandlerRefresh,
        } = this.props;
        let {
            alarmLevel,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            ruleName,
        } = values;
        let { testpointType, testpointId, testpointName } = pointInfo;
        let { id } = ruleInfo;
        let result = await singleThresholdUpdate(
            id,
            testpointType,
            ruleName,
            testpointId,
            testpointName,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
            alarmLevel
        );
        if (result.success) {
            onHandlerRefresh();
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
            pointInfo,
        } = this.props;
        let {
            alarmLevel,
            ruleName,
            alarmThreshold,
            alarmThresholdUnit,
            alarmThresholdSign,
        } = ruleInfo ? ruleInfo : {};
        let { testpointType } = pointInfo;
        let { compareList, unitList, unitTempList } = this.state;
        if (alarmResult && alarmResult.list && alarmResult.list.length > 0) {
            alarmResult.list.map((item) => {
                item.key = item.alarmLevel;
                item.value = item.alarmLevel;
                item.name = formatMessage(locale[Enum.getExceptionStatus(item.alarmLevel).value]);
            });
        }
        let units = testpointType === 26 ? unitTempList : unitList;
        return (
            <StandardForm vertical>
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
                        initialValue: isEmpty(alarmThresholdUnit)
                            ? testpointType === 26
                                ? 17
                                : 1
                            : alarmThresholdUnit,
                    })(
                        <Select
                            data={units}
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
                centered
                destroyOnClose>
                {modalContent}
            </InfoModal>
        );
    }
}
export default injectIntl(SingleThresholdConfigure);
