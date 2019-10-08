import { isEmpty, cutString } from '../../utils/common';

export const removeMarker = (type, markerArr) => {
    if (isEmpty(type)) {
        for (let i in markerArr)
            if (!isEmpty(markerArr[i])) {
                markerArr[i].map((item) => {
                    item.marker && item.marker.remove();
                    item.popup && item.popup.remove();
                });
                markerArr[i] = [];
            }
    } else {
        markerArr[type].map((item) => {
            item.marker && item.marker.remove();
            item.popup && item.popup.remove();
        });
        markerArr[type] = [];
    }
    return markerArr;
};

export const addMarkers = (
    map,
    type,
    markerArr,
    onCompanyClick,
    companyGeojson,
    onCompanyHover
) => {
    if (!isEmpty(companyGeojson)) {
        companyGeojson.features.forEach(function(marker) {
            // create a DOM element for the marker
            var el = document.createElement('div');
            let markerClassName = '';
            switch (marker.properties.status) {
                case 'alarm':
                    markerClassName = 'alarmMarker';
                    break;
                case 'warning':
                    markerClassName = 'warningMarker';
                    break;
                case 'normal':
                    markerClassName = 'normalMarker';
                    break;
            }
            el.className = markerClassName;
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                onCompanyClick(
                    marker.properties.id,
                    marker.properties.name,
                    marker.geometry.coordinates
                );
            });
            el.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                if (onCompanyHover) {
                    onCompanyHover(
                        marker.properties.id,
                        marker.properties.name,
                        marker.geometry.coordinates
                    );
                }
            });
            // add marker to map
            let cName = cutString(marker.properties.name, 28);
            let htmlCon =
                marker.properties.message == ''
                    ? cName
                    : `${cName}<br/>${marker.properties.message}`;
            if (isEmpty(type)) {
                markerArr[marker.properties.status].push({
                    marker: new mapboxgl.Marker(el)
                        .setLngLat(marker.geometry.coordinates)
                        .addTo(map),
                    popup: new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                        .setLngLat(marker.geometry.coordinates)
                        .setHTML(htmlCon)
                        .addTo(map),
                });
            } else {
                if (marker.properties.status == type) {
                    markerArr[type].push({
                        marker: new mapboxgl.Marker(el)
                            .setLngLat(marker.geometry.coordinates)
                            .addTo(map),
                        popup: new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                            .setLngLat(marker.geometry.coordinates)
                            .setHTML(htmlCon)
                            .addTo(map),
                    });
                }
            }
        });
    }
    return markerArr;
};
