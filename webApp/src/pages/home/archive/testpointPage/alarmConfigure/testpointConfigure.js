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
const FormItem = Form.Item;

@connect(
    (state) => ({
        systemState: state.alarmSettingReducer,
    }),
    (dispatch) => ({
        testPointRuleAdd: (
            ruleName,
            testpointId,
            testpointName,
            testpointType,
            totalCount,
            abnormalCount,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.testPointRuleAdd(
                    ruleName,
                    testpointId,
                    testpointName,
                    testpointType,
                    totalCount,
                    abnormalCount,
                    alarmLevel
                )
            ),
        testPointRuleUpdate: (
            id,
            ruleName,
            testpointId,
            testpointName,
            testpointType,
            totalCount,
            abnormalCount,
            alarmLevel
        ) =>
            dispatch(
                archiveAction.testPointRuleUpdate(
                    id,
                    ruleName,
                    testpointId,
                    testpointName,
                    testpointType,
                    totalCount,
                    abnormalCount,
                    alarmLevel
                )
            ),
    })
)
@Form.create()
class TestpointConfigure extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = props;
        this.state = {
            value: formatMessage(locale.Warning),
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
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
            testPointRuleAdd,
            intl: { formatMessage },
            actionType,
            onCancel,
            onHandlerTevRulesRefresh,
        } = this.props;
        let { alarmLevel, totalCount, abnormalCount, ruleName } = values;
        let { testpointType, testpointId, testpointName } = pointInfo;
        let result = await testPointRuleAdd(
            ruleName,
            testpointId,
            testpointName,
            testpointType,
            totalCount,
            abnormalCount,
            alarmLevel
        );
        if (result.success) {
            onHandlerTevRulesRefresh();
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

    asyncEdit = async (values) => {
        let {
            testPointRuleUpdate,
            intl: { formatMessage },
            actionType,
            onCancel,
            ruleInfo,
            onHandlerTevRulesRefresh,
        } = this.props;
        let { alarmLevel, totalCount, abnormalCount, ruleName } = values;
        let { id, testpointId, testpointName, testpointType } = ruleInfo ? ruleInfo : {};
        let result = await testPointRuleUpdate(
            id,
            ruleName,
            testpointId,
            testpointName,
            testpointType,
            totalCount,
            abnormalCount,
            alarmLevel
        );
        if (result.success) {
            onHandlerTevRulesRefresh();
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

    onHandleChange = (val, obj) => {
        this.setState({ value: obj.props.children });
    };

    renderLayout() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
            systemState: { alarmResult },
            ruleInfo,
        } = this.props;
        if (alarmResult && alarmResult.list && alarmResult.list.length > 0) {
            alarmResult.list.map((item) => {
                item.key = item.alarmLevel;
                item.value = item.alarmLevel;
                item.name = formatMessage(locale[Enum.getExceptionStatus(item.alarmLevel).value]);
            });
        }
        let { ruleName, alarmLevel, totalCount, abnormalCount } = ruleInfo ? ruleInfo : {};
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
                            onChange={this.onHandleChange.bind(this)}
                            placeholder={formatMessage(locale.AlarmLevelSelectTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.TotalNums)}>
                    {formItemTips(
                        getFieldDecorator,
                        'totalCount',
                        0,
                        10,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'TotalNumsTips' },
                        totalCount,
                        'onlyNumber',
                        formatMessage(locale.TestpointRule),
                        true
                    )(<Input placeholder={formatMessage(locale.TotalNumsTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.AbnormalQuantity)}>
                    {formItemTips(
                        getFieldDecorator,
                        'abnormalCount',
                        0,
                        10,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'AbnormalQuantityTips' },
                        abnormalCount,
                        'onlyNumber',
                        formatMessage(locale.TestpointRule),
                        true
                    )(<Input placeholder={formatMessage(locale.AbnormalQuantityTips)} />)}
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
                centered>
                {modalContent}
            </InfoModal>
        );
    }
}
export default injectIntl(TestpointConfigure);
