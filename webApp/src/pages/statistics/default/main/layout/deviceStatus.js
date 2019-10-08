import React from 'react';
import { List, Avatar, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../locale';
import CustomPanel from '../../../../../components/statistical/box';
import LCDComponent from '../../../../../components/statistical/LCD';
import Loading from '../../../../../components/loading';
import AbnormalRateTrend from '../containers/abnormalRateTrend';
import StatusEvaluate from '../containers/statusEvaluate';
import eventProxy from '../../../../../utils/eventProxy';
import { isEmpty } from '../../../../../utils/common';
import { statisticsAction } from '../../../../../actions';

@connect(
    (state) => ({
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        getDeviceStatus: (companyId, substationIds) =>
            dispatch(statisticsAction.getDeviceStatus(companyId, substationIds)),
        getAbnormalRatioDevice: (companyId, substationIds, startDate, endDate) =>
            dispatch(
                statisticsAction.getAbnormalRatioDevice(
                    companyId,
                    substationIds,
                    startDate,
                    endDate
                )
            ),
        getAbnormalProcessDevice: (companyId) =>
            dispatch(statisticsAction.getAbnormalProcessDevice(companyId)),
    })
)
//设备状态
class DeviceStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            substationIds: '',
            dsLoading: false,
            ardLoading: false,
            apdLoading: false,
        };
    }

    static defaultProps = {
        substationIds: '',
    };

    static getDerivedStateFromProps(props, state) {
        if (props.substationIds != state.substationIds) {
            props.getDeviceStatus('', props.substationIds);
            return {
                substationIds: props.substationIds,
            };
        }
        return null;
    }

    componentDidMount = () => {
        this.getData('');
        this.receiveEvent();
    };

    getData = (companyId) => {
        this.setState({
            dsLoading: true,
            ardLoading: true,
            apdLoading: true,
        });
        this.getDS(companyId, '');
        this.getARD(companyId, '');
        this.getAPD(companyId);
    };
    getDS = async (companyId, substationIds) => {
        let { getDeviceStatus } = this.props;
        getDeviceStatus(companyId, substationIds);
        this.setState({
            dsLoading: false,
        });
    };
    getARD = async (companyId, substationIds) => {
        let { getAbnormalRatioDevice } = this.props;
        getAbnormalRatioDevice(companyId, substationIds);
        this.setState({
            ardLoading: false,
        });
    };
    getAPD = async (companyId) => {
        let { getAbnormalProcessDevice } = this.props;
        getAbnormalProcessDevice(companyId);
        this.setState({
            apdLoading: false,
        });
    };

    receiveEvent = () => {
        eventProxy.on('companySelected', (companyId, companyName) => {
            this.getData(companyId);
        });
    };

    convertToLocal = (type) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let localeStatus = '';
        let key = '';
        switch (type) {
            case 'normalCount':
                localeStatus = formatMessage(locale.Normal);
                key = 'normal';
                break;
            case 'warningCount':
                localeStatus = formatMessage(locale.Warning);
                key = 'warning';
                break;
            case 'alarmCount':
                localeStatus = formatMessage(locale.Alarm);
                key = 'alarm';
                break;
        }
        return { localeStatus, key };
    };

    handlerClick = (key) => {
        console.log(key);
    };

    renderContent(data) {
        let {
            intl: { formatMessage },
        } = this.props;
        let items = [];
        for (let key in data) {
            let res = this.convertToLocal(key);
            items.push({
                key: res.key,
                text: res.localeStatus,
                value: data[key],
            });
        }
        return (
            <CustomPanel
                type='rectangle'
                title={formatMessage(locale.PowerEquipmentStatus)}
                data={items}
            />
        );
    }

    renderProcessNum(data) {
        let content = [];
        if (!isEmpty(data)) {
            data.map((item, index) => {
                if (item.statisticsRange < 3) {
                    let processAbnormal = item.processAbnormal;
                    let value = `${processAbnormal.processedNum}/${processAbnormal.abnormalNum}`;
                    content.push(
                        <Col className='value' span={5} key={index}>
                            <LCDComponent size='small' color='#73D1EB'>
                                {value}
                            </LCDComponent>
                        </Col>
                    );
                }
            });
        }
        return content;
    }

    renderStatusEvaluate(data) {
        let content = '';
        if (!isEmpty(data)) {
            content = <StatusEvaluate contentType='device' data={data} />;
        }
        return content;
    }
    renderCumulative(data) {
        let content = '';
        if (!isEmpty(data)) {
            let processAbnormal = {};
            data.map((item) => {
                if (item.statisticsRange == 4) {
                    processAbnormal = item.processAbnormal;
                }
            });
            content = (
                <Col className='total' span={15}>
                    <LCDComponent
                        size='large'
                        color='#73D1EB'>{`${processAbnormal.processedNum}/${processAbnormal.abnormalNum}`}</LCDComponent>
                </Col>
            );
        }
        return content;
    }

    render() {
        let {
            statisticsState: { deviceStatus, abnormalRatioDevice, abnormalProcessDevice },
            intl: { formatMessage },
        } = this.props;
        let { dsLoading, ardLoading, apdLoading } = this.state;
        return (
            <div className='content-right'>
                <CustomPanel
                    contentType='device'
                    type='panel5'
                    width='25rem'
                    height='100%'
                    title={formatMessage(locale.DeviceStatusEvaluate)}>
                    {dsLoading ? (
                        <Loading />
                    ) : (
                        <StatusEvaluate contentType='device' data={deviceStatus} />
                    )}
                </CustomPanel>
                <CustomPanel
                    type='panel3'
                    width='22rem'
                    height='100%'
                    title={formatMessage(locale.DeviceAbnormalRateTrend)}>
                    {ardLoading ? (
                        <Loading />
                    ) : (
                        <AbnormalRateTrend id='device' data={abnormalRatioDevice} />
                    )}
                </CustomPanel>
                <CustomPanel
                    type='panel1'
                    width='22rem'
                    height='100%'
                    title={formatMessage(locale.DeviceExceptionHandleStatistics)}>
                    {apdLoading ? (
                        <Loading />
                    ) : (
                        <List
                            className='device-list'
                            itemLayout='horizontal'
                            style={{ margin: '-1rem' }}>
                            <List.Item style={{ background: '#093345', height: '25%' }}>
                                <Row type='flex' align='middle' className='device-list-row'>
                                    <Col offset={9} span={5}>
                                        {formatMessage(locale.Today)}
                                    </Col>
                                    <Col span={5}>{formatMessage(locale.Week)}</Col>
                                    <Col span={5}>{formatMessage(locale.Month)}</Col>
                                </Row>
                            </List.Item>
                            <List.Item style={{ height: '30%' }}>
                                <Row type='flex' align='middle' className='device-list-row'>
                                    <Col className='name' span={9}>{`${formatMessage(
                                        locale.ProcessedNum
                                    )}/${formatMessage(locale.AbnormalNum)}`}</Col>
                                    {this.renderProcessNum(abnormalProcessDevice)}
                                </Row>
                            </List.Item>
                            <List.Item
                                className='device-list-item-bottom'
                                style={{ height: '35%' }}>
                                <Row type='flex' align='middle' className='device-list-row'>
                                    <Col className='totalName' span={9}>
                                        {formatMessage(locale.CumulativeProcessed)}
                                    </Col>
                                    {this.renderCumulative(abnormalProcessDevice)}
                                </Row>
                            </List.Item>
                        </List>
                    )}
                </CustomPanel>
            </div>
        );
    }
}
export default injectIntl(DeviceStatus);
