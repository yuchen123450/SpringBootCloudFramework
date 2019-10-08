import Enum from '../../../../../utils/enum';
import { locale } from '../../../../locale';
import { isEmpty, initialCase } from '../../../../../utils/common';
import { formatMessage } from '../../../../locale';

//将站点数据列表格式化为GeoJson数据
export const getStationGeoJson = (substationStatus, size) => {
    let geojson = {};
    let features = [];
    if (isEmpty(substationStatus) === false) {
        substationStatus.map((item) => {
            // if (item.x && item.y) {
            let status = -1;
            if (item.hasData !== '0') {
                status = item.state;
            }
            features.push({
                type: 'Feature',
                properties: {
                    id: item.substationId,
                    name: item.substationName,
                    type: item.substationProperties,
                    status: Enum.getExceptionStatus(status).color,
                    state: status,
                    iconSize: size,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [item.x, item.y],
                },
            });
            // }
        });
        geojson = {
            type: 'FeatureCollection',
            features: features,
        };
    }
    return geojson;
};

//站点GeoJson数据按站点状态分组
export const groupStationGeoJsonByStatus = (geojson, checkStation) => {
    let geojsonNew = [];
    if (geojson.features) {
        let geojsonNoData = [],
            geojsonWarning = [],
            geojsonNormal = [],
            geojsonAlarm = [];
        geojson.features.map((item) => {
            if (item.properties.state == 0) {
                //'#159E54'
                geojsonNormal.push(item);
            } else if (item.properties.state == 1) {
                //'#FF7A0C'
                geojsonWarning.push(item);
            } else if (item.properties.state == 2) {
                //'#FA3E51'
                geojsonAlarm.push(item);
            } else {
                geojsonNoData.push(item); //'#666'
            }
        });
        if (!isEmpty(checkStation)) {
            for (var i in checkStation) {
                if (checkStation[i]) {
                    if (i == 'noData') {
                        geojsonNew = [...geojsonNew, ...geojsonNoData];
                    }
                    if (i == 'normal') {
                        geojsonNew = [...geojsonNew, ...geojsonNormal];
                    }
                    if (i == 'warning') {
                        geojsonNew = [...geojsonNew, ...geojsonWarning];
                    }
                    if (i == 'alarm') {
                        geojsonNew = [...geojsonNew, ...geojsonAlarm];
                    }
                }
            }
        }
    }
    return {
        type: 'FeatureCollection',
        features: geojsonNew,
    };
};

//将公司数据列表格式化为GeoJson数据
export const getCompanyGeoJson = (data) => {
    let geojson = {};
    let features = [];
    if (isEmpty(data) === false) {
        data.map((item) => {
            let itemStatus = Enum.getExceptionStatus(item.state).value;
            let status = initialCase('lower', itemStatus); // itemStatus.substring(0, 1).toLowerCase() + itemStatus.substring(1);
            let message = '';
            if (item.warningCount !== 0) {
                message += formatMessage(locale.WarningCountTips, { count: item.warningCount });
            }
            if (item.alarmCount !== 0) {
                if (message !== '') {
                    message += ',';
                }
                message += formatMessage(locale.AlarmCountTips, { count: item.alarmCount });
            }
            features.push({
                type: 'Feature',
                properties: {
                    id: item.companyId,
                    name: item.companyName,
                    message: message,
                    status: status,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [item.coordinatesX, item.coordinatesY],
                },
            });
        });
        geojson = {
            type: 'FeatureCollection',
            features: features,
        };
    }
    return geojson;
};
