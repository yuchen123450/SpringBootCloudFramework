import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import { locale } from '../../../../../pages/locale';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import StandardForm from '../../../../../components/standardForm';
import { injectIntl } from 'react-intl';
import Select from '../../../../../components/baseSelect';
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
class UHFConfigure extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = this.props;
        this.state = {
            filterList: [
                { key: 0, value: 0, name: formatMessage(locale.AllPass) },
                { key: 1, value: 1, name: formatMessage(locale.LowPass) },
                { key: 2, value: 2, name: formatMessage(locale.QuaLcomm) },
            ],
            uhfGainList: [{ key: 0, value: 0, name: '0dB' }, { key: 1, value: 1, name: '20dB' }],
            gainModeList: [
                { key: 0, value: 0, name: formatMessage(locale.Manual) },
                { key: 1, value: 1, name: formatMessage(locale.Automatic) },
            ],
            sampleRateList: [{ key: 0, value: 0, name: '50' }, { key: 1, value: 1, name: '60' }],
            samplePointsList: [{ key: 0, value: 0, name: '60' }, { key: 1, value: 1, name: '72' }],
        };
    }

    static defaultProps = {};

    componentDidMount() {}

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //this.setState({ confirmLoading: true });
            }
        });
    };

    handleCancel = () => {
        let { onCancel } = this.props;
        onCancel();
    };

    renderLayout() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;
        let {
            filterList,
            gainModeList,
            uhfGainList,
            sampleRateList,
            samplePointsList,
        } = this.state;
        return (
            <StandardForm vertical>
                <FormItem label={formatMessage(locale.Filter)}>
                    {getFieldDecorator('filter', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.FilterTips),
                            },
                        ],
                        initialValue: 0,
                    })(<Select data={filterList} placeholder={formatMessage(locale.FilterTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.gain)}>
                    {getFieldDecorator('gain', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.GainTips),
                            },
                        ],
                        initialValue: 0,
                    })(<Select data={uhfGainList} placeholder={formatMessage(locale.GainTips)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.sampleRate)}>
                    {getFieldDecorator('sampleRate', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.SampleRateTips),
                            },
                        ],
                        initialValue: 0,
                    })(
                        <Select
                            data={sampleRateList}
                            placeholder={formatMessage(locale.SampleRateTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.SamplePoints)}>
                    {getFieldDecorator('samplePoints', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.SamplePointsTips),
                            },
                        ],
                        initialValue: 0,
                    })(
                        <Select
                            data={samplePointsList}
                            placeholder={formatMessage(locale.SamplePointsTips)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.SamplingInterval)}>
                    {getFieldDecorator('samplingInterval', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.SamplingIntervalTips),
                            },
                        ],
                        initialValue: '',
                    })(<Input placeholder={formatMessage(locale.SamplingIntervalTips)} />)}
                </FormItem>
            </StandardForm>
        );
    }

    render() {
        let {
            intl: { formatMessage },
            visible,
        } = this.props;
        let { confirmLoading } = this.state;
        return (
            <Modal
                title={formatMessage(locale.Configuration)}
                visible={visible}
                confirmLoading={confirmLoading}
                bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
                width={600}
                centered
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                destroyOnClose
                maskClosable>
                {this.renderLayout()}
            </Modal>
        );
    }
}
export default injectIntl(UHFConfigure);
