import React from 'react';
import { Badge } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { locale } from '../../../../locale';
import CustomPanel from '../../../../../components/statistical/box';
import StatisticalTable from '../../../../../components/statistical/table';
import Ellipsis from '../../../../../components/ellipsis';
import Loading from '../../../../../components/loading';
import eventProxy from '../../../../../utils/eventProxy';
import { isEmpty, getRequest } from '../../../../../utils/common';
import Enum from '../../../../../utils/enum';
import { statisticsAction } from '../../../../../actions';

@connect(
    (state) => ({
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        getAlarmInfoDev: (companyId, substationIds, state, page, limit, isGetAbnormalOnly) =>
            dispatch(
                statisticsAction.getAlarmInfoDev(
                    companyId,
                    substationIds,
                    state,
                    page,
                    limit,
                    isGetAbnormalOnly
                )
            ),
    })
)
class AlarmData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 3,
            loading: true,
            companyId: null,
        };
    }
    componentDidMount = () => {
        this.getData();
        this.receiveEvent();
    };
    getData = async () => {
        let { getAlarmInfoDev } = this.props;
        let { companyId, page, limit } = this.state;
        await getAlarmInfoDev(companyId, '', '', page, limit, 1);
        this.setState({
            loading: false,
        });
    };

    receiveEvent = () => {
        eventProxy.on('companySelected', (companyId, companyName) => {
            this.setState(
                {
                    companyId,
                },
                () => {
                    this.getData();
                }
            );
        });
    };

    render() {
        let {
            statisticsState: { alarmInfoDevices },
            intl: { formatMessage, formats },
        } = this.props;
        let { page, limit, loading } = this.state;
        let columns = [
            {
                title: formatMessage(locale.AlarmDate),
                dataIndex: 'stateTime',
                key: 'stateTime',
                width: '13%',
                render: (content) =>
                    isEmpty(content) ? '--' : moment.unix(content).format(formats.date),
            },
            {
                title: formatMessage(locale.Status),
                dataIndex: 'state',
                key: 'state',
                width: '12%',
                render: (item) => {
                    let res = Enum.getExceptionStatus(item);
                    return (
                        <div style={{ pointerEvents: 'none' }}>
                            <Badge status={res.status} text={formatMessage(locale[res.value])} />
                        </div>
                    );
                },
            },
            {
                title: formatMessage(locale.DeviceName),
                dataIndex: 'deviceName',
                key: 'deviceName',
                width: '15%',
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.DeviceType),
                dataIndex: 'deviceType',
                key: 'deviceType',
                width: '15%',
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {Enum.getDeviceTypeEnum(parseInt(content))}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.SubstationName),
                dataIndex: 'substationName',
                key: 'substationName',
                width: '15%',
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.CompanyName),
                dataIndex: 'companyName',
                key: 'companyName',
                width: '15%',
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.ProcessedDate),
                dataIndex: 'confirmTime',
                key: 'confirmTime',
                align: 'center',
                render: (content) =>
                    isEmpty(content) ? '--' : moment.unix(content).format(formats.dateAbbr),
            },
        ];
        return (
            <CustomPanel
                width='100%'
                height='17.2rem'
                title={formatMessage(locale.DeviceAbnormalStatus)}>
                {loading ? (
                    <Loading />
                ) : (
                    <StatisticalTable
                        size='small'
                        id='alarmData'
                        rowKey={(record) => record.deviceId}
                        rowSelect={false}
                        columns={columns}
                        dataSource={alarmInfoDevices.list}
                        current={page}
                        pagination={{
                            total: alarmInfoDevices.totalRecords,
                            pageSize: limit,
                            hideOnSinglePage: false,
                        }}
                        onChange={(pagination) => {
                            this.setState(
                                {
                                    page: pagination.current,
                                },
                                async () => {
                                    this.getData();
                                }
                            );
                        }}
                    />
                )}
            </CustomPanel>
        );
    }
}
export default injectIntl(AlarmData);
