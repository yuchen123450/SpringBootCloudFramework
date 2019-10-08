import { CONFIG } from '../../../configs';

// const mapLang = 'name_zh';
let bgColor = '#112b45';
export const mapStyle = {
    version: 8,
    // 'sprite': `${CONFIG.server.url}/plugins/map/sprites/sprite`,
    glyphs: `${CONFIG.server.url}/plugins/map/fonts/{fontstack}/{range}.pbf`,
    sources: {
        china: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                `${CONFIG.server.url}${CONFIG.server.resource}MapTile/china/{z}/{x}/{y}.pbf`,
                // 'http://192.168.14.15:18088/geoserver/gwc/service/tms/1.0.0/osm:china@EPSG:900913@pbf/{z}/{x}/{y}.pbf',
            ],
        },
    },
    transition: {
        duration: 300,
        delay: 0,
    },
    layers: [
        {
            id: 'background',
            type: 'background',
            layout: {
                visibility: 'visible',
            },
            paint: {
                'background-color': 'transparent',
            },
        },
        {
            'id': 'china-border',
            'type': 'line',
            'source': 'china',
            'source-layer': 'border',
            'minzoom': 3,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-dasharray': {
                    base: 1,
                    stops: [[5, [2, 0]], [7, [2, 2, 6, 2]]],
                },
                'line-width': {
                    base: 1,
                    stops: [[5, 0.75], [7, 1.5]],
                },
                'line-color': {
                    base: 1,
                    stops: [[5, 'hsl(230, 14%, 77%)'], [7, 'hsl(230, 8%, 62%)']],
                },
            },
            'interactive': true,
        },
        {
            'id': 'china_province',
            'type': 'fill',
            'source': 'china',
            'source-layer': 'province',
            'minzoom': 3,
            'maxzoom': 9,
            'filter': ['all', ['==', '$type', 'Polygon']],
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-outline-color': '#3490ff',
                'fill-color': bgColor,
                'fill-antialias': true,
                'fill-opacity': 1,
            },
        },
        {
            'id': 'china_lake',
            'type': 'fill',
            'source': 'china',
            'source-layer': 'lake',
            'minzoom': 3,
            'maxzoom': 9,
            'filter': ['all', ['==', '$type', 'Polygon']],
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-color': 'hsl(197, 100%, 30%)',
                'fill-antialias': true,
                'fill-opacity': 0.8,
            },
        },
        {
            'id': 'china_river',
            'type': 'line',
            'source': 'china',
            'source-layer': 'river',
            'minzoom': 4,
            'maxzoom': 9,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-width': 1,
                'line-color': {
                    base: 1,
                    stops: [[4, 'hsl(197, 100%, 10%)'], [6, 'hsl(197, 100%, 30%)']],
                },
            },
            'interactive': true,
        },
        {
            'id': 'china_province_name',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'province',
            'minzoom': 3,
            'maxzoom': 4,
            'layout': {
                'text-field': '{NAME}',
                'text-size': 10,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
            },
        },
        {
            'id': 'china_city',
            'type': 'fill',
            'source': 'china',
            'source-layer': 'city',
            'minzoom': 5,
            'maxzoom': 9,
            'filter': ['all', ['==', '$type', 'Polygon']],
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-outline-color': '#3490ff',
                'fill-color': bgColor,
                'fill-antialias': true,
                'fill-opacity': 0.5,
            },
        },
        {
            'id': 'china_county',
            'type': 'fill',
            'source': 'china',
            'source-layer': 'county',
            'minzoom': 6,
            'filter': ['all', ['==', '$type', 'Polygon']],
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-outline-color': '#3490ff',
                'fill-color': bgColor,
                'fill-antialias': true,
                'fill-opacity': 0.5,
            },
        },
        {
            'id': 'china_province_city',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'province_point',
            'minzoom': 4,
            'maxzoom': 7,
            'layout': {
                //'icon-image': 'marker-11',
                'text-offset': {
                    base: 1,
                    stops: [[4, [0, 0.5]], [7, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[4, 'top'], [7, 'center']],
                },
                'text-field': '{name}',
                'text-max-width': 7,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[7.99, 1], [8, 0]],
                },
            },
        },
        {
            'id': 'china_city_label',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'city_point',
            'minzoom': 5,
            'maxzoom': 10,
            'layout': {
                //'icon-image': 'marker-11',
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [8, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [8, 'center']],
                },
                'text-field': '{name}',
                'text-max-width': 6,
                'text-size': 10,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
            },
        },
        {
            'id': 'china_county_label',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'county_point',
            'minzoom': 6,
            'maxzoom': 9,
            'layout': {
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [9, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [9, 'center']],
                },
                'text-field': '{name}',
                'text-max-width': 6,
                'text-size': 10,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
            },
        },
        {
            'id': 'gis_osm_water_a_free_1_label',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'gis_osm_water_a_free_1',
            'minzoom': 9,
            'maxzoom': 12,
            'layout': {
                'text-field': ['coalesce', ['get', 'name'], ['get', 'NAME']],
                'text-size': 10,
                // 'symbol-placement': 'line',
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#ddd',
            },
        },
        {
            'id': 'gis_osm_railways_free_1_label',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'gis_osm_railways_free_1',
            'minzoom': 8,
            'maxzoom': 12,
            'layout': {
                'text-field': ['coalesce', ['get', 'name'], ['get', 'NAME']],
                'text-size': 10,
                'symbol-placement': 'line',
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#ddd',
            },
        },
        {
            'id': 'gis_osm_transport_free_1',
            'type': 'symbol',
            'source': 'china',
            'source-layer': 'gis_osm_transport_free_1',
            'minzoom': 9,
            'maxzoom': 12,
            'layout': {
                'text-field': ['coalesce', ['get', 'name'], ['get', 'NAME']],
                'text-size': 10,
                'symbol-placement': 'line',
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#ddd',
            },
        },
    ],
    _ssl: true,
};
