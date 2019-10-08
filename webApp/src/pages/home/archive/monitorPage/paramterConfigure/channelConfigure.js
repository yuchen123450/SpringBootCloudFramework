import React, { PureComponent } from 'react';
import { Form, Modal, Input, Divider } from 'antd';
import { locale } from '../../../../../pages/locale';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import { injectIntl } from 'react-intl';
import StandardForm from '../../../../../components/standardForm';
import Select from '../../../../../components/baseSelect';
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
class ChannelConfigure extends PureComponent {
    constructor(props) {
        super(props);
        let {
            intl: { formatMessage },
        } = this.props;
        this.state = {
            uhfGainList: [
                { key: 0, value: 0, name: '60dB' },
                { key: 1, value: 1, name: '80dB' },
                { key: 1, value: 1, name: '100dB' },
            ],
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

    handleCancel = () => {
        let { onCancel } = this.props;
        onCancel();
    };

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //this.setState({ confirmLoading: true });
            } else {
                let { samplingInterval = {}, bias = {} } = err;
                if (!isEmpty(samplingInterval)) {
                    return;
                }
                if (!isEmpty(bias)) {
                }
            }
        });
    };

    renderAEConfigure = () => {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;
        let { gainModeList, uhfGainList, sampleRateList, samplePointsList } = this.state;
        return (
            <StandardForm vertical>
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
    };

    renderTEVConfigure = () => {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;
        return (
            <StandardForm vertical>
                <FormItem label={formatMessage(locale.Bias)}>
                    {getFieldDecorator('bias', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.BiasTips),
                            },
                        ],
                        initialValue: '',
                    })(<Input placeholder={formatMessage(locale.BiasTips)} />)}
                </FormItem>
            </StandardForm>
        );
    };

    renderLayout() {
        return (
            <div>
                <Divider orientation='left' style={{ padding: 0, margin: 0 }}>
                    AE
                </Divider>
                {this.renderAEConfigure()}
                <Divider orientation='left' style={{ padding: 0, margin: 0 }}>
                    TEV
                </Divider>
                {this.renderTEVConfigure()}
            </div>
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
export default injectIntl(ChannelConfigure);
