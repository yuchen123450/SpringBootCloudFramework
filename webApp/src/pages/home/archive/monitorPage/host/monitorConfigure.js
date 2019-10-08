import React, { Component, Fragment } from 'react';
import { Form, Switch, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../pages/locale';
import StandardForm from '../../../../../components/standardForm';
import { isEmpty } from '../../../../../utils/common';
import { connect } from 'react-redux';
import { archiveAction } from '../../../../../actions';
import { toast } from '../../../../../components/toast';
import InfoModal from '../../../../../containers/infoModal';
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
class MonitorConfigure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            isDevOpen: 0,
            hasOperate: false,
        };
    }

    static defaultProps = {};

    componentDidMount() {}

    onConfigureChange = (checked) => {
        console.log(`switch to ${checked}`);
        this.setState({
            isDevOpen: checked ? 1 : 0,
            hasOperate: true,
        });
    };

    handleClose = (e) => {
        let { hideModal } = this.props;
        hideModal();
    };

    handleSet = async () => {
        this.setState({ confirmLoading: true });
        let {
            monitorInfo: { monitorId, isValid = 0 },
            updateMonitorValid,
            handlerSearch,
            intl: { formatMessage },
        } = this.props;
        let { isDevOpen, hasOperate } = this.state;
        let result = await updateMonitorValid(monitorId, hasOperate ? isDevOpen : isValid);
        if (result && result.success) {
            toast('success', formatMessage(locale.MonitorConfigureSuccess));
            this.handleClose();
            handlerSearch();
        } else {
            toast('error', formatMessage(locale.MonitorConfigureFailed));
        }
        this.setState({ confirmLoading: false });
    };

    render() {
        const {
            intl: { formatMessage, formats },
            form: { getFieldDecorator },
            monitorInfo,
            visible,
        } = this.props;

        return (
            <Fragment>
                {isEmpty(monitorInfo) ? (
                    <span />
                ) : (
                    <InfoModal
                        title={formatMessage(locale.Configuration)}
                        confirmLoading={this.state.confirmLoading}
                        visible={visible}
                        onOk={this.handleSet}
                        onCancel={this.handleClose}
                        afterClose={() => {
                            this.setState({
                                hasOperate: false,
                            });
                        }}>
                        <StandardForm vertical>
                            <FormItem label={formatMessage(locale.WhiteOpenStatus)}>
                                {getFieldDecorator('isValid', {})(
                                    <Switch
                                        defaultChecked={monitorInfo.isValid === 1}
                                        onChange={this.onConfigureChange}
                                    />
                                )}
                            </FormItem>
                        </StandardForm>
                    </InfoModal>
                )}
            </Fragment>
        );
    }
}
export default injectIntl(MonitorConfigure);
