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
class SensorDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {};

    componentDidMount() {}

    getTestPointName = (sensorInfo) => {
        let testPoints = [];
        if (sensorInfo && sensorInfo.list && sensorInfo.list.length > 0) {
            sensorInfo.list.forEach((element) => {
                testPoints.push(element.testpointName);
            });
        }
        return testPoints;
    };

    render() {
        const {
            intl: { formatMessage, formats },
            sensorInfo,
        } = this.props;

        return (
            <Scrollbar>
                {isEmpty(sensorInfo) ? (
                    <span>{formatMessage(locale.NoData)}</span>
                ) : (
                    <StandardForm label>
                        <FormItem label={formatMessage(locale.TestPointManagerSensorName)}>
                            <span className='ant-form-text'>{sensorInfo.aduName}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.SensorCode)}>
                            <span className='ant-form-text'>{sensorInfo.aduId}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.SensorType)}>
                            <span className='ant-form-text'>
                                {Enum.getSensorAudType(sensorInfo.aduType)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.NetStatus)}>
                            <span className='ant-form-text'>
                                {sensorInfo.lastConnectionState === 0
                                    ? formatMessage(locale.MonitorDisConnect)
                                    : formatMessage(locale.MonitorOnline)}
                            </span>
                        </FormItem>
                        <FormItem label={`${formatMessage(locale.Electricity)}(%)`}>
                            <span className='ant-form-text'>{sensorInfo.battery}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.RemainingTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(sensorInfo.remainingWorkingTime)
                                    ? ''
                                    : moment
                                          .unix(sensorInfo.remainingWorkingTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HardwareVersion)}>
                            <span className='ant-form-text'>{sensorInfo.hardwareVersion}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.FirmwareVersion)}>
                            <span className='ant-form-text'>{sensorInfo.aduVersion}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.AcquisitionFrequency)}>
                            <span className='ant-form-text'>{sensorInfo.aduSampleSpace}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.LastUploadTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(sensorInfo.lastDataUploadTime)
                                    ? ''
                                    : moment
                                          .unix(sensorInfo.lastDataUploadTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>

                        <FormItem label={formatMessage(locale.LastConnectTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(sensorInfo.lastConnectionTime)
                                    ? ''
                                    : moment
                                          .unix(sensorInfo.lastConnectionTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>

                        <FormItem label={`${formatMessage(locale.SignalStrength)}(dBm)`}>
                            <span className='ant-form-text'>{sensorInfo.rssi}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.MonitoringHost)}>
                            <span className='ant-form-text'>{sensorInfo.monitorName}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.MonitoringSubstation)}>
                            <span className='ant-form-text'>
                                {sensorInfo.list && sensorInfo.list.length > 0
                                    ? sensorInfo.list[0].stationName
                                    : ''}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.MonitoringDevice)}>
                            <span className='ant-form-text'>
                                {sensorInfo.list && sensorInfo.list.length > 0
                                    ? sensorInfo.list[0].deviceName
                                    : ''}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.TestPoint)}>
                            <span className='ant-form-text'>
                                {this.getTestPointName(sensorInfo).join('/')}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.QRCodeNumber)}>
                            <span className='ant-form-text'>{sensorInfo.aduQrCode}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.OperatingMode)}>
                            <span className='ant-form-text'>
                                {Enum.getAduWorkMode(sensorInfo.aduWorkModel)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.WorkgroupNumber)}>
                            <span className='ant-form-text'>{sensorInfo.aduWorkGroupId}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.CommunicationLinkType)}>
                            <span className='ant-form-text'>
                                {Enum.getSensorCommunicateWay(sensorInfo.aduConnectionRoad)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.HostIP)}>
                            <span className='ant-form-text'>{sensorInfo.monitorIP}</span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.InitialSamplingTime)}>
                            <span className='ant-form-text'>
                                {isEmpty(sensorInfo.aduStartSampleTime)
                                    ? ''
                                    : moment
                                          .unix(sensorInfo.aduStartSampleTime)
                                          .format(formats.dateTime)}
                            </span>
                        </FormItem>
                        <FormItem label={formatMessage(locale.InstallationDate)}>
                            <span className='ant-form-text'>{sensorInfo.installationTime}</span>
                        </FormItem>
                    </StandardForm>
                )}
            </Scrollbar>
        );
    }
}
export default injectIntl(SensorDetails);
