import React, { Component } from 'react';
import { Modal, Icon } from 'antd';

class ModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static defaultProps = {
        closable: true,
    };

    render() {
        let { children, closable, ...rest } = this.props;
        return (
            <Modal
                closeIcon={<Icon type='close-circle' />}
                destroyOnClose={true}
                forceRender={true}
                closable={closable}
                {...rest}>
                {children}
            </Modal>
        );
    }
}
export default ModalComponent;
