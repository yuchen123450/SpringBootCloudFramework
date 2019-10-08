import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../locale';
import Map from '../../../../../containers/map';
import MapCrumbs from '../containers/mapCrumbs';
import MapLegend from '../containers/mapLegend';
import eventProxy from '../../../../../utils/eventProxy';
import { isEmpty } from '../../../../../utils/common';
import { statisticsAction } from '../../../../../actions';
import {
    getStationGeoJson,
    groupStationGeoJsonByStatus,
    getCompanyGeoJson,
} from './handlerGeoJson';
import { toast } from '../../../../../components/toast';
import { CONFIG } from '../../../../../configs';

@connect(
    (state) => ({
        statisticsState: state.statisticsReducer,
    }),
    (dispatch) => ({
        getSubstationStatus: (companyId) =>
            dispatch(statisticsAction.getSubstationStatus(companyId)),
        getCompany: (companyId) => dispatch(statisticsAction.getCompany(companyId)),
    })
)
class MapPoint extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            center: [0, 0],
            geojson: {}, //站点GeoJson数据
            geojsonGroup: {}, //根据状态分组后的站点GeoJson数据
            companyGeojson: {}, //公司GeoJson数据
            directStationGeojson: {}, //公司直属站GeoJson数据
            detail: {
                visible: false,
            },
            companySelectedArr: [], //被选中的公司名称数组
            stationName: '',
            checkCompany: {
                //公司图例状态
                alarm: true,
                warning: true,
                normal: true,
            },
            checkStation: {
                //站点图例状态
                noData: true,
                alarm: true,
                warning: true,
                normal: true,
            },
            currentZoom: 0,
            substation: {},
        };
    }
    static defaultProps = {};

    componentDidMount = () => {
        this.getData('');
    };

    getData = async (companyId, companyNameSelected, mapCenter) => {
        let {
            getSubstationStatus,
            getCompany,
            size,
            intl: { formatMessage },
        } = this.props;
        let resCompany = await getCompany(companyId);
        if (resCompany.success) {
            //更新面包屑导航的被选中公司名称
            this.setState({
                companySelectedArr: isEmpty(companyNameSelected) ? [] : companyNameSelected,
            });
            //更新公司list和直属站list
            if (!isEmpty(resCompany.data)) {
                if (mapCenter) {
                    //没有子公司时，地图缩放到站层级
                    eventProxy.trigger(
                        'zoomToStationLayer',
                        resCompany.data.companyList.length == 0,
                        mapCenter
                    );
                }
                let companyGeojson = getCompanyGeoJson(resCompany.data.companyList);
                let directStationGeojson = getStationGeoJson(
                    resCompany.data.directStationList,
                    size
                );
                this.setState({
                    companyGeojson,
                    directStationGeojson,
                });
            }
        }
        //请求站list
        let res = await getSubstationStatus(companyId);
        if (res.success) {
            if (!isEmpty(res.data)) {
                let { checkStation } = this.state;
                let sGeojson = getStationGeoJson(res.data, size);
                let geojsonGroup = groupStationGeoJsonByStatus(sGeojson, checkStation);
                this.setState({
                    center: CONFIG.mapbox.center,
                    substationStatus: res.data,
                    geojson: sGeojson,
                    geojsonGroup: geojsonGroup,
                });
            }
        }
    };

    renderMapDetail() {
        let {
            detail: { visible },
            substationId,
            substation,
            substationStatus,
        } = this.state;
        return;
        // visible ? (
        // 	<MapDetail
        // 		visible={visible}
        // 		showFocus={true}
        // 		stationId={substationId}
        // 		substationStatus={substationStatus}
        // 		substation={substation}
        // 		hideModal={() => {
        // 			this.setState({
        // 				detail: {
        // 					visible: false,
        // 				},
        // 			});
        // 		}}
        // 	/>
        // ) : null;
    }
    onRef = (ref) => {
        this.child = ref;
    };
    changeStationName = (stationName) => {
        this.setState({ stationName });
    };
    getMapZoom = (currentZoom, type) => {
        this.setState({
            currentZoom,
        });
        let listCompanyEL = document.getElementsByClassName('listCompany');
        let listStationEL = document.getElementsByClassName('listStation');
        listCompanyEL[0].style.display = type == 'companylayer' ? 'block' : 'none';
        listStationEL[0].style.display = type == 'stationlayer' ? 'block' : 'none';
        this.props.getMapZoom && this.props.getMapZoom(type);
    };
    //type: {'alarm','warning','normal'}
    //key:{'company','station'}
    legendClick = (type, key) => {
        if (key == 'company') {
            let {
                checkCompany: { alarm, warning, normal },
            } = this.state;
            this.setState({
                checkCompany: {
                    alarm: type == 'alarm' ? !alarm : alarm,
                    warning: type == 'warning' ? !warning : warning,
                    normal: type == 'normal' ? !normal : normal,
                },
            });
        } else if (key == 'station') {
            let {
                checkStation: { noData, alarm, warning, normal },
            } = this.state;
            this.setState(
                {
                    checkStation: {
                        noData: type == 'noData' ? !noData : noData,
                        alarm: type == 'alarm' ? !alarm : alarm,
                        warning: type == 'warning' ? !warning : warning,
                        normal: type == 'normal' ? !normal : normal,
                    },
                },
                () => {
                    let { geojson, checkStation } = this.state;
                    let geojsonGroup = groupStationGeoJsonByStatus(geojson, checkStation);
                    this.setState({
                        geojsonGroup: geojsonGroup,
                    });
                }
            );
        }
    };

    onCompanyClick = (companyId, companyName, mapCenter) => {
        let { companySelectedArr } = this.state;
        if (!isEmpty(companyName)) {
            companySelectedArr.push({ companyName, companyId });
        }
        this.getData(companyId, companySelectedArr, mapCenter);
        eventProxy.trigger('companySelected', companyId, companyName);
    };

    onMapCrumbsClick = (type, value) => {
        let csArr = [],
            companyId = '',
            companyName = '';
        if (type == 'All') {
            this.child.initPosition(); //重置地图位置
            this.setState({
                //更新面包屑路径为全部
                companySelectedArr: [],
            });
        } else if (type == 'Nav') {
            companyId = value.companyId;
            companyName = value.companyName;
            let { companySelectedArr } = this.state;
            let csIndex = 0;
            companySelectedArr.map((item, index) => {
                if (item.companyId == value.companyId) {
                    csIndex = index;
                }
            });
            csArr = companySelectedArr.slice(0, csIndex + 1);
        }
        this.getData(companyId, csArr);
        eventProxy.trigger('companySelected', companyId);
    };
    componentWillUnmount() {
        eventProxy.off('companySelected');
    }

    onCompanyHover = (companyId, companyName, mapCenter) => {
        // eventProxy.trigger('companyHover', companyId);
    };

    onSubstationClick = (substationId) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { substationStatus } = this.state;
        let substation = substationStatus.filter(
            (station) => station.substationId == substationId
        )[0];
        // if (substation) {
        // 	if (substation.hasData == '2') {
        // 		// == '2'
        // 		this.setState({
        // 			substationId: substationId,
        // 			substation: substation,
        // 			detail: {
        // 				visible: true,
        // 			},
        // 		});
        // 	} else if (substation.hasData == '1') {
        // 		//提示没有智能传感器数据
        // 		toast('info', formatMessage(locale.NoSmartSensorData));
        // 	} else {
        // 		//提示无数据
        // 		toast('info', formatMessage(locale.NoData));
        // 	}
        // }
        eventProxy.trigger(
            'changeMenuAction',
            substation.companyId,
            substation,
            substation.companyName,
            'substation/dataStatistics'
        );
    };

    render() {
        let {
            levelFlag,
            initZoom,
            intl: { formatMessage },
        } = this.props;
        let {
            center,
            geojsonGroup,
            companyGeojson,
            directStationGeojson,
            companySelectedArr,
            checkCompany,
            checkStation,
        } = this.state;
        //  let initZoom = center[0] === 0 ? 3 : 5;
        return (
            <div className='map'>
                <Map
                    onRef={this.onRef}
                    center={center}
                    initZoom={initZoom}
                    geojson={geojsonGroup}
                    levelFlag={levelFlag}
                    companyGeojson={companyGeojson}
                    directStationGeojson={directStationGeojson}
                    checkedCompany={checkCompany}
                    getMapZoom={this.getMapZoom}
                    // changeStationName={this.changeStationName}
                    onPointClick={this.onSubstationClick}
                    onCompanyClick={this.onCompanyClick}
                    onCompanyHover={this.onCompanyHover}
                />
                <MapLegend
                    initZoom={initZoom}
                    levelFlag={levelFlag}
                    checkCompany={checkCompany}
                    checkStation={checkStation}
                    legendClick={this.legendClick}
                />
                <MapCrumbs
                    companySelectedArr={companySelectedArr}
                    onMapCrumbsClick={this.onMapCrumbsClick}
                />
                {/* {this.renderMapDetail()} */}
            </div>
        );
    }
}
export default injectIntl(MapPoint);
