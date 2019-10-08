import React from 'react';
import { Row, Col } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { locale } from '../../../../locale';
import CustomPanel from '../../../../../components/statistical/box';
import BaseChart from '../../../../../components/baseChart';
import Loading from '../../../../../components/loading';
import { isEmpty } from '../../../../../utils/common';
import { getCurrentBaseRem, getExplorerScreenRectParams } from '../../../../../utils/dom';
import { statisticsAction } from '../../../../../actions';
import AutoScrollHelper from '../../../../../components/autoScrollList/autoScrollCountHelper.js';

@connect(
    (state) => ({
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        getTaskStatus: (companyId) => dispatch(statisticsAction.getTaskStatus(companyId)),
        getSsdMonitorAndAdu: (companyId) =>
            dispatch(statisticsAction.getSsdMonitorAndAdu(companyId)),
    })
)
class BusinessInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rem: getCurrentBaseRem(),
            isTaskLoading: false,
            isSSDLoading: false,
            panelIndex: 0,
        };
    }
    componentDidMount() {
        this.getData();
        let param = getExplorerScreenRectParams();
        let isScrollList = param.clientWidth <= 1024;
        if (isScrollList) {
            let _self = this;
            let updateState = (index) => {
                _self.setState({
                    panelIndex: index,
                });
            };
            this.besinessInfoScrollHelper = new AutoScrollHelper({
                autoPlay: true,
                interval: 3000,
                updateState: updateState,
            });
            this.setDataNumber();
        }
    }

    getData = async () => {
        let { getTaskStatus, getSsdMonitorAndAdu, companyId } = this.props;
        this.setState({
            isTaskLoading: true,
            isSSDLoading: true,
        });
        await getTaskStatus(companyId);
        await getSsdMonitorAndAdu(companyId);
        this.setState({
            isTaskLoading: false,
            isSSDLoading: false,
        });
    };

    getOption(hostName, data, textStyle, subtextStyle) {
        let {
            intl: { formatMessage },
        } = this.props;
        let { rem } = this.state;
        let onlineRateName = formatMessage(locale.OnlineRate);
        let abnormalRate = formatMessage(locale.AbnormalRate);
        let splitLine = {
            // 分隔线
            length: 15, // 属性length控制线长
            lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#32e6ff',
                shadowColor: '#32e6ff', //默认透明
                shadowBlur: 10,
            },
        };
        let pointer = {
            width: 2,
            shadowColor: '#32e6ff', //默认透明
            shadowBlur: 5,
        };
        let axisLabelTextStyle = {
            // 属性lineStyle控制线条样式
            fontWeight: 'bolder',
            color: '#fff',
            shadowColor: '#32e6ff', //默认透明
            shadowBlur: 10,
        };
        let axisLineStyle = {
            // 属性lineStyle控制线条样式
            color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
            width: 2,
            shadowColor: '#32e6ff', //默认透明
            shadowBlur: 10,
        };
        let detailTextStyle = {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontSize: 1 * rem,
            fontWeight: 'bolder',
            color: '#32e6ff',
        };
        return {
            backgroundColor: '',
            tooltip: {
                formatter: '{a} <br/>{c} {b}',
            },
            series: [
                {
                    name: formatMessage(locale.Host),
                    type: 'gauge',
                    min: 0,
                    max: 220,
                    splitNumber: 11,
                    radius: '85%',
                    center: ['35%', '55%'],
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                            width: 1.5,
                            shadowColor: '#32e6ff', //默认透明
                            shadowBlur: 10,
                        },
                    },
                    axisLabel: {
                        // 坐标轴小标记
                        show: false,
                    },
                    splitLine: {
                        // 分隔线
                        length: 15, // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle（详见lineStyle）控制线条样式
                            width: 1.5,
                            color: '#32e6ff',
                            shadowColor: '#32e6ff', //默认透明
                            shadowBlur: 10,
                        },
                    },
                    title: {
                        textStyle: textStyle,
                    },
                    pointer: {
                        show: false,
                    },
                    detail: {
                        borderColor: '#32e6ff',
                        shadowColor: '#32e6ff', //默认透明
                        shadowBlur: 5,
                        offsetCenter: [0, 10], // x, y，单位px
                        textStyle: subtextStyle,
                    },
                    data: [{ value: data ? data.totalCount : null, name: hostName }],
                },
                {
                    name: formatMessage(locale.Host),
                    type: 'gauge',
                    center: ['75%', '55%'], // 默认全局居中
                    radius: '70%',
                    min: 0,
                    max: 2,
                    startAngle: 135,
                    endAngle: 45,
                    splitNumber: 2,
                    axisLine: {
                        // 坐标轴线
                        lineStyle: axisLineStyle,
                    },
                    axisTick: {
                        // 坐标轴小标记
                        length: 12, // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor: '#32e6ff', //默认透明
                            shadowBlur: 10,
                        },
                    },
                    axisLabel: {
                        textStyle: axisLabelTextStyle,
                        formatter: function(v) {
                            switch (`${v}`) {
                                case '0':
                                    return '';
                                case '1':
                                    return onlineRateName;
                                case '2':
                                    return '';
                            }
                        },
                    },
                    splitLine: splitLine,
                    pointer: pointer,
                    title: {
                        show: false,
                    },
                    detail: {
                        borderColor: '#32e6ff',
                        shadowColor: '#32e6ff', //默认透明
                        shadowBlur: 5,
                        offsetCenter: [0, -15], // x, y，单位px
                        textStyle: detailTextStyle,
                    },
                    data: [
                        {
                            value: data ? data.onlineRatio : null,
                            name: formatMessage(locale.OnlineRate),
                        },
                    ],
                },
                {
                    name: formatMessage(locale.Host),
                    type: 'gauge',
                    center: ['75%', '55%'], // 默认全局居中
                    radius: '70%',
                    min: 0,
                    max: 2,
                    startAngle: 315,
                    endAngle: 225,
                    splitNumber: 2,
                    axisLine: {
                        // 坐标轴线
                        lineStyle: axisLineStyle,
                    },
                    axisTick: {
                        // 坐标轴小标记
                        show: false,
                    },
                    axisLabel: {
                        textStyle: axisLabelTextStyle,
                        formatter: function(v) {
                            switch (`${v}`) {
                                case '0':
                                    return '';
                                case '1':
                                    return abnormalRate;
                                case '2':
                                    return '';
                            }
                        },
                    },
                    splitLine: splitLine,
                    pointer: pointer,
                    title: {
                        show: false,
                    },
                    detail: {
                        borderColor: '#32e6ff',
                        shadowColor: '#32e6ff', //默认透明
                        shadowBlur: 5,
                        offsetCenter: [0, 15], // x, y，单位px
                        textStyle: detailTextStyle,
                    },
                    data: [
                        {
                            value: data ? data.abnormalRatio : null,
                            name: formatMessage(locale.AbnormalRate),
                        },
                    ],
                },
            ],
        };
    }

    chartOption = (type, data) => {
        let option = {};
        let { rem } = this.state;
        let {
            intl: { formatMessage },
        } = this.props;
        let textStyle = {
            fontWeight: 'bolder',
            fontSize: 0.8 * rem,
            color: '#fff',
        };
        let subtextStyle = {
            fontSize: 1.2 * rem,
            fontWeight: 'bolder',
            color: '#32e6ff',
        };
        switch (type) {
            case 'taskStatus':
                var scaleData = [
                    {
                        name: formatMessage(locale.ToBeExecuted),
                        value: data.toBeExecutedCount,
                    },
                    {
                        name: formatMessage(locale.Executing),
                        value: data.executingCount,
                    },
                    {
                        name: formatMessage(locale.Uploaded),
                        value: data.uploadedCount,
                    },
                    {
                        name: formatMessage(locale.Completed),
                        value: data.completedCount,
                    },
                ];
                let total = 0;
                for (let i in data) {
                    total += data[i];
                }
                var data = [];
                for (var i = 0; i < scaleData.length; i++) {
                    data.push(
                        {
                            value: scaleData[i].value,
                            name: scaleData[i].name,
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    shadowBlur: 30,
                                    borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                        {
                                            offset: 0,
                                            color: '#7777eb',
                                        },
                                        {
                                            offset: 1,
                                            color: '#70ffac',
                                        },
                                    ]),
                                    shadowColor: 'rgba(142, 152, 241, 0.6)',
                                },
                            },
                        },
                        {
                            value: 4,
                            name: '',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false,
                                    },
                                    labelLine: {
                                        show: false,
                                    },
                                    color: 'rgba(0, 0, 0, 0)',
                                    borderColor: 'rgba(0, 0, 0, 0)',
                                    borderWidth: 0,
                                },
                            },
                        }
                    );
                }
                option = {
                    title: {
                        text: formatMessage(locale.MenuDetectionTask),
                        subtext: total,
                        x: 'center',
                        y: 'center',
                        textStyle: textStyle,
                        subtextStyle: subtextStyle,
                    },
                    tooltip: {
                        show: false,
                    },
                    legend: {
                        show: false,
                    },
                    toolbox: {
                        show: false,
                    },
                    grid: {
                        left: 0.8 * rem,
                        top: 0.6 * rem,
                        right: 1.5 * rem,
                        containLabel: true,
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            clockWise: false,
                            radius: ['45%', '50%'],
                            center: ['50.8%', '50%'],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        fontSize: 0.8 * rem,
                                        show: true,
                                        position: 'outside',
                                        color: '#ddd',
                                        formatter: function(params) {
                                            var percent = 0;
                                            var total = 0;
                                            for (var i = 0; i < scaleData.length; i++) {
                                                total += scaleData[i].value;
                                            }
                                            percent = ((params.value / total) * 100).toFixed(0);
                                            if (params.name !== '') {
                                                return `${params.name}\n{white|${formatMessage(
                                                    locale.Ratio
                                                )}: ${percent === 'NaN' ? 0 : percent}%}`;
                                            } else {
                                                return '';
                                            }
                                        },
                                        rich: {
                                            white: {
                                                fontSize: 0.8 * rem,
                                                color: '#ddd',
                                                align: 'center',
                                                padding: [0.15 * rem, 0],
                                            },
                                        },
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 0.3 * rem,
                                        length2: 0.65 * rem,
                                    },
                                },
                            },
                            data: data,
                        },
                    ],
                };
                break;
            case 'monitor':
                let hostName = formatMessage(locale.HostNumbers);
                option = this.getOption(hostName, data, textStyle, subtextStyle);
                break;
            case 'adu':
                let sensorName = formatMessage(locale.SensorNumbers);
                option = this.getOption(sensorName, data, textStyle, subtextStyle);
                break;
            default:
                break;
        }
        return option;
    };

    renderTaskTrendStatusChart(taskStatus, height) {
        let content = '';
        if (!isEmpty(taskStatus)) {
            let statusOption = this.chartOption('taskStatus', taskStatus);
            content = (
                <BaseChart
                    id='task-trend-status-chart'
                    style={{ width: '17rem', height: height, left: '-1rem' }}
                    option={statusOption}
                    renderChart={(chart) => {
                        chart.on('click', (series) => {
                            this.handlerClick(series.data.label);
                        });
                    }}
                />
            );
        }
        return content;
    }

    renderMonitorChart(monitorAndAdu, height) {
        let content = '';
        if (!isEmpty(monitorAndAdu)) {
            let hostOption = this.chartOption('monitor', monitorAndAdu.monitor);
            content = (
                <BaseChart
                    id={`monitor-chart${Math.random()}`}
                    style={{ width: '15rem', height: height }}
                    option={hostOption}
                    renderChart={(chart) => {
                        chart.on('click', (series) => {
                            this.handlerClick(series.data.label);
                        });
                    }}
                />
            );
        }
        return content;
    }

    renderAduChart(monitorAndAdu, height) {
        let content = '';
        if (!isEmpty(monitorAndAdu)) {
            let sensorOption = this.chartOption('adu', monitorAndAdu.adu);
            content = (
                <BaseChart
                    id='adu-chart'
                    style={{ width: '15rem', height: height }}
                    option={sensorOption}
                    renderChart={(chart) => {
                        chart.on('click', (series) => {
                            this.handlerClick(series.data.label);
                        });
                    }}
                />
            );
        }
        return content;
    }

    scrollPre = () => {
        this.besinessInfoScrollHelper.scrollPre();
    };

    scrollNext = () => {
        this.besinessInfoScrollHelper.scrollNext();
    };

    setDataNumber = () => {
        if (this.besinessInfoScrollHelper) {
            this.besinessInfoScrollHelper.setNumber(3);
            this.besinessInfoScrollHelper.reset(0);
        }
    };

    renderCustomPanelList(dataList) {
        let content = [];
        if (!isEmpty(dataList)) {
            dataList.map((item, index) => {
                content.push(
                    <Col key={`cp${index}`} className='middle-bottom-col' span={8}>
                        {item}
                    </Col>
                );
            });
        }
        return content;
    }

    getCustomPanelStyle(isScrollList, index) {
        let { panelIndex } = this.state;
        return isScrollList ? { display: panelIndex == index ? 'block' : 'none' } : {};
    }

    componentWillUnmount = () => {
        if (this.besinessInfoScrollHelper) {
            this.besinessInfoScrollHelper.stopTimer();
        }
    };

    render() {
        let {
            intl: { formatMessage },
            statisticsState: { taskStatus, monitorAndAdu },
        } = this.props;
        let { isTaskLoading, isSSDLoading, panelIndex } = this.state;
        let param = getExplorerScreenRectParams();
        let isScrollList = param.clientWidth <= 1024;
        let height = '12rem';
        let dataList = [
            <CustomPanel
                style={this.getCustomPanelStyle(isScrollList, 0)}
                width='100%'
                height={height}>
                {isTaskLoading ? <Loading /> : this.renderTaskTrendStatusChart(taskStatus, height)}
            </CustomPanel>,
            <CustomPanel
                style={this.getCustomPanelStyle(isScrollList, 1)}
                width='100%'
                height={height}>
                {isSSDLoading ? <Loading /> : this.renderMonitorChart(monitorAndAdu, height)}
            </CustomPanel>,
            <CustomPanel
                style={this.getCustomPanelStyle(isScrollList, 2)}
                width='100%'
                height={height}>
                {isSSDLoading ? <Loading /> : this.renderAduChart(monitorAndAdu, height)}
            </CustomPanel>,
        ];
        return (
            <CustomPanel
                type='panel1'
                width='100%'
                height='17.2rem'
                title={formatMessage(locale.BusinessInfoStatistics)}>
                {isScrollList ? (
                    <Row
                        style={{ height: '15%', width: '100%' }}
                        align='middle'
                        type='flex'
                        justify='center'>
                        <Col span={4}>
                            <div
                                className='auto-scroll-list-arrow-pre'
                                style={{ fontSize: '1.8rem' }}
                                onClick={this.scrollPre}>
                                <svg
                                    style={{
                                        width: '1em',
                                        height: '1em',
                                        verticalAlign: 'middle',
                                        overflow: 'hidden',
                                    }}
                                    viewBox='0 0 1024 1024'
                                    version='1.1'
                                    xmlns='http://www.w3.org/2000/svg'
                                    p-id='14899'>
                                    <path
                                        d='M474.029867 55.761598c0 12.656711-6.328356 25.313422-18.985067 37.970133l-335.402845 291.104356 335.402845 291.104356c18.985067 18.985067 18.985067 44.298489 6.328356 63.283556-18.985067 18.985067-44.298489 18.985067-63.283556 6.328356l-373.372978-329.074489c-12.656711-6.328356-18.985067-18.985067-18.985067-37.970133 0-12.656711 6.328356-25.313422 18.985067-37.970133l373.372978-329.074489c18.985067-18.985067 50.626845-12.656711 63.283556 6.328356C467.701511 36.776532 474.029867 49.433243 474.029867 55.761598L474.029867 55.761598zM1018.268445 55.761598c0 12.656711-6.328356 25.313422-18.985067 37.970133l-335.402845 291.104356 335.402845 291.104356c18.985067 18.985067 18.985067 44.298489 6.328356 63.283556-18.985067 18.985067-44.298489 18.985067-63.283556 6.328356l-373.372978-329.074489c-12.656711-6.328356-18.985067-18.985067-18.985067-37.970133 0-12.656711 6.328356-25.313422 18.985067-37.970133l373.372978-329.074489c18.985067-18.985067 50.626845-12.656711 63.283556 6.328356C1011.94009 36.776532 1018.268445 49.433243 1018.268445 55.761598L1018.268445 55.761598z'
                                        p-id='14900'
                                    />
                                </svg>
                            </div>
                        </Col>
                        <Col span={16}>{dataList}</Col>
                        <Col span={4}>
                            <div
                                className='auto-scroll-list-arrow-next'
                                style={{ fontSize: '1.8rem', marginTop: '-0.5rem' }}
                                onClick={this.scrollNext}>
                                <svg
                                    style={{
                                        width: '1em',
                                        height: '1em',
                                        verticalAlign: 'middle',
                                        overflow: 'hidden',
                                    }}
                                    viewBox='0 0 1024 1024'
                                    version='1.1'
                                    xmlns='http://www.w3.org/2000/svg'
                                    p-id='14844'>
                                    <path
                                        d='M549.97 840.24c0-12.657 6.329-25.313 18.985-37.97l335.403-291.104-335.403-291.104c-18.985-18.985-18.985-44.298-6.328-63.284 18.985-18.985 44.298-18.985 63.284-6.328l373.373 329.074c12.657 6.328 18.985 18.985 18.985 37.97 0 12.657-6.329 25.313-18.985 37.97l-373.373 329.074c-18.985 18.985-50.627 12.657-63.284-6.328-6.328-18.985-12.657-31.642-12.657-37.97v0zM5.732 840.24c0-12.657 6.329-25.313 18.985-37.97l335.403-291.104-335.403-291.104c-18.985-18.985-18.985-44.298-6.328-63.284 18.985-18.985 44.298-18.985 63.284-6.328l373.373 329.074c12.657 6.328 18.985 18.985 18.985 37.97 0 12.657-6.329 25.313-18.985 37.97l-373.373 329.074c-18.985 18.985-50.627 12.657-63.284-6.328-6.328-18.985-12.657-31.642-12.657-37.97v0z'
                                        p-id='14845'
                                    />
                                </svg>
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row gutter={16}>{this.renderCustomPanelList(dataList)}</Row>
                )}
            </CustomPanel>
        );
    }
}
export default injectIntl(BusinessInfo);
