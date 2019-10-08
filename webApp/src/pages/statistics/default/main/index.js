import React, { PureComponent, Fragment } from 'react';
import { CONFIG } from '../../../../configs';
import MapPoint from './layout/map';
import StationStatus from './layout/stationStatus';
import DeviceStatus from './layout/deviceStatus';
import AlarmData from './layout/alarmData';
import BusinessInfo from './layout/businessInfo';

class MainPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            substationIds: '',
            testType: 2,
            mapLayerType: '', //'companylayer'，'stationlayer',
            initZoom: CONFIG.mapbox.initZoom,
            levelFlag: CONFIG.mapbox.initZoom + 3.5,
            companyId: null,
        };
    }
    static defaultProps = {};

    componentDidMount() {
        let { initZoom, levelFlag } = this.state;
        this.setState({
            mapLayerType: initZoom < levelFlag ? 'companylayer' : 'stationlayer',
        });
    }

    render() {
        let { initZoom, testType, levelFlag, mapLayerType, substationIds, companyId } = this.state;
        return (
            <Fragment>
                <MapPoint
                    initZoom={initZoom}
                    testType={testType}
                    levelFlag={levelFlag}
                    size={10}
                    getMapZoom={(type) => {
                        this.setState({
                            mapLayerType: type,
                        });
                    }}
                />
                <StationStatus substationIds={substationIds} />
                <div className='content-center'>
                    {mapLayerType == 'companylayer' ? (
                        <AlarmData substationIds={substationIds} />
                    ) : (
                        <BusinessInfo companyId={companyId} />
                    )}
                </div>
                <DeviceStatus substationIds={substationIds} />

                {/* </div> */}
            </Fragment>
        );
    }
}

export default MainPage;
