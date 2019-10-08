import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../../locale';
import { isEmpty, isEqual } from '../../../../../../utils/common';

class mapCrumbs extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {};

    onNavClick = (e, item) => {
        let { onMapCrumbsClick } = this.props;
        onMapCrumbsClick('Nav', item);
    };

    onAllClick = (e) => {
        let { onMapCrumbsClick } = this.props;
        onMapCrumbsClick('All');
    };

    loadNavMapCrumbs = (data) => {
        let content = [];
        if (!isEmpty(data)) {
            data.map((item, index) => {
                content.push(
                    <span key={index}>
                        <Icon type='right' style={{ color: '#fff' }} />
                        <Button
                            onClick={() => {
                                this.onNavClick(this, item);
                            }}
                            style={{ color: '#fff', backgroundColor: 'rgb(64, 146, 218, 0.5)' }}>
                            {item.companyName}
                        </Button>
                    </span>
                );
            });
        }
        return <span>{content}</span>;
    };

    render() {
        let {
            intl: { formatMessage },
            companySelectedArr,
        } = this.props;
        return (
            <div className='mapCrumbs'>
                <Button
                    style={{ color: '#fff', backgroundColor: 'rgb(64, 146, 218, 0.5)' }}
                    onClick={() => {
                        this.onAllClick(this);
                    }}>
                    {formatMessage(locale.All)}
                </Button>
                {this.loadNavMapCrumbs(companySelectedArr)}
            </div>
        );
    }
}

export default injectIntl(mapCrumbs);
