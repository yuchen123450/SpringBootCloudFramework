import React, { Component, Fragment } from 'react';
import { Form, Switch, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../pages/locale';
import StandardForm from '../../../../../components/standardForm';
import { isEmpty } from '../../../../../utils/common';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import { toast } from '../../../../../components/toast';
const FormItem = Form.Item;

@connect(
    (state) => ({
        monitorReducerState: state.monitorReducer,
    }),
    (dispatch) => ({
        updateMonitorValid: (monitorId, isValid) =>
            dispatch(archiveAction.updateMonitorValid(monitorId, isValid)),
    })
)
@Form.create()
class MonitorStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            isDevOpen: 0,
        };
    }

    static defaultProps = {};

    componentDidMount() {}

    onConfigureChange = (checked) => {
        console.log(`switch to ${checked}`);
        this.setState({
            isDevOpen: checked ? 1 : 0,
        });
    };

    handleClose = (e) => {
        let { hideModal } = this.props;
        hideModal();
    };

    renderContent = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        return (
            <StandardForm label vertical>
                <FormItem label={formatMessage(locale.NetStatus)}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={`${formatMessage(locale.Electricity)}(%)`}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={formatMessage(locale.HostPowerDown)}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={`${formatMessage(locale.SignalStrength)}(dBm)`}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={formatMessage(locale.FrontStatus)}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={formatMessage(locale.InformationStrength)}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
                <FormItem label={formatMessage(locale.CardTraffic)}>
                    <span className='ant-form-text'>{}</span>
                </FormItem>
            </StandardForm>
        );
    };

    render() {
        const {
            intl: { formatMessage },
            monitorInfo,
            visible,
        } = this.props;
        let content = this.renderContent();
        return (
            <Fragment>
                {isEmpty(monitorInfo) ? (
                    <span />
                ) : (
                    <Modal
                        title={formatMessage(locale.Status)}
                        confirmLoading={this.state.confirmLoading}
                        destroyOnClose
                        onOk={this.onOk}
                        onCancel={this.handleClose}
                        visible={visible}
                        footer={null}>
                        {content}
                    </Modal>
                )}
            </Fragment>
        );
    }
}
export default injectIntl(MonitorStatus);
