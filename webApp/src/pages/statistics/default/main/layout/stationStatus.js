import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../locale';
import CustomPanel from '../../../../../components/statistical/box';
import BaseChart from '../../../../../components/baseChart';
import Loading from '../../../../../components/loading';
import StatusEvaluate from '../containers/statusEvaluate';
import AbnormalRateTrend from '../containers/abnormalRateTrend';
import eventProxy from '../../../../../utils/eventProxy';
import { isEmpty, cutString, isChinese } from '../../../../../utils/common';
import { getCurrentBaseRem } from '../../../../../utils/dom';
import Enum from '../../../../../utils/enum';
import { statisticsAction } from '../../../../../actions';

@connect(
    (state) => ({
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        getSummary: (substationIds) => dispatch(statisticsAction.getSummary(substationIds)),
        getStatusSubstation: (companyId, substationIds) =>
            dispatch(statisticsAction.getStatusSubstation(companyId, substationIds)),
        getAbnormalRatioSubstation: (companyId, startDate, endDate) =>
            dispatch(statisticsAction.getAbnormalRatioSubstation(companyId, startDate, endDate)),
        getStatusSubstationByCompany: (companyId) =>
            dispatch(statisticsAction.getStatusSubstationByCompany(companyId)),
    })
)
class StationStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            substationIds: '',
            substationName: '',
            ssLoading: false,
            arsLoading: false,
            ssbcLoading: false,
        };
    }
    static defaultProps = {
        substationIds: '',
    };

    componentDidMount() {
        this.getData('');
        this.receiveEvent();
    }

    getData = (companyId) => {
        this.setState({
            ssLoading: true,
            arsLoading: true,
            ssbcLoading: true,
        });
        this.getSS(companyId);
        this.getASR(companyId);
        this.getSSBC(companyId);
    };
    getSS = async (companyId) => {
        let { getStatusSubstation } = this.props;
        await getStatusSubstation(companyId);
        this.setState({
            ssLoading: false,
        });
    };
    getASR = async (companyId) => {
        let { getAbnormalRatioSubstation } = this.props;
        await getAbnormalRatioSubstation(companyId);
        this.setState({
            arsLoading: false,
        });
    };
    getSSBC = async (companyId) => {
        let { getStatusSubstationByCompany } = this.props;
        await getStatusSubstationByCompany(companyId);
        this.setState({
            ssbcLoading: false,
        });
    };

    receiveEvent = () => {
        eventProxy.on('companySelected', (companyId, companyName) => {
            this.getData(companyId);
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.substationIds != state.substationIds) {
            props.getSummary(props.substationIds);
            return {
                substationIds: props.substationIds,
            };
        }
        return null;
    }

    handlerChartData(data) {
        let {
            intl: { formatMessage },
        } = this.props;
        let xAxisData = [],
            normalValue = [],
            warningValue = [],
            alarmValue = [];
        data.map((item) => {
            if (item.companyName == 'directStation') {
                xAxisData.push(formatMessage(locale.DirectStation));
            } else {
                xAxisData.push(item.companyName);
            }
            normalValue.push(item.normalCount);
            warningValue.push(item.warningCount);
            alarmValue.push(item.alarmCount);
        });
        return {
            xAxisData: xAxisData,
            valueList: [
                {
                    value: normalValue,
                    valueType: 'Normal',
                    valueUnit: '',
                },
                {
                    value: warningValue,
                    valueType: 'Warning',
                    valueUnit: '',
                },
                {
                    value: alarmValue,
                    valueType: 'Alarm',
                    valueUnit: '',
                },
            ],
        };
    }
    chartOption = (data) => {
        let legend = [],
            seriesData = [],
            xAxisData = [];
        let rem = getCurrentBaseRem();
        if (!isEmpty(data)) {
            data = this.handlerChartData(data);
            data.valueList.map((item) => {
                let valueTypeData = Enum.chartTrendValueType(item.valueType);
                legend.push(valueTypeData);
                seriesData.push({
                    name: valueTypeData,
                    type: 'bar',
                    barWidth: '15rem',
                    stack: '1',
                    data: item.value,
                });
            });
            xAxisData = data.xAxisData;
        }
        let color = ['green', 'orange', 'red'];
        let labelStyle = {
            color: '#5b9cd8',
            fontSize: 0.75 * rem,
        };
        let axisLine = {
            lineStyle: {
                color: '#5b9cd8',
                width: 0.062 * rem,
            },
        };
        let option = {
            color: color,
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: legend,
                textStyle: labelStyle,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '4px',
                top: '24px',
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: axisLine,
                    data: xAxisData,
                    axisLabel: {
                        ...labelStyle,
                        interval: 0,
                        formatter: function(val) {
                            let flagLength = isChinese(val) == 0 ? 9 : 6;
                            if (val.length * 2 > flagLength) {
                                val = cutString(val, flagLength);
                                val = `${val.split('').join('\n')}\n` + '...';
                            } else {
                                val = val.split('').join('\n');
                            }
                            return val;
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: axisLine,
                    axisLabel: labelStyle,
                    nameTextStyle: labelStyle,
                    splitLine: {
                        show: false,
                    },
                },
            ],
            series: seriesData,
        };
        return option;
    };

    renderStatusSubstationChat(data) {
        let content = '';
        let option = this.chartOption(data);
        content = (
            <BaseChart
                className='status-substation-chart'
                option={option}
                renderChart={(chart) => {
                    chart.on('click', (series) => {
                        this.handlerClick(series.data.label);
                    });
                }}
            />
        );
        return content;
    }

    render() {
        let {
            statisticsState: {
                substationStatusStatistics,
                abnormalRatioSubtation,
                statusSubstationByCompany,
            },
            intl: { formatMessage },
        } = this.props;
        let { ssLoading, arsLoading, ssbcLoading } = this.state;
        return (
            <div className='content-left'>
                <CustomPanel
                    type='panel4'
                    width='25rem'
                    height='100%'
                    title={formatMessage(locale.StationStatusEvaluate)}>
                    {ssLoading ? (
                        <Loading />
                    ) : (
                        <StatusEvaluate
                            contentType='substation'
                            data={substationStatusStatistics}
                        />
                    )}
                </CustomPanel>
                <CustomPanel
                    type='panel3'
                    width='22rem'
                    height='100%'
                    title={formatMessage(locale.SubstationAbnormalRateTrend)}>
                    {arsLoading ? (
                        <Loading />
                    ) : (
                        <AbnormalRateTrend id='substaion' data={abnormalRatioSubtation} />
                    )}
                </CustomPanel>
                <CustomPanel
                    type='panel1'
                    width='22rem'
                    height='100%'
                    title={formatMessage(locale.StationStatusDistributionStatistics)}>
                    {ssbcLoading ? (
                        <Loading />
                    ) : (
                        this.renderStatusSubstationChat(statusSubstationByCompany)
                    )}
                </CustomPanel>
            </div>
        );
    }
}
export default injectIntl(StationStatus);
