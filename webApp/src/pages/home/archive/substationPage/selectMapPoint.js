import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { locale } from '../../../locale';
import Map from '../../../../containers/map';
import { isEmpty } from '../../../../utils/common';
import { CONFIG } from '../../../../configs';

class SelectMapPointModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            coords: {},
        };
    }

    static defaultProps = {
        width: 800,
        bodyStyle: { height: 500, padding: 0 },
        destroyOnClose: true,
        maskClosable: false,
    };

    componentDidMount() {}

    render() {
        let {
            onOk,
            point,
            center,
            intl: { formatMessage },
            ...rest
        } = this.props;
        return (
            <Modal
                onOk={() => {
                    let { coords } = this.state;
                    if (isEmpty(coords)) {
                        coords = {
                            lng: point[0],
                            lat: point[1],
                        };
                    }
                    onOk(coords);
                }}
                {...rest}>
                <div className='map'>
                    <Map
                        draggable={true}
                        levelFlag={CONFIG.mapbox.initZoom + 3.5}
                        dragPointHandler={(coords) => {
                            this.setState({
                                coords,
                            });
                        }}
                        locale={{
                            lng: formatMessage(locale.Longitude),
                            lat: formatMessage(locale.Latitude),
                        }}
                        center={center}
                        initZoom={6}
                        geojson={{
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: point,
                                    },
                                },
                            ],
                        }}
                    />
                </div>
            </Modal>
        );
    }
}
export default injectIntl(SelectMapPointModal);
