import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../locale';
import { initialCase } from '../../../../../../utils/common';

class mapLegend extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {};
    renderMapLegendLis(statusList, check, type) {
        let {
            intl: { formatMessage },
            legendClick,
        } = this.props;
        let bgColorSelected = '#093345',
            bgColorUnSelected = '#406069';
        let fontColor = '#73D1EB',
            fontColorUnSelected = '#949491';
        let content = [];
        statusList.map((item, index) => {
            let localKey = initialCase('upper', item); //item.substring(0, 1).toUpperCase() + item.substring(1);
            content.push(
                <li key={index}>
                    <a href='#' onClick={() => legendClick(item, type)}>
                        <span
                            className={item}
                            style={{
                                backgroundColor: check[item] ? bgColorSelected : bgColorUnSelected,
                            }}>
                            <span className='icon' />
                            <span style={{ color: check[item] ? fontColor : fontColorUnSelected }}>
                                {formatMessage(locale[localKey])}
                            </span>
                        </span>
                    </a>
                </li>
            );
        });
        return content;
    }
    render() {
        let { initZoom, checkCompany, checkStation, levelFlag } = this.props;
        return (
            <div className='mapLegend'>
                <div
                    className='listCompany'
                    style={{ display: initZoom < levelFlag ? 'block' : 'none' }}>
                    <ul className='company'>
                        {this.renderMapLegendLis(
                            ['normal', 'warning', 'alarm'],
                            checkCompany,
                            'company'
                        )}
                    </ul>
                </div>
                <div
                    className='listStation'
                    style={{ display: initZoom >= levelFlag ? 'block' : 'none' }}>
                    <ul className='station'>
                        {this.renderMapLegendLis(
                            ['noData', 'normal', 'warning', 'alarm'],
                            checkStation,
                            'station'
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default injectIntl(mapLegend);
