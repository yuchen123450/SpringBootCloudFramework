import React from 'react';
import { Row, Col } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../locale';
import { initialCase, isEmpty } from '../../../../../../utils/common';
import CustomPanel from '../../../../../../components/statistical/box';
import BaseChart from '../../../../../../components/baseChart';
import LCDComponent from '../../../../../../components/statistical/LCD';

class StatusEvaluate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {
        data: '',
    };

    chartOption = (data) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let color = ['#159E54', '#FF7A0C', '#FA3E51', '#16cFF7'];
        let option = {
            color: color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            series: [
                {
                    type: 'pie',
                    radius: ['100%', '95%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 1,
                    label: {
                        normal: {
                            show: false,
                        },
                        emphasis: {
                            show: false,
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: [
                        { value: data.normalCount, name: formatMessage(locale.Normal), label: 0 },
                        { value: data.warningCount, name: formatMessage(locale.Warning), label: 1 },
                        { value: data.alarmCount, name: formatMessage(locale.Alarm), label: 2 },
                    ],
                },
            ],
        };
        return option;
    };

    handlerClick = (key) => {
        console.log(key);
    };

    convertToLocal = (key) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let localeStatus = '';
        switch (key) {
            case 'normalCount':
                localeStatus = formatMessage(locale.Normal);
                break;
            case 'warningCount':
                localeStatus = formatMessage(locale.Warning);
                break;
            case 'alarmCount':
                localeStatus = formatMessage(locale.Alarm);
                break;
        }
        return localeStatus;
    };

    renderItems = (data) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let dataList = {
            Normal: data.normalCount,
            Warning: data.warningCount,
            Alarm: data.alarmCount,
        };
        var items = [];
        for (let key in dataList) {
            items.push(
                <li
                    key={key}
                    onClick={() => {
                        this.handlerClick(key);
                    }}>
                    <div />
                    <div>{formatMessage(locale[key])}</div>
                    <div>{dataList[key]}</div>
                </li>
            );
        }
        return items;
    };

    renderDeviceStatus = (data) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let dataList = {
            Normal: data.normalCount,
            Warning: data.warningCount,
            Alarm: data.alarmCount,
        };
        let items = [];
        for (let key in dataList) {
            let classN = initialCase('lower', key);
            items.push(
                <li key={key}>
                    <div>
                        <div className={classN} />
                        <span className='label'>{formatMessage(locale[key])}</span>
                        <span className='text'>{dataList[key]}</span>
                    </div>
                </li>
            );
        }
        return items;
    };

    render() {
        let {
            intl: { formatMessage },
            contentType,
            data,
        } = this.props;
        return isEmpty(data) ? (
            ''
        ) : (
            <Row type='flex' align='middle' style={{ height: '100%' }}>
                <Col span={16} style={{ height: '100%', marginLeft: '-1rem' }}>
                    {contentType == 'substation' ? (
                        <div className='rotate-pie'>
                            <div className='rotate-pie-bg' />
                            <div className='rotate-pie-count'>
                                <BaseChart
                                    id='rotate-pie-count-chart'
                                    option={this.chartOption(data)}
                                    renderChart={(chart) => {
                                        chart.on('click', (series) => {
                                            this.handlerClick(series.data.label);
                                        });
                                    }}
                                />
                                <ul>{this.renderItems(data)}</ul>
                            </div>
                        </div>
                    ) : (
                        <div className='panellist'>
                            <ul className='content'>{this.renderDeviceStatus(data)}</ul>
                        </div>
                    )}
                </Col>
                <Col span={8}>
                    <CustomPanel width='8rem' height='8.6rem'>
                        <div className='evalContent'>
                            <div className='evalSum'>
                                <span className='text'>{formatMessage(locale.Summation)}</span>
                                <span className='total'>
                                    <LCDComponent size='' color='#73D1EB'>
                                        {data.totalCount}
                                    </LCDComponent>
                                </span>
                            </div>
                            <div className='evalSum'>
                                <span className='text'>{formatMessage(locale.AbnormalRate)}</span>
                                <span className='total'>
                                    <LCDComponent size='' color='#73D1EB'>
                                        {isEmpty(data.abnormalRatio)
                                            ? ''
                                            : `${data.abnormalRatio}%`}
                                    </LCDComponent>
                                </span>
                            </div>
                        </div>
                    </CustomPanel>
                </Col>
            </Row>
        );
    }
}
export default injectIntl(StatusEvaluate);
