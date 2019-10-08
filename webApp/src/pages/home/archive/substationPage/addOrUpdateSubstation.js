import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Radio, DatePicker, Select, Button } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../locale';
import { CONFIG } from '../../../../configs';
import { toast } from '../../../../components/toast';
import InfoModal from '../../../../containers/infoModal';
import MapModal from './selectMapPoint';
import { archiveAction } from '../../../../actions';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import BaseIcon from '../../../../components/baseIcon';
import StandardForm from '../../../../components/standardForm';
import { isEmpty, dislodgeLetter, dislodgeFontZero } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import moment from 'moment';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Radio.Button;

@connect(
    (state) => ({
        commonState: state.commonReducer,
        substationState: state.substationReducer,
    }),
    (dispatch) => ({
        queryCommonType: (typeKindCode, typeKindName, typeCode, typeName) =>
            dispatch(archiveAction.queryCommonType(typeKindCode, typeKindName, typeCode, typeName)),
        addEditSubstationInfo: (substationInfo) =>
            dispatch(archiveAction.addEditSubstationInfo(substationInfo)),
    })
)
@Form.create()
class AddOrUpdateSubstation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            actionMenuType: this.props.actionMenuType,
            companySelectId: '',
            companySelectName: '',
            parentRefList: [],
            country: '',
            province: '',
            city: '',
            countryName: '',
            provinceName: '',
            cityName: '',
            voltageName: '',
            voltageType: '',
            editVoltageChanged: false,
            operationCompanyId: '',
            operationCompanyName: '',
            mapVisible: false,
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        companySelectName: '', //选择的公司名
        country: '',
        province: '',
        city: '',
        countryName: '',
        provinceName: '',
        cityName: '',
        voltageName: '',
        voltageType: '',
        editVoltageChanged: false,
        operationCompanyId: '',
        operationCompanyName: '',
    };

    componentDidMount() {
        let { queryCommonType } = this.props;
        queryCommonType(2);
    }

    handleOk = () => {
        let success = false;
        this.props.form.validateFields((err, values) => {
            success = !err;
            if (success) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                let {
                    actionMenuType,
                    substaionInfo,
                    intl: { formatMessage },
                } = this.props;
                let {
                    companySelectId,
                    companySelectName,
                    country,
                    province,
                    city,
                    countryName,
                    provinceName,
                    cityName,
                    editVoltageChanged,
                    operationCompanyId,
                    operationCompanyName,
                    parentRefList,
                } = this.state;
                const {
                    voltageLevel,
                    remark,
                    substationName,
                    officialSerial,
                    assetsProperties,
                    assetsCompany,
                    contactNumber,
                    altitude,
                    stationLocation,
                    dutyWay,
                    layoutMethod,
                    nature,
                    area,
                    floorArea,
                    isHubStation,
                    putIntoOperationDate,
                    exitOperationDate,
                    pollutionLevel,
                    capacity,
                } = values;
                let substationInfo = {
                    actionType: actionMenuType == 1 ? 'add' : 'edit',
                    id: actionMenuType == 1 ? '' : substaionInfo.id,
                    officialSerial,
                    substationName,
                    countryId: country,
                    countryName: countryName,
                    provinceId: province,
                    provinceName: provinceName,
                    cityCountyId: city,
                    cityCountyName: cityName,
                    companyId: companySelectId,
                    companyName: companySelectName,
                    voltageLevel:
                        actionMenuType == 2 && !editVoltageChanged
                            ? voltageLevel[0]
                            : this.state.voltageType,
                    voltageLevelName:
                        actionMenuType == 2 && !editVoltageChanged
                            ? substaionInfo.voltageLevelName
                            : this.state.voltageName,
                    operationCompanyId,
                    operationCompanyName,
                    assetsProperties,
                    assetsCompany,
                    capacity: isEmpty(capacity)
                        ? ''
                        : dislodgeFontZero(capacity) + formatMessage(locale.CubicMetre),
                    putIntoOperationDate,
                    dutyWay,
                    layoutMethod,
                    altitude: isEmpty(altitude)
                        ? ''
                        : dislodgeFontZero(altitude) + formatMessage(locale.Meter), //dislodgeLetter(altitude)
                    pollutionLevel,
                    substationProperties: nature,
                    area: isEmpty(area)
                        ? ''
                        : dislodgeFontZero(area) + formatMessage(locale.SquareMeter),
                    floorArea: isEmpty(floorArea)
                        ? ''
                        : dislodgeFontZero(floorArea) + formatMessage(locale.CubicMetre),
                    isHubStation,
                    contactNumber,
                    exitOperationDate,
                    remark: remark,
                    x: stationLocation.split(',')[0],
                    y: stationLocation.split(',')[1],
                    pmapUrl: substaionInfo ? substaionInfo.pmapUrl : '',
                    substationId: substaionInfo.substationId,
                    oldParentId: actionMenuType == 1 ? operationCompanyId : substaionInfo.companyId,
                    parentRefList: parentRefList,
                };
                let { addEditSubstationInfo } = this.props;
                if (addEditSubstationInfo) {
                    this.asyncAddEditSubstation(
                        addEditSubstationInfo,
                        substationInfo,
                        actionMenuType
                    );
                }
            }
        });
        return success;
    };

    asyncAddEditSubstation = async (addEditSubstationInfo, substationInfo, actionMenuType) => {
        let result = await addEditSubstationInfo(substationInfo);
        let {
            handlerRefresh,
            intl: { formatMessage },
            onCancel,
        } = this.props;
        if (result.success) {
            toast(
                'success',
                actionMenuType == 1
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.EditSuccess)
            );
            if (handlerRefresh) {
                handlerRefresh();
            }
            if (actionMenuType != 1) {
                onCancel();
            }
        }
        this.setState({
            confirmLoading: false,
        });
    };

    handleCancel = () => {
        let { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    };

    getLocationValue = (node, location) => {
        if (node.type != 'country') {
            switch (node.type) {
                case 'cityOrCounty':
                    location.cityID = node.key;
                    location.cityNameShow = node.title;
                    break;
                case 'province':
                    location.provinceID = node.key;
                    location.provinceNameShow = node.title;
                    break;
                default:
                    break;
            }
            this.getLocationValue(node.parentRef, location);
        } else {
            location.countryID = node.key;
            location.countryNameShow = node.title;
        }
        return location;
    };

    onSubstationLocationInfoSelect = (value, node, extra) => {
        if (node.parentRef) {
            let result = this.getLocationValue(node, location);
            switch (node.type) {
                case 'country':
                    result.countryID = '';
                    result.countryNameShow = '';
                    result.provinceID = '';
                    result.provinceNameShow = '';
                    break;
                case 'province':
                    result.cityID = '';
                    result.cityNameShow = '';
                    break;
                default:
                    break;
            }
            this.setState({
                country: result.countryID,
                province: result.provinceID,
                city: result.cityID,
                countryName: result.countryNameShow,
                provinceName: result.provinceNameShow,
                cityName: result.cityNameShow,
            });
        } else {
            this.setState({
                country: node.key,
                province: '',
                city: '',
                countryName: node.title,
                provinceName: '',
                cityName: '',
            });
        }
        this.props.form.setFieldsValue({ hiddenLocation: value });
    };

    onLocationDefValueSet = (locationType, locationShow) => {
        let { substaionInfo } = this.props;
        if (substaionInfo) {
            switch (locationType) {
                case 'country':
                    this.setState({
                        countryName: substaionInfo.countryName,
                        country: substaionInfo.countryId,
                        province: '',
                        provinceName: '',
                        city: '',
                        cityName: '',
                    });
                    break;
                case 'province':
                    this.setState({
                        countryName: substaionInfo.countryName,
                        country: substaionInfo.countryId,
                        provinceName: substaionInfo.provinceName,
                        province: substaionInfo.provinceId,
                        city: '',
                        cityName: '',
                    });
                    break;
                case 'city':
                    this.setState({
                        countryName: substaionInfo.countryName,
                        country: substaionInfo.countryId,
                        provinceName: substaionInfo.provinceName,
                        province: substaionInfo.provinceId,
                        cityName: substaionInfo.cityCountyName,
                        city: substaionInfo.cityCountyId,
                    });
                    break;
                default:
                    break;
            }
            this.props.form.setFieldsValue({ hiddenLocation: locationShow });
        }
    };

    _onSubstationTreeSelect = (key, node) => {
        let parentRefList = [];
        let checkParentRef = (item) => {
            if (item.parentRef) {
                parentRefList.push(item.parentRef.key);
                checkParentRef(item.parentRef);
            }
        };
        checkParentRef(node);
        this.setState({
            companySelectId: key,
            companySelectName: node.title,
            parentRefList,
        });
        this.props.form.setFieldsValue({ hiddenCompany: key });
    };

    onCompanyDefValueSet = (companyName, companyId, operationCompanyId, operationCompanyName) => {
        this.setState({
            companySelectId: companyId,
            companySelectName: companyName,
            operationCompanyId,
            operationCompanyName,
        });
        this.props.form.setFieldsValue({ hiddenCompany: companyName });
    };

    onVoltageChange = (value, node) => {
        this.setState({
            voltageType: value,
            voltageName: node.props.children,
            editVoltageChanged: true,
        });
    };

    _onOperateTreeSelect = (value, node) => {
        if (node.type === 'company') {
            this.setState({
                operationCompanyId: node.key,
                operationCompanyName: node.title,
            });
        }
    };

    renderLayout() {
        let {
            intl: { formatMessage, formats },
            actionMenuType,
            form: { getFieldDecorator },
            substationState: { commonTypeVoltageLevel },
            substaionInfo,
        } = this.props;
        let children = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Option key={element.value}>{element.name}</Option>);
            });
        }
        const {
            remark,
            substationName,
            officialSerial,
            assetsProperties,
            assetsCompany,
            contactNumber,
            altitude,
            x,
            y,
            dutyWay,
            layoutMethod,
            substationProperties,
            area,
            floorArea,
            isHubStation,
            putIntoOperationDate,
            exitOperationDate,
            pollutionLevel,
            capacity,
            companyId,
            companyName,
            id,
            countryName,
            provinceName,
            cityCountyName,
            voltageLevel,
            operationCompanyId,
            operationCompanyName,
        } = substaionInfo && actionMenuType === 2 ? substaionInfo : {};
        let locationShow = '',
            locationType = '';
        if (actionMenuType == 2) {
            if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length !== 0) &&
                (cityCountyName != null && cityCountyName.length !== 0)
            ) {
                locationShow = cityCountyName;
                locationType = 'city';
            } else if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length !== 0) &&
                (cityCountyName != null && cityCountyName.length === 0)
            ) {
                locationShow = provinceName;
                locationType = 'province';
            } else if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length === 0) &&
                (cityCountyName != null && cityCountyName.length === 0)
            ) {
                locationShow = countryName;
                locationType = 'country';
            }
        }
        let stationLocation = '';
        if (isEmpty(x) === false && isEmpty(y) === false) {
            stationLocation = `${x},${y}`;
        }

        const prefixFloorAreaSelector = getFieldDecorator('prefixFloorAreaSelector', {
            initialValue: formatMessage(locale.SquareMeter),
        })(
            <Select onChange={this.prefixDRFChange}>
                <Select.Option
                    value={formatMessage(locale.SquareMeter)}
                    key={formatMessage(locale.SquareMeter)}>
                    {formatMessage(locale.SquareMeter)}
                </Select.Option>
            </Select>
        );
        const prefixCapacitySelector = getFieldDecorator('prefixCapacitySelector', {
            initialValue: formatMessage(locale.CubicMetre),
        })(
            <Select onChange={this.prefixDRFChange}>
                <Select.Option
                    value={formatMessage(locale.CubicMetre)}
                    key={formatMessage(locale.CubicMetre)}>
                    {formatMessage(locale.CubicMetre)}
                </Select.Option>
            </Select>
        );
        const prefixAltitudeSelector = getFieldDecorator('prefixAltitudeSelector', {
            initialValue: formatMessage(locale.Meter),
        })(
            <Select onChange={this.prefixDRFChange}>
                <Select.Option
                    value={formatMessage(locale.Meter)}
                    key={formatMessage(locale.Meter)}>
                    {formatMessage(locale.Meter)}
                </Select.Option>
            </Select>
        );
        let formItem = [
            <FormItem key='substationName' label={formatMessage(locale.SubstationName)}>
                {formItemTips(
                    getFieldDecorator,
                    'substationName',
                    0,
                    100,
                    formatMessage,
                    locale,
                    {
                        required: true,
                        emptyHint: 'SubstationNameReq',
                    },
                    substationName
                )(<Input placeholder={formatMessage(locale.SubstationNameReq)} />)}
            </FormItem>,
            <FormItem key='voltageLevel' label={formatMessage(locale.VoltageClass)}>
                {getFieldDecorator('voltageLevel', {
                    initialValue: isEmpty(voltageLevel) ? undefined : [`${voltageLevel}`],
                    rules: [{ required: true, message: formatMessage(locale.VoltageClassTip) }],
                })(
                    <Select
                        onChange={this.onVoltageChange}
                        placeholder={formatMessage(locale.VoltageClassTip)}>
                        {children}
                    </Select>
                )}
            </FormItem>,
            <FormItem key='hiddenCompany' label={formatMessage(locale.ElectricPowerCompany)}>
                {' '}
                {getFieldDecorator('hiddenCompany', {
                    rules: [
                        {
                            required: true,
                            message: formatMessage(locale.ElectricPowerCompanyTips),
                        },
                    ],
                })(<Input type='hidden' />)}
                {getFieldDecorator('substaionCompany', {
                    initialValue: null,
                    rules: [
                        {
                            required: false,
                            message: formatMessage(locale.ElectricPowerCompanyTips),
                        },
                    ],
                })(
                    <ArchiveTree
                        moduleId={'substaionCompany'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this._onSubstationTreeSelect}
                        defValue={{
                            key: id,
                            value: companyName,
                        }}
                        onDefValueSet={this.onCompanyDefValueSet.bind(
                            this,
                            companyName,
                            companyId,
                            operationCompanyId,
                            operationCompanyName
                        )}
                    />
                )}
            </FormItem>,
            <FormItem key='hiddenLocation' label={formatMessage(locale.RegionTree)}>
                {getFieldDecorator('hiddenLocation', {
                    rules: [
                        {
                            required: true,
                            message: formatMessage(locale.RegionTips),
                        },
                    ],
                })(<Input type='hidden' />)}
                {getFieldDecorator('substationRegion', {
                    rules: [{ required: false, message: formatMessage(locale.RegionTips) }],
                    initialValue: null,
                })(
                    <ArchiveTree
                        moduleId={'substationRegion'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COUNTRY}
                        leafNodeType={ARCHIVE_NODE_TYPE.CITY}
                        onTreeSelect={this.onSubstationLocationInfoSelect}
                        //  onTreeSelectExpand={this.onSubstationTreeSelectExpand.bind(this)}
                        defValue={{
                            key: id,
                            value: locationShow,
                        }}
                        onDefValueSet={this.onLocationDefValueSet.bind(
                            this,
                            locationType,
                            locationShow
                        )}
                    />
                )}
            </FormItem>,
            <FormItem key='stationLocation' label={formatMessage(locale.SubstationLocation)}>
                <Input.Group className='select-map-point'>
                    {getFieldDecorator('stationLocation', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.SubstationLocationTip),
                            },
                        ],
                        initialValue: stationLocation,
                    })(
                        <Input
                            placeholder={formatMessage(locale.SelectTip)}
                            disabled={true}
                            addonAfter={
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        this.setState({
                                            mapVisible: true,
                                        });
                                    }}>
                                    <BaseIcon icon='map-point.svg' />
                                </Button>
                            }
                        />
                    )}
                </Input.Group>
            </FormItem>,
            <FormItem
                key='operatorName'
                label={formatMessage(locale.SubstationManagerOperatorName)}>
                {getFieldDecorator('operatorName', {
                    initialValue: null,
                    rules: [
                        {
                            required: false,
                            message: formatMessage(locale.ElectricPowerCompanyTips),
                        },
                    ],
                })(
                    <ArchiveTree
                        moduleId={'operatorName'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this._onOperateTreeSelect}
                        defValue={{
                            key: operationCompanyId,
                            value: operationCompanyName,
                        }}
                    />
                )}
            </FormItem>,
            <FormItem key='putIntoOperationDate' label={formatMessage(locale.UseDate)}>
                {getFieldDecorator('putIntoOperationDate', {
                    initialValue: isEmpty(putIntoOperationDate)
                        ? undefined
                        : moment(putIntoOperationDate),
                    rules: [
                        {
                            required: false,
                            message: formatMessage(locale.SubstationNameReq),
                        },
                    ],
                })(
                    <DatePicker
                        className='datePicker'
                        format={formats.date}
                        onChange={this.onChangeUseDate}
                    />
                )}
            </FormItem>,
            <FormItem
                key='exitOperationDate'
                label={formatMessage(locale.SubstationManagerReturnDate)}>
                {getFieldDecorator('exitOperationDate', {
                    initialValue: isEmpty(exitOperationDate)
                        ? undefined
                        : moment(exitOperationDate),
                    rules: [
                        {
                            required: false,
                            message: formatMessage(locale.SubstationNameReq),
                        },
                    ],
                })(
                    <DatePicker
                        className='datePicker'
                        format={formats.date}
                        onChange={this.onChangeReturnDate}
                    />
                )}
            </FormItem>,
        ];

        if (CONFIG.name !== 'PMDT') {
            formItem.concat([
                <FormItem key='officialSerial' label={formatMessage(locale.OfficialSerial)}>
                    {formItemTips(
                        getFieldDecorator,
                        'officialSerial',
                        0,
                        100,
                        formatMessage,
                        locale,
                        {
                            required: false,
                            emptyHint: 'OfficialSerial',
                            specialSymbolPattern: 'illegalWithOutComma',
                        },
                        officialSerial
                    )(<Input placeholder={formatMessage(locale.SubstationInputSerial)} />)}
                </FormItem>,
                <FormItem
                    key='assetsProperties'
                    label={formatMessage(locale.SubstationManagerNatureOfAssets)}>
                    {formItemTips(
                        getFieldDecorator,
                        'assetsProperties',
                        0,
                        50,
                        formatMessage,
                        locale,
                        false,
                        assetsProperties
                    )(<Input placeholder={formatMessage(locale.SubstationAssetsProperties)} />)}
                </FormItem>,
                <FormItem
                    key='assetsCompany'
                    label={formatMessage(locale.SubstationManagerAssetUnit)}>
                    {formItemTips(
                        getFieldDecorator,
                        'assetsCompany',
                        0,
                        100,
                        formatMessage,
                        locale,
                        false,
                        assetsCompany
                    )(<Input placeholder={formatMessage(locale.SubstationAssetsCompany)} />)}
                </FormItem>,
                <FormItem key='contactNumber' label={formatMessage(locale.ContactPhone)}>
                    {formItemTips(
                        getFieldDecorator,
                        'contactNumber',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        contactNumber,
                        'phoneNumber',
                        formatMessage(locale.PhoneCheckTips)
                    )(<Input placeholder={formatMessage(locale.ContactPhoneReq)} />)}
                </FormItem>,
                <FormItem key='altitude' label={formatMessage(locale.Altitude)}>
                    {formItemTips(
                        getFieldDecorator,
                        'altitude',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        !isEmpty(altitude) ? dislodgeLetter(altitude) : '',
                        'numberPotAndNegative',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(
                        <Input
                            addonAfter={prefixAltitudeSelector}
                            placeholder={formatMessage(locale.AltitudeReq)}
                        />
                    )}
                </FormItem>,
                <FormItem key='dutyWay' label={formatMessage(locale.SubstationManagerWayOfDuty)}>
                    {formItemTips(
                        getFieldDecorator,
                        'dutyWay',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        dutyWay
                    )(<Input placeholder={formatMessage(locale.SubstationDutyWay)} />)}
                </FormItem>,
                <FormItem
                    key='layoutMethod'
                    label={formatMessage(locale.SubstationManagerLayoutMethod)}>
                    {formItemTips(
                        getFieldDecorator,
                        'layoutMethod',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        layoutMethod
                    )(<Input placeholder={formatMessage(locale.SubstationLayoutMethod)} />)}
                </FormItem>,
                <FormItem key='nature' label={formatMessage(locale.SubstationManagerNature)}>
                    {formItemTips(
                        getFieldDecorator,
                        'nature',
                        0,
                        64,
                        formatMessage,
                        locale,
                        false,
                        substationProperties
                    )(<Input placeholder={formatMessage(locale.SubstationNature)} />)}
                </FormItem>,
                <FormItem key='area' label={formatMessage(locale.FloorArea)}>
                    {formItemTips(
                        getFieldDecorator,
                        'area',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        !isEmpty(area) ? dislodgeLetter(area) : '',
                        'numberAndPot',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(
                        <Input
                            addonAfter={prefixFloorAreaSelector}
                            placeholder={formatMessage(locale.FloorAreaReq)}
                        />
                    )}
                </FormItem>,
                <FormItem
                    key='floorArea'
                    label={formatMessage(locale.SubstationManagerConstructionArea)}>
                    {formItemTips(
                        getFieldDecorator,
                        'floorArea',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        !isEmpty(floorArea) ? dislodgeLetter(floorArea) : '',
                        'numberAndPot',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(
                        <Input
                            addonAfter={prefixFloorAreaSelector}
                            placeholder={formatMessage(locale.SubstationFloorArea)}
                        />
                    )}
                </FormItem>,
                <FormItem
                    key='isHubStation'
                    label={formatMessage(locale.SubstationManagerIsHubStation)}>
                    {getFieldDecorator('isHubStation', {
                        initialValue: isEmpty(isHubStation) ? undefined : isHubStation,
                        rules: [
                            {
                                required: false,
                                message: formatMessage(locale.SubstationNameReq),
                            },
                        ],
                    })(
                        <Select placeholder={formatMessage(locale.SubstationIsHubStation)}>
                            <Option key='0'>{formatMessage(locale.True)}</Option>
                            <Option key='1'>{formatMessage(locale.False)}</Option>
                        </Select>
                    )}
                </FormItem>,
                <FormItem
                    key='pollutionLevel'
                    label={formatMessage(locale.SubstationManagerPollutionLevel)}>
                    {formItemTips(
                        getFieldDecorator,
                        'pollutionLevel',
                        0,
                        100,
                        formatMessage,
                        locale,
                        false,
                        pollutionLevel
                    )(<Input placeholder={formatMessage(locale.SubstationPollutionLevel)} />)}
                </FormItem>,
                <FormItem key='capacity' label={formatMessage(locale.SubstationManagerCapacity)}>
                    {formItemTips(
                        getFieldDecorator,
                        'capacity',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        !isEmpty(capacity) ? dislodgeLetter(capacity) : '',
                        'numberAndPot',
                        formatMessage(locale.NumberAndPotTips),
                        true
                    )(
                        <Input
                            addonAfter={prefixCapacitySelector}
                            placeholder={formatMessage(locale.SubstationCapacity)}
                        />
                    )}
                </FormItem>,
            ]);
        }
        formItem.push(
            <FormItem key='remark' label={formatMessage(locale.Remark)}>
                {formItemTips(
                    getFieldDecorator,
                    'remark',
                    0,
                    200,
                    formatMessage,
                    locale,
                    false,
                    remark
                )(<TextArea placeholder={formatMessage(locale.RemarkTips)} />)}
            </FormItem>
        );
        return (
            <StandardForm vertical primary={[0, 1, 2, 3, 4]}>
                {formItem}
            </StandardForm>
        );
    }

    render() {
        let { confirmLoading, mapVisible } = this.state;
        let {
            actionMenuType,
            substaionInfo,
            intl: { formatMessage },
            visible,
        } = this.props;
        let title;
        let ModalContent = this.renderLayout();
        let okHandle = {};
        if (actionMenuType == 2) {
            title = formatMessage(locale.SubstationManagerEdit);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.SubstationManagerNew);
            okHandle = {
                onOkGo: this.handleOk,
            };
        }

        let pointValue = CONFIG.mapbox.center;
        if (isEmpty(substaionInfo) === false && substaionInfo.x) {
            pointValue = [substaionInfo.x, substaionInfo.y];
        }
        return (
            <Fragment>
                <InfoModal
                    title={title}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    {...okHandle}
                    onCancel={this.handleCancel}>
                    {ModalContent}
                </InfoModal>
                <MapModal
                    title={formatMessage(locale.SubstationLocation)}
                    visible={mapVisible}
                    center={pointValue}
                    point={pointValue}
                    onOk={(coords) => {
                        let {
                            form: { setFieldsValue },
                        } = this.props;
                        this.setState(
                            {
                                mapVisible: false,
                            },
                            () => {
                                setFieldsValue({ stationLocation: `${coords.lng},${coords.lat}` });
                            }
                        );
                    }}
                    onCancel={() => {
                        this.setState({
                            mapVisible: false,
                        });
                    }}
                />
            </Fragment>
        );
    }
}
export default injectIntl(AddOrUpdateSubstation);
