import mapboxgl from 'mapboxgl';
import { CONFIG } from '../../configs';
import eventProxy from '../../utils/eventProxy';

//移除测点图层
export const removePoints = (map, soucerId) => {
    if (map.getLayer(`${soucerId}clusters`)) {
        map.removeLayer(`${soucerId}clusters`);
    }
    if (map.getLayer(`${soucerId}cluster-count`)) {
        map.removeLayer(`${soucerId}cluster-count`);
    }
    if (map.getLayer(`${soucerId}unclustered-point`)) {
        map.removeLayer(`${soucerId}unclustered-point`);
    }
    if (map.getLayer(`${soucerId}unclustered-point-name`)) {
        map.removeLayer(`${soucerId}unclustered-point-name`);
    }
    if (map.getSource(soucerId)) {
        map.removeSource(soucerId);
    }
};

//添加测点图层
export const addPoints = (map, geojson, initZoom, props, init, params) => {
    let { onPointClick, levelFlag, checkedCompany } = props;
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });

    // 在加载地图之前将图层添加到地图中。确保在加载事件处理程序中附加了数据源和样式层。
    map.addSource(params.soucerId, {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: initZoom, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });
    let clustersId = `${params.soucerId}clusters`;
    map.addLayer({
        id: clustersId,
        type: 'circle',
        source: params.soucerId,
        filter: ['has', 'point_count'],
        minzoom: params.minzoom,
        maxzoom: params.maxzoom,
        paint: {
            'circle-color': '#0090ff',
            'circle-radius': 15,
        },
    });
    let clusterCountId = `${params.soucerId}cluster-count`;
    map.addLayer({
        id: clusterCountId,
        type: 'symbol',
        source: params.soucerId,
        filter: ['has', 'point_count'],
        minzoom: params.minzoom,
        maxzoom: params.maxzoom,
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': CONFIG.mapbox.online.accessToken
                ? ['DIN Offc Pro Regular', 'Arial Unicode MS Regular']
                : ['Microsoft YaHei'],
            'text-size': 12,
        },
        paint: { 'text-color': '#fff' },
    });
    let unclusteredPointId = `${params.soucerId}unclustered-point`;
    map.addLayer({
        id: unclusteredPointId,
        type: 'circle',
        source: params.soucerId,
        filter: ['!', ['has', 'point_count']],
        minzoom: params.minzoom,
        maxzoom: params.maxzoom,
        paint: {
            // "text-field": "{title}",
            'circle-color': ['get', 'status'],
            'circle-radius': ['get', 'iconSize'],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
        },
    });
    let unclusteredPointNameId = `${params.soucerId}unclustered-point-name`;
    map.addLayer({
        id: unclusteredPointNameId,
        type: 'symbol',
        source: params.soucerId,
        filter: ['!', ['has', 'point_count']],
        minzoom: params.minzoom,
        maxzoom: params.maxzoom,
        layout: {
            'text-field': '{name}',
            'text-font': CONFIG.mapbox.online.accessToken
                ? ['DIN Offc Pro Regular', 'Arial Unicode MS Regular']
                : ['Microsoft YaHei'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
        },
        paint: { 'text-color': '#fff' },
    });

    // inspect a cluster on click
    map.on('click', clustersId, (e) => {
        e.originalEvent.stopPropagation();
        var features = map.queryRenderedFeatures(e.point, { layers: [clustersId] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource(params.soucerId).getClusterExpansionZoom(clusterId, function(err, zoom) {
            if (err) return;
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
            });
        });
    });

    map.on('mouseenter', clustersId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', clustersId, () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', unclusteredPointId, (e) => {
        e.originalEvent.stopPropagation();
        if (onPointClick) {
            onPointClick(e.features[0].properties.id, e.features[0].properties);
        }
    });

    map.on('mouseenter', unclusteredPointId, (e) => {
        // Change the cursor style as a UI indicator.
        //e.originalEvent.stopPropagation()
        if (e.originalEvent.target.className == 'mapboxgl-canvas') {
            map.getCanvas().style.cursor = 'pointer';

            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.name;

            //let { changeStationName } = this.props;
            if (props.changeStationName) {
                props.changeStationName(description);
            }

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        }
    });

    map.on('mouseleave', unclusteredPointId, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
    // // add markers to map
    let czoom = map.getZoom();
    if (czoom < levelFlag) {
        for (var i in checkedCompany) {
            eventProxy.trigger('handlerMarker', map, checkedCompany[i], `${i}`);
        }
    }
    let countAdd = 0;
    let countRemove = 0;
    map.on('zoom', () => {
        let zoom = map.getZoom();
        if (zoom < levelFlag) {
            if (countAdd == 0) {
                countAdd++;
                countRemove = 0;
                eventProxy.trigger('handlerMarkerOnZoom', true, zoom, 'companylayer');
            }
        } else {
            if (countRemove == 0) {
                countRemove++;
                countAdd = 0;
                eventProxy.trigger('handlerMarkerOnZoom', false, zoom, 'stationlayer');
            }
        }
        // let { init } = this.state;
        if (zoom < initZoom + 1) {
            if (init === false) {
                eventProxy.trigger('updateInit', true);
            }
        } else {
            eventProxy.trigger('updateInit', false);
        }
    });
};
