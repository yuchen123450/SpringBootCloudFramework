import { CONFIG } from '../../../configs';

// const mapLang = 'name_zh';

export const mapStyle = {
    version: 8,
    // 'sprite': `${CONFIG.server.url}/plugins/map/sprites/sprite`,
    glyphs: `${CONFIG.server.url}/plugins/map/fonts/{fontstack}/{range}.pbf`,
    sources: {
        hunan: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                `${CONFIG.server.url}${CONFIG.server.resource}MapTile/tiles/{z}/{x}/{y}.pbf`,
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
            interactive: true,
        },
        {
            'id': 'province_area',
            'type': 'fill',
            'source': 'hunan',
            'source-layer': 'province_area',
            'minzoom': 5,
            'maxzoom': 6,
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-color': '#132f65',
                'fill-antialias': true,
                'fill-opacity': 1,
            },
            'interactive': true,
        },
        {
            'id': 'city_area',
            'type': 'fill',
            'source': 'hunan',
            'source-layer': 'city_area',
            'minzoom': 6,
            'maxzoom': 8,
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-color': '#0d2350',
                'fill-antialias': true,
                'fill-opacity': 1,
            },
            'interactive': true,
        },
        {
            'id': 'county_area',
            'type': 'fill',
            'source': 'hunan',
            'source-layer': 'county_area',
            'minzoom': 8,
            'layout': {
                visibility: 'visible',
            },
            'paint': {
                'fill-color': '#0d2350',
                'fill-antialias': true,
                'fill-opacity': 1,
            },
            'interactive': true,
        },
        {
            'id': 'county_line',
            'type': 'line',
            'source': 'hunan',
            'source-layer': 'county_line',
            'minzoom': 8,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-color': '#ccc',
                'line-width': {
                    base: 1,
                    stops: [[9, 1.5], [12, 1]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'city_line',
            'type': 'line',
            'source': 'hunan',
            'source-layer': 'city_line',
            'minzoom': 6,
            'maxzoom': 8,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-color': '#3490ff',
                'line-width': {
                    base: 1,
                    stops: [[8, 1.5], [9, 1]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'province_line',
            'type': 'line',
            'source': 'hunan',
            'source-layer': 'province_line',
            'minzoom': 0,
            'maxzoom': 8,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-color': '#3490ff',
                'line-width': {
                    base: 1,
                    stops: [[6, 1.5], [9, 1]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'province_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'province_point',
            'minzoom': 5,
            'layout': {
                'icon-image': 'dot-11',
                'text-font': ['Microsoft YaHei'],
                'text-offset': {
                    base: 1,
                    stops: [[7.99, [0, 0.15]], [8, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[7, 'top'], [8, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 7,
                'text-size': {
                    base: 0.9,
                    stops: [[4, 12], [6, 14]],
                },
            },
            'paint': {
                'text-color': 'hsl(0, 0%, 0%)',
                'text-halo-color': 'hsl(0, 0%, 100%)',
                'text-halo-width': 1,
                'icon-opacity': {
                    base: 1,
                    stops: [[7.99, 1], [8, 0]],
                },
                'text-halo-blur': 1,
            },
            'interactive': true,
        },
        {
            'id': 'city_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'city_point',
            'minzoom': 6,
            'layout': {
                'icon-image': 'dot-9',
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [7, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [7, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 6,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[8.99, 1], [9, 0]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'county_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'county_point',
            'minzoom': 8,
            'maxzoom': 9,
            'layout': {
                'icon-image': 'dot-9',
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [7, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [7, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 6,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[8.99, 1], [9, 0]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'town_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'town_point',
            'minzoom': 9,
            'layout': {
                'icon-image': 'dot-9',
                'text-offset': {
                    base: 1,
                    stops: [[9, [0, 0.5]], [10, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[9, 'top'], [10, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 6,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[8.99, 1], [11, 0]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'railway_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'railway_line',
            'minzoom': 7,
            'layout': {
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [7, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [7, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 6,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
                'symbol-placement': 'line',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[7, 1], [11, 0]],
                },
            },
            'interactive': true,
        },
        {
            'id': 'road_point',
            'type': 'symbol',
            'source': 'hunan',
            'source-layer': 'road_line',
            'minzoom': 7,
            'layout': {
                'text-offset': {
                    base: 1,
                    stops: [[5, [0, 0.5]], [7, [0, 0]]],
                },
                'text-anchor': {
                    base: 1,
                    stops: [[5, 'top'], [7, 'center']],
                },
                'text-field': '{NAME}',
                'text-max-width': 6,
                'text-size': 12,
                'text-font': ['Microsoft YaHei'],
                'text-allow-overlap': false,
                'text-justify': 'center',
                'symbol-placement': 'line',
            },
            'paint': {
                'text-color': '#3490ff',
                'icon-opacity': {
                    base: 1,
                    stops: [[7, 1], [11, 0]],
                },
            },
            'interactive': true,
        },
    ],
    _ssl: true,
};
