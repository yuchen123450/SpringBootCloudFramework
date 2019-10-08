import React, { Component } from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { locale } from '../../pages/locale';
import { isEmpty, decimalsByUnit } from '../../utils/common';
import { getCurrentBaseRem } from '../../utils/dom';
import Enum from '../../utils/enum';
import { THRESHOLD } from '../../constants/common';

class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seriesDate: '',
            chartOption: '',
        };
    }

    static defaultProps = {
        data: [],
        symbol: null,
        isLegend: true,
        isMarkPoint: false,
        lineColor: null,
    };

    componentDidMount() {
        let { data } = this.props;
        this.renderChart(data);
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.seriesDate) {
            return {
                seriesDate: nextProps.data,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.seriesDate !== this.state.seriesDate) {
            // this.renderChart();
            // this.initOption();
            this.resetOption();
        }
    }

    onWindowResize() {
        let chart = this.initChart();
        chart.resize();
    }

    initChart() {
        let chartDiv = this.refs.chart;
        let chart = echarts.getInstanceByDom(chartDiv);
        if (chart === undefined) {
            chart = echarts.init(chartDiv);
        }
        return chart;
    }

    lineClick(params) {
        this.props.onLineClick(params);
    }

    initOption(data) {
        let {
            intl: { formatMessage, formats },
            isSecondTrend,
            cssMode,
            latestDetail,
            lineColor,
        } = this.props;
        let threshold =
            latestDetail &&
            latestDetail.dataType == 74 &&
            latestDetail.data &&
            latestDetail.data.length > 0 &&
            latestDetail.data[0].threshold &&
            latestDetail.data[0].threshold.value
                ? latestDetail.data[0].threshold.value
                : 100;
        let dateTime = [];
        let rem = getCurrentBaseRem();
        if (!isSecondTrend) {
            data.dateTime.map((el) => {
                dateTime.push(moment.unix(el).format(formats.dateTime));
            });
        } else {
            data.dateTime.map((el) => {
                dateTime.push(moment.unix(el).format(formats.date));
            });
        }
        let color = data.color ? data.color : ['#FFCC00', '#00CC00', '#FF0000', '#16cFF7'];
        let labelColor = cssMode == 'transparent' ? '#fff' : '#000';
        let lineStyle = lineColor ? { color: lineColor } : {};
        let itemStyle = lineColor ? { color: '#fff' } : {};
        let seriesData = [];
        let legendData = [];
        let yAxis = [];
        let { channelType, isMarkPoint } = this.props;
        let axisLine = {
            lineStyle: {
                color: labelColor,
                fontSize: (rem * 3) / 4,
                width: 0.06 * rem,
            },
        };
        if (data.valueList && data.valueList.length > 0) {
            //
            let yUnit = [...new Set(data.valueList.map((d) => d.valueUnit))];

            yUnit.map((unit, index) => {
                let unitStr = Enum.getUnitEnum(Number(unit));
                yAxis.push({
                    type: 'value',
                    position: index % 2 ? 'right' : 'left',
                    name: isEmpty(unit) ? '' : formatMessage(locale.UnitFormat, { unit: unitStr }),
                    nameTextStyle: {
                        color: labelColor,
                        fontSize: (rem * 4) / 5,
                    },
                    nameGap: rem * 0.8,
                    axisLabel: {
                        color: labelColor,
                        formatter: '{value}',
                        fontSize: (rem * 3) / 4,
                    },
                    axisLine: axisLine,
                    min: (value) => (value.min * 1.2 > 0 ? 0 : Math.floor(value.min * 1.2)),
                    max:
                        channelType && channelType == 26
                            ? '60'
                            : (value) => (value.max * 1.2 < 0 ? 0 : Math.ceil(value.max * 1.2)),
                    splitLine: {
                        show: false,
                    },
                    smooth: true,
                });
            });

            data.valueList.map((data) => {
                if (channelType == 0) {
                    data.value = data.value.map((d) => {
                        let resValue;
                        if (parseFloat(d) < 0) {
                            resValue = 0;
                        } else if (parseFloat(d) > THRESHOLD.TEVMAX) {
                            resValue = THRESHOLD.TEVMAX;
                        } else {
                            resValue = parseFloat(d).toFixed(0);
                        }
                        return resValue;
                    });
                } else if (channelType == 63 || channelType == 58) {
                    if (data.valueUnit == 'kVar' || data.valueUnit == 'kW') {
                        data.value = data.value.map((d) => (parseFloat(d) / 1000).toFixed(3));
                    } else {
                        data.value = data.value.map((d) => parseFloat(d).toFixed(2));
                    }
                } else if (channelType == 72) {
                    if (data.valueUnit == '5') {
                        data.value = data.value.map((d) => parseFloat(d).toFixed(2));
                    } else {
                        data.value = data.value.map((d) => parseFloat(d).toFixed(1));
                    }
                } else if (channelType == 75) {
                    data.value = data.value.map((d) => parseFloat(d).toFixed(2));
                } else {
                    if (data.valueUnit) {
                        let unit = Enum.getUnitEnum(data.valueUnit);
                        data.value = data.value.map((d) => decimalsByUnit(d, unit, 'onlyData'));
                    } else {
                        data.value = data.value.map((d) => parseFloat(d).toFixed(0));
                    }
                }
                let trendType = Enum.chartTrendValueType(data.trendType);
                legendData.push(trendType);
                seriesData.push({
                    name: trendType,
                    type: 'line',
                    smooth: true,
                    yAxisIndex: yUnit.indexOf(data.valueUnit),
                    data: data.value,
                    lineStyle: lineStyle,
                    itemStyle: itemStyle,
                    markPoint: isMarkPoint
                        ? {
                              data: [
                                  { type: 'max', name: formatMessage(locale.Max) },
                                  { type: 'min', name: formatMessage(locale.Min) },
                              ],
                              symbolSize: 2 * rem,
                              itemStyle: {
                                  color: '#73D1EB',
                              },
                              label: {
                                  fontSize: 0.5 * rem,
                              },
                          }
                        : {},
                    markLine:
                        channelType == 74 || channelType == 26
                            ? {
                                  animation: false,
                                  silent: true,
                                  data: [
                                      {
                                          yAxis: channelType == 74 ? threshold : 45,
                                      },
                                  ],
                                  label: {
                                      position: 'middle',
                                      formatter: function(p) {
                                          return `${formatMessage(locale.AlarmLine)}：${p.value}°C`;
                                      },
                                  },
                                  itemStyle: {
                                      normal: {
                                          lineStyle: {
                                              color: '#FA3E51',
                                          },
                                      },
                                  },
                              }
                            : '',
                });
            });
        } else {
            yAxis = {};
        }
        let { isLegend } = this.props;
        let legendObj = isLegend
            ? {
                  data: legendData,
                  textStyle: {
                      color: labelColor,
                      fontSize: (rem * 3) / 4,
                  },
              }
            : {
                  show: false,
              };
        let option = {
            color: color,
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                // 	type: 'shadow',
                // 	label: {
                // 		backgroundColor: 'null',
                // 		textStyle: {
                // 			fontSize: rem * 3 / 4,
                // 		},
                // 	},
                // 	crossStyle: {
                // 		color: '#999',
                // 	},
                // },
                textStyle: {
                    fontSize: (rem * 4) / 5,
                },
            },
            legend: legendObj,
            grid: {
                left: '3%',
                right: '6%',
                bottom: '3%',
                top: rem * 2.5,
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: dateTime,
                    nameTextStyle: {
                        fontSize: (rem * 4) / 5,
                    },
                    axisLabel: {
                        fontSize: (rem * 3) / 4,
                        formatter: function(val) {
                            return val.split(' ').join('\n');
                        },
                    },
                    axisPointer: {
                        type: 'shadow',
                    },
                    axisLine: axisLine,
                    splitLine: {
                        show: false,
                    },
                    boundaryGap: true,
                },
            ],
            yAxis: yAxis,
            visualMap:
                channelType == 74
                    ? {
                          top: 0,
                          right: 10,
                          textStyle: {
                              color: labelColor,
                              fontSize: (rem * 3) / 4,
                          },
                          pieces: [
                              {
                                  gt: 0,
                                  lte: threshold,
                                  color: '#159E54',
                              },
                              {
                                  gt: threshold,
                                  color: '#FA3E51',
                              },
                          ],
                          outOfRange: {
                              color: '#999',
                          },
                      }
                    : '',
            series: seriesData,
        };
        return option;
    }

    renderChart() {
        let chart = this.initChart();
        chart.on('click', this.lineClick.bind(this));
        let option = this.initOption(this.props.data);
        chart.setOption(option);
    }

    resetOption() {
        let chart = this.initChart();
        chart.clear();
        let option = this.initOption(this.props.data);
        chart.setOption(option);
    }

    render() {
        return (
            <div
                ref='chart'
                className='text-align-center'
                style={{ width: '100%', height: '100%' }}
            />
        );
    }
}

export default injectIntl(Line);
