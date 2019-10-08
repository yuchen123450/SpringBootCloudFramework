import React from 'react';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import BaseChart from '../../../../../../components/baseChart';
import Enum from '../../../../../../utils/enum';
import { isEmpty } from '../../../../../../utils/common';
import { getCurrentBaseRem } from '../../../../../../utils/dom';
class AbnormalRateTrend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {};

    handlerChartData(data) {
        let dateTime = [],
            value = [],
            valueList = [];
        data.map((item) => {
            dateTime.push(item.statisticsTime);
            value.push(item.abnormalRate);
        });
        return {
            dateTime: dateTime,
            valueList: [{ value: value, valueType: 'abnormalRate', valueUnit: '8' }],
        };
    }

    chartOption = (data, keyType) => {
        let {
            intl: { formatMessage, formats },
        } = this.props;
        let rem = getCurrentBaseRem();
        let valueData = {},
            legendData = [],
            dateTime = [],
            yAxisName = '';
        if (!isEmpty(data)) {
            data = this.handlerChartData(data);
            valueData = data.valueList[0];
            legendData = Enum.chartTrendValueType(valueData.valueType);
            data.dateTime.map((el) => {
                dateTime.push(moment.unix(el).format(formats.date));
            });
            yAxisName = `(${Enum.getUnitEnum(Number(valueData.valueUnit))})`;
        }
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
            // title: {
            //     text: keyType
            // },
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '0.5rem', //'8px',//'10%', //左边的距离
                right: '4.8%', //'2rem',//'8px',//'10%', //右边的距离
                bottom: '4.8%', //0.5 * rem,
                containLabel: true,
            },
            legend: {
                data: [legendData],
                textStyle: labelStyle,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: dateTime, //['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07'],
                axisLine: axisLine,
                axisLabel: labelStyle,
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                axisLine: axisLine,
                axisLabel: labelStyle,
                nameTextStyle: labelStyle,
                splitLine: axisLine,
                min: 0,
                max: 100,
            },
            series: [
                {
                    name: legendData, //formatMessage(locale.AbnormalRate),
                    data: valueData.value, //[820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    // symbol: 'circle',
                    // symbolSize: 3,
                    itemStyle: {
                        normal: {
                            color: '#01e8fa',
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(8, 166, 191, 1)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(255, 255, 255, 0.1)',
                                },
                            ]),
                        },
                    },
                },
            ],
        };

        return option;
    };

    render() {
        let { id, data } = this.props;
        return (
            <BaseChart
                id={id}
                className='task-trend-count-chart'
                option={this.chartOption(data, id)}
                renderChart={(chart) => {
                    chart.on('click', (series) => {
                        this.handlerClick(series.data.label);
                    });
                }}
            />
        );
    }
}
export default injectIntl(AbnormalRateTrend);
