import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../pages/locale';
import StandardForm from '../../../../../components/standardForm';
import Scrollbar from '../../../../../components/baseScroll';
import { isEmpty } from '../../../../../utils/common';
import Enum from '../../../../../utils/enum';
import moment from 'moment';

const FormItem = Form.Item;
@Form.create()
class SensorHostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {};

    componentDidMount() {}
    render() {
        const {
            intl: { formatMessage, formats },
            monitorInfo,
        } = this.props;
        return (
            <Scrollbar>
                {isEmpty(monitorInfo) ? (
                    <span>{formatMessage(locale.NoData)}</span>
                ) : (
                    <StandardForm label showLineNums={2}>
                        <FormItem label={formatMessage(locale.HostName)}>
                            <span className='ant-form-text'>{monitorInfo.monitorName}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HostNumber)}>
                            <span className='ant-form-text'>{monitorInfo.monitorId}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HostType)}>
                            <span className='ant-form-text'>
                                {Enum.getMonitorType(monitorInfo.monitorType)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.NetStatus)}>
                            <span className='ant-form-text'>
                                {monitorInfo.connectionStatus === 0
                                    ? formatMessage(locale.MonitorDisConnect)
                                    : formatMessage(locale.MonitorOnline)}
                            </span>
                        </FormItem>
                        <FormItem label={`${formatMessage(locale.Electricity)}(%)`}>
                            <span className='ant-form-text'>{monitorInfo.monitorBattery}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HardwareVersion)}>
                            <span className='ant-form-text'>{monitorInfo.hardwareVersion}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HostGroupNumber)}>
                            <span className='ant-form-text'>
                                {monitorInfo.monitorConnectionGroup}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.DataUploadFrequency)}>
                            <span className='ant-form-text'>{monitorInfo.uploadInterval}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.LastUploadTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(monitorInfo.lastDataUploadTime)
                                    ? ''
                                    : moment
                                          .unix(monitorInfo.lastDataUploadTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.LastConnectTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(monitorInfo.lastConnectionTime)
                                    ? ''
                                    : moment
                                          .unix(monitorInfo.lastConnectionTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.SignalStrength)}>
                            <span className='ant-form-text'>{monitorInfo.gprsSignalLevel}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.SIMCardNumber)}>
                            <span className='ant-form-text'>{monitorInfo.simCardNumber}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.SIMCardTraffic)}>
                            <span className='ant-form-text'>{monitorInfo.simCardInformation}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.InstallationDate)}>
                            <span className='ant-form-text'>
                                {isEmpty(monitorInfo.installationTime)
                                    ? ''
                                    : moment
                                          .unix(monitorInfo.installationTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>
                    </StandardForm>
                )}
            </Scrollbar>
        );
    }
}
export default injectIntl(SensorHostDetails);
