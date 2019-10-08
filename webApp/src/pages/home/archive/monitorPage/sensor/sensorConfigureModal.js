import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import UHFConfigure from '../paramterConfigure/uhfConfigure';
import HFCTConfigure from '../paramterConfigure/hfctConfigure';
import ChannelConfigure from '../paramterConfigure/channelConfigure';

@Form.create()
class SensorConfigureModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {};

    componentDidMount() {}

    renderLayout = () => {
        let { aduType, visible, onCancel } = this.props;
        switch (aduType) {
            case 1:
            case 2: //UHF
                return <UHFConfigure visible={visible} onCancel={onCancel} />;
                break;
            case 3: //HFCT
                return <HFCTConfigure visible={visible} onCancel={onCancel} />;
                break;
            case 4: //三合一
                return <ChannelConfigure visible={visible} onCancel={onCancel} />;
                break;
            default:
                return <div />;
                break;
        }
    };

    render() {
        return this.renderLayout();
    }
}
export default injectIntl(SensorConfigureModal);
