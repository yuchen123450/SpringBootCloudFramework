import React, { Fragment } from 'react';
import mapboxgl from 'mapboxgl';
import { CONFIG } from '../../configs';
import { isEmpty, isEqual } from '../../utils/common';
import InitMapControl from './initMap';
import { addPoints, removePoints } from './addPoints';
import { addMarkers, removeMarker } from './addMarkers';
import eventProxy from '../../utils/eventProxy';

class MapInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            init: false,
            // initZoom: this.props.center[0] === 0 ? 3 : 5,
            initZoom: props.initZoom,
            checkCompany: {
                alarm: false,
                warning: false,
                normal: false,
            },
            stationGeoJson: props.geojson,
            companyGeojson: props.companyGeojson,
            mapLoad: false,
        };
        this.markerArr = {
            alarm: [],
            warning: [],
            normal: [],
        };
        this.addLayer = false;
        this.timeInterval = null;
        // this.map = null;
    }

    static defaultProps = {
        title: '',
        center: CONFIG.mapbox.center,
        geojson: {},
    };
    static getDerivedStateFromProps(props, state) {
        let geojsonFlag = false,
            companyGeojsonFlag = false,
            checkedCompamyFlag = false;
        if (isEqual(props.geojson, state.stationGeoJson) == false) {
            geojsonFlag = true;
        }
        if (isEqual(props.companyGeojson, state.companyGeojson) == false) {
            companyGeojsonFlag = true;
        }
        if (isEqual(props.checkedCompany, state.checkCompany) == false) {
            checkedCompamyFlag = true;
        }
        if (geojsonFlag || companyGeojsonFlag || checkedCompamyFlag) {
            return {
                stationGeoJson: geojsonFlag ? props.geojson : state.stationGeoJson,
                companyGeojson: companyGeojsonFlag ? props.companyGeojson : state.companyGeojson,
                checkCompany: checkedCompamyFlag ? props.checkedCompany : state.checkCompany,
            };
        }
        return null;
    }

    componentDidMount = () => {
        let { onRef } = this.props;
        if (onRef) {
            onRef(this);
        }
        this.timeInterval = window.setInterval(() => {
            let { map } = this.state;
            if (map) {
                if (map.loaded()) {
                    this.setState(
                        {
                            mapLoad: true,
                        },
                        () => {
                            window.clearInterval(this.timeInterval);
                            this.timeInterval = null;
                        }
                    );
                }
            } else {
                this.setState({
                    map: this.initMap(mapboxgl),
                });
            }
        }, 500);
        this.receiveEvent();
    };

    componentDidUpdate(prevProps, prevState) {
        let { dragPointHandler } = this.props;
        let { map, checkCompany, stationGeoJson, companyGeojson, mapLoad } = this.state;
        if (!dragPointHandler && map !== null && mapLoad) {
            //公司层级
            let prevStateCheck = prevState.checkCompany;
            if (prevStateCheck.alarm !== checkCompany.alarm) {
                this.handlerMarker(map, checkCompany.alarm, 'alarm');
            }
            if (prevStateCheck.warning !== checkCompany.warning) {
                this.handlerMarker(map, checkCompany.warning, 'warning');
            }
            if (prevStateCheck.normal !== checkCompany.normal) {
                this.handlerMarker(map, checkCompany.normal, 'normal');
            }
            //刷新测点layer
            if (isEqual(stationGeoJson, prevState.stationGeoJson) == false) {
                if (map.getSource('stationPoints')) {
                    removePoints(map, 'stationPoints');
                }
                this.loadAddPoints(map, stationGeoJson, 'stationPoints');
            }
            //刷新公司图标；
            if (prevState.companyGeojson !== companyGeojson) {
                let {
                    onCompanyClick,
                    directStationGeojson,
                    levelFlag,
                    onCompanyHover,
                } = this.props;
                let markerArrClear = removeMarker('', this.markerArr);
                this.markerArr = addMarkers(
                    map,
                    '',
                    markerArrClear,
                    onCompanyClick,
                    companyGeojson,
                    onCompanyHover
                );
                if (map.getSource('directStationPoints')) {
                    removePoints(map, 'directStationPoints');
                }
                this.loadAddPoints(map, directStationGeojson, 'directStationPoints');
            }
        }
    }

    receiveEvent = () => {
        eventProxy.on('handlerMarker', (map, checkedCompany, key) => {
            this.handlerMarker(map, checkedCompany, key);
        });
        eventProxy.on('handlerMarkerOnZoom', (flag, currentZoom, mapLayerType) => {
            let { getMapZoom } = this.props;
            if (getMapZoom) {
                getMapZoom(currentZoom, mapLayerType);
            }
            this.markerArr = removeMarker('', this.markerArr);
            if (flag) {
                let { map } = this.state;
                let { checkedCompany } = this.props;
                let markers = this.markerArr;
                for (var i in markers) {
                    if (markers[i].length == 0) {
                        this.handlerMarker(map, checkedCompany[i], `${i}`);
                    }
                }
            } else {
                this.markerArr = removeMarker('', this.markerArr);
            }
        });
        eventProxy.on('updateInit', (initDataHanlerFlag) => {
            let { init } = this.state;
            if (initDataHanlerFlag) {
                this.setState({
                    init: !init,
                });
            } else {
                this.setState({
                    init: false,
                });
            }
        });
        eventProxy.on('zoomToStationLayer', (flag, mapCenter) => {
            let { map } = this.state;
            let { levelFlag } = this.props;
            if (map !== null) {
                if (flag) {
                    map.easeTo({
                        center: mapCenter,
                        zoom: levelFlag + 0.1,
                    });
                } else {
                    let cZoom = map.getZoom() + 1,
                        cLevelFlag = levelFlag - 0.5;
                    let mapZoom = cZoom < cLevelFlag ? cZoom : cLevelFlag;
                    map.easeTo({
                        center: mapCenter,
                        zoom: mapZoom,
                    });
                }
            }
        });
    };

    initPosition() {
        let { map, initZoom } = this.state;
        let { center } = this.props;
        if (map) {
            map.setZoom(initZoom);
            map.setCenter(center);
        }
    }

    initMap = () => {
        let { center } = this.props;
        let { initZoom } = this.state;
        let style = CONFIG.mapbox.online.style;
        if (CONFIG.mapbox.online.accessToken) {
            mapboxgl.accessToken = CONFIG.mapbox.online.accessToken;
        } else {
            style = require(`./mapStyle/${style}`).mapStyle;
        }
        center = center[0] == 0 ? CONFIG.mapbox.center : center;
        let map = new mapboxgl.Map({
            container: 'mapDiv',
            zoom: initZoom,
            minZoom: CONFIG.mapbox.minZoom,
            maxZoom: CONFIG.mapbox.maxZoom,
            center: center,
            style: style,
        });

        map.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
            }),
            'top-left'
        );

        map.addControl(
            new InitMapControl({
                center: center,
                zoom: initZoom,
            }),
            'top-left'
        );

        return map;
    };

    renderMap = (geojson, directStationGeojson) => {
        let { dragPointHandler } = this.props;
        let { map } = this.state;
        if (!isEmpty(map) && !isEmpty(geojson)) {
            if (dragPointHandler) {
                this.addDraggablePoint(map, geojson);
            }
            let _self = this;
            map.on('load', function() {
                _self.loadAddPoints(map, geojson, 'stationPoints');
                if (!isEmpty(directStationGeojson)) {
                    _self.loadAddPoints(map, directStationGeojson, 'directStationPoints');
                }
            });
        }
    };

    addDraggablePoint = (map, geojson) => {
        var canvas = map.getCanvasContainer();
        var coordinates = document.getElementById('coordinates');
        let { dragPointHandler, locale } = this.props;

        function showTip(coords) {
            // Print the coordinates of where the point had
            // finished being dragged to on the map.
            coordinates.style.display = 'block';
            coordinates.innerHTML = `${locale.lng}: ${coords.lng}<br />${locale.lat}: ${coords.lat}`;
            canvas.style.cursor = '';
        }

        function onMove(e) {
            var coords = e.lngLat;

            // Set a UI indicator for dragging.
            canvas.style.cursor = 'grabbing';

            // Update the Point feature in `geojson` coordinates
            // and call setData to the source layer `point` on it.
            geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
            map.getSource('point').setData(geojson);
        }

        function onUp(e) {
            var coords = e.lngLat;
            coords.lat = coords.lat.toFixed(6);
            coords.lng = coords.lng.toFixed(6);
            dragPointHandler(coords);
            showTip(coords);

            // Unbind mouse/touch events
            map.off('mousemove', onMove);
            map.off('touchmove', onMove);
        }

        map.on('load', function() {
            // Add a single point to the map
            map.addSource('point', {
                type: 'geojson',
                data: geojson,
            });

            map.addLayer({
                id: 'point',
                type: 'circle',
                source: 'point',
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#00ff00',
                },
            });

            if (geojson) {
                let coords = geojson.features[0].geometry.coordinates;
                showTip({
                    lng: coords[0],
                    lat: coords[1],
                });
            }

            // When the cursor enters a feature in the point layer, prepare for dragging.
            map.on('mouseenter', 'point', function() {
                map.setPaintProperty('point', 'circle-color', '#3bb2d0');
                canvas.style.cursor = 'move';
            });

            map.on('mouseleave', 'point', function() {
                map.setPaintProperty('point', 'circle-color', '#00ff00');
                canvas.style.cursor = '';
            });

            map.on('mousedown', 'point', function(e) {
                // Prevent the default map drag behavior.
                e.preventDefault();

                canvas.style.cursor = 'grab';

                map.on('mousemove', onMove);
                map.once('mouseup', onUp);
            });

            map.on('touchstart', 'point', function(e) {
                if (e.points && e.points.length !== 1) return;

                // Prevent the default map drag behavior.
                e.preventDefault();

                map.on('touchmove', onMove);
                map.once('touchend', onUp);
            });
        });
    };

    loadAddPoints = (map, geojson, type) => {
        let { initZoom, init } = this.state;
        let { levelFlag } = this.props;
        let pLayerParams = {};
        if (type == 'stationPoints') {
            pLayerParams = {
                soucerId: 'stationPoints',
                minzoom: levelFlag,
                maxzoom: 15,
            };
        } else {
            pLayerParams = {
                soucerId: 'directStationPoints',
                minzoom: 0,
                maxzoom: levelFlag,
            };
        }
        addPoints(map, geojson, initZoom, this.props, init, pLayerParams);
    };

    handlerMarker = (map, check, type) => {
        let { onCompanyClick, onCompanyHover } = this.props;
        let { companyGeojson } = this.state;
        if (check) {
            this.markerArr = addMarkers(
                map,
                type,
                this.markerArr,
                onCompanyClick,
                companyGeojson,
                onCompanyHover
            );
        } else {
            this.markerArr = removeMarker(type, this.markerArr);
        }
    };

    componentWillUnmount() {
        eventProxy.off('handlerMarker');
        eventProxy.off('handlerMarkerOnZoom');
        eventProxy.off('updateInit');
        eventProxy.off('zoomToStationLayer');
    }

    render() {
        let { geojson, directStationGeojson } = this.props;
        return (
            <Fragment>
                <div id='mapDiv' style={{ height: '100%' }} />
                <pre id='coordinates' className='coordinates' />
                {this.renderMap(geojson, directStationGeojson)}
            </Fragment>
        );
    }
}
export default MapInfo;
