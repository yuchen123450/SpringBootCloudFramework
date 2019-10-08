import React, { Component } from 'react';
import echarts from 'echarts';
import { THRESHOLD } from '../../../constants/common';

export default class Bar extends Component {
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
    };

    componentDidMount() {
        let { data } = this.props;
        let { seriesDate } = this.state;
        // || JSON.stringify(data) !== '[]'
        if (seriesDate !== '') {
            this.renderChart(data);
            window.addEventListener('resize', this.onWindowResize.bind(this));
        }
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
        if (JSON.stringify(prevState.seriesDate) !== JSON.stringify(this.state.seriesDate)) {
            this.resetOption();
            window.addEventListener('resize', this.onWindowResize.bind(this));
        }
    }
    componentWillUnmount() {
        this.setState({
            seriesDate: '',
            chartOption: '',
        });
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
        let yList = [];
        let yData = data.yData;
        yData.map((item) => {
            yList.push(item < 0 ? 0 : item > THRESHOLD.TEVMAX ? THRESHOLD.TEVMAX : item);
        });
        let option = {
            color: ['#a9be46'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function(params) {
                    let tar = params[0];
                    let yDataIndex = yData[tar.dataIndex];
                    let value =
                        yDataIndex < 0
                            ? '<0'
                            : yDataIndex > THRESHOLD.TEVMAX
                            ? `>${THRESHOLD.TEVMAX}`
                            : tar.value;
                    return `${tar.name} : ${value}`;
                },
            },
            grid: {
                top: '5%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: data.xAxis,
                axisTick: {
                    alignWithLabel: true,
                },
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: yList,
                    barWidth: '25%',
                    barMaxWidth: 25,
                    type: 'bar',
                },
            ],
        };
        return option;
    }

    renderChart() {
        let chart = this.initChart();
        chart.on('click', this.lineClick.bind(this));
        let option = this.initOption(this.props.data);
        chart.setOption(option);
        chart.resize();
    }

    resetOption() {
        let chart = this.initChart();
        chart.clear();
        let option = this.initOption(this.props.data);
        chart.setOption(option);
        chart.resize();
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
