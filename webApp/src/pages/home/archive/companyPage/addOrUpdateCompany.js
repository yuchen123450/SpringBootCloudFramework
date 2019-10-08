import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import StandardForm from '../../../../components/standardForm';
import InfoModal from '../../../../containers/infoModal';
import { toast } from '../../../../components/toast';
import { archiveAction } from '../../../../actions';
import { formItemTips, handleSpace } from '../../../../utils/dom';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(
    (state) => ({
        regionInfoState: state.regionReducer,
        companyInfoState: state.companyReducer,
    }),
    (dispatch) => ({
        //添加或者更新电力公司
        addOrUpdate: (
            actionType,
            id,
            country,
            countryName,
            province,
            provinceName,
            city,
            cityName,
            parentId,
            companyType,
            companyName,
            remark,
            oldParenId
        ) =>
            dispatch(
                archiveAction.addOrUpdate(
                    actionType,
                    id,
                    country,
                    countryName,
                    province,
                    provinceName,
                    city,
                    cityName,
                    parentId,
                    companyType,
                    companyName,
                    remark,
                    oldParenId
                )
            ),
    })
)
@Form.create()
class AddOrUpdateCompany extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'Content of the modal',
            actionMenuType: this.props.actionMenuType,
            parentId: -1,
            country: '',
            province: '',
            city: '',
            countryName: '',
            provinceName: '',
            cityName: '',
            locationChanged: false,
            superCompanyChanged: false,
        };
    }

    static defaultProps = {
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        parentId: -1, //电力公司父级ID
        country: '', //国家ID
        province: '', //省份ID
        city: '', //地区ID
        countryName: '', //国家名字
        provinceName: '', //省份名字
        cityName: '', //城市名字
        locationChanged: false,
        superCompanyChanged: false,
    };

    handleOk = () => {
        let success = false;
        this.props.form.validateFields((err, values) => {
            success = !err;
            if (success) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                let {
                    country,
                    province,
                    city,
                    parentId,
                    countryName,
                    provinceName,
                    cityName,
                    superCompanyChanged,
                } = this.state;
                let { addOrUpdate, companyInfo, actionMenuType } = this.props;
                let id = actionMenuType === 2 && companyInfo ? companyInfo.id : '-1';
                const companyName = values.companyName;
                const remark = values.remark;
                const companyType = 0; //默认测试公司
                if (!superCompanyChanged) {
                    if (companyInfo) {
                        parentId = companyInfo.parentId;
                    }
                }
                if (addOrUpdate) {
                    this.addOrUpdateData(
                        addOrUpdate,
                        country,
                        province,
                        city,
                        parentId,
                        companyName,
                        countryName,
                        provinceName,
                        cityName,
                        companyType,
                        remark,
                        id
                    );
                }
            }
        });
        return success;
    };

    addOrUpdateData = async (
        addOrUpdate,
        country,
        province,
        city,
        parentId,
        companyName,
        countryName,
        provinceName,
        cityName,
        companyType,
        remark,
        id
    ) => {
        let {
            actionMenuType,
            intl: { formatMessage },
            onCancel,
            companyInfo,
        } = this.props;
        let result = await addOrUpdate(
            actionMenuType === 1 ? 'add' : 'edit',
            id,
            country,
            countryName,
            province,
            provinceName,
            city,
            cityName,
            parentId,
            companyType,
            companyName,
            remark,
            companyInfo.parentId
        );
        if (result.success) {
            toast(
                'success',
                actionMenuType === 1
                    ? formatMessage(locale.NewCreateSuccess)
                    : formatMessage(locale.EditSuccess)
            );
            let { onUpdateData } = this.props;
            if (onUpdateData) {
                onUpdateData();
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
        console.log('Clicked cancel button');
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

    onLocationInfoSelect = (value, node, extra) => {
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
                locationChanged: true,
            });
        } else {
            this.setState({
                country: node.key,
                province: '',
                city: '',
                countryName: node.title,
                provinceName: '',
                cityName: '',
                locationChanged: true,
            });
        }

        this.props.form.setFieldsValue({ companyHiddenLocation: value });
    };

    onSuperCompanySelect = (value, node, extra) => {
        this.setState({
            parentId: value,
            superCompanyChanged: true,
        });
        this.props.form.setFieldsValue({ companyParentCompany: value });
    };

    onCompanyLocationDefValueSet = (locationType, showName) => {
        let { companyInfo } = this.props;
        if (companyInfo) {
            switch (locationType) {
                case 'country':
                    this.setState({
                        countryName: companyInfo.countryName,
                        country: companyInfo.country,
                        province: '',
                        provinceName: '',
                        city: '',
                        cityName: '',
                    });
                    break;
                case 'province':
                    this.setState({
                        countryName: companyInfo.countryName,
                        country: companyInfo.country,
                        provinceName: companyInfo.provinceName,
                        province: companyInfo.province,
                        city: '',
                        cityName: '',
                    });
                    break;
                case 'city':
                    this.setState({
                        countryName: companyInfo.countryName,
                        country: companyInfo.country,
                        provinceName: companyInfo.provinceName,
                        province: companyInfo.province,
                        cityName: companyInfo.cityName,
                        city: companyInfo.city,
                    });
                    break;
                default:
                    break;
            }
        }
        this.props.form.setFieldsValue({ companyHiddenLocation: showName });
    };
    onParentCompanyDefValueSet = (parentName) => {
        this.props.form.setFieldsValue({ companyParentCompany: parentName });
    };

    /**
     *页面
     * @param {*} selectedRows
     */
    renderLayout() {
        let {
            intl: { formatMessage },
            actionMenuType,
            form: { getFieldDecorator },
            companyInfo,
        } = this.props;
        let { countryName, provinceName, cityName, company, id, remark, parentName } =
            actionMenuType === 2 && companyInfo ? companyInfo : {};
        let locationShow = '',
            locationType = '';
        if (actionMenuType === 2) {
            if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length !== 0) &&
                (cityName != null && cityName.length !== 0)
            ) {
                locationShow = cityName;
                locationType = 'city';
            } else if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length !== 0) &&
                (cityName != null && cityName.length === 0)
            ) {
                locationShow = provinceName;
                locationType = 'province';
            } else if (
                countryName != null &&
                countryName.length !== 0 &&
                (provinceName != null && provinceName.length === 0) &&
                (cityName != null && cityName.length === 0)
            ) {
                locationShow = countryName;
                locationType = 'country';
            }
        }
        return (
            <StandardForm onSubmit={this.handleSubmit} vertical>
                <FormItem label={formatMessage(locale.CompanyName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'companyName',
                        1,
                        100,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'CompanyManagerCompanyNameRequest' },
                        company
                    )(
                        <Input
                            placeholder={formatMessage(locale.CompanyManagerCompanyNameRequest)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.RegionTree)}>
                    {getFieldDecorator('companyHiddenLocation', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.RegionTips),
                            },
                        ],
                    })(<Input type='hidden' />)}
                    {getFieldDecorator('selectLocation')(
                        <ArchiveTree
                            moduleId={'regionCompanyCreate'}
                            moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                            rootNodeParentType={ARCHIVE_NODE_TYPE.COUNTRY}
                            leafNodeType={ARCHIVE_NODE_TYPE.CITY}
                            onTreeSelect={this.onLocationInfoSelect}
                            defValue={{
                                key: id,
                                value: locationShow,
                            }}
                            placeholder={formatMessage(locale.RegionTips)}
                            onDefValueSet={this.onCompanyLocationDefValueSet.bind(
                                this,
                                locationType,
                                locationShow
                            )}
                            //   onTreeSelectExpand={this.onTreeSelectExpand.bind(this)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.CompanyManagerSuperCompanyName)}>
                    {getFieldDecorator('companyParentCompany', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.CompanyManagerParentRequest),
                            },
                        ],
                    })(<Input type='hidden' />)}
                    {getFieldDecorator('parentId')(
                        <ArchiveTree
                            moduleId={'archiveParentCompany'}
                            moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                            rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            onTreeSelect={this.onSuperCompanySelect}
                            defValue={{
                                key: id,
                                value: parentName,
                            }}
                            placeholder={formatMessage(locale.CompanyManagerParentRequest)}
                            onDefValueSet={this.onParentCompanyDefValueSet.bind(this, parentName)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.Remark)}>
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
            </StandardForm>
        );
    }

    render() {
        let { confirmLoading } = this.state;
        let {
            actionMenuType,
            intl: { formatMessage },
            visible,
        } = this.props;
        let title;
        let ModalContent = this.renderLayout();
        let okHandle = {};
        if (actionMenuType === 2) {
            title = formatMessage(locale.EditCompany);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.NewCompany);
            okHandle = {
                onOkGo: this.handleOk,
            };
        }

        return (
            <InfoModal
                title={title}
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                {...okHandle}>
                {ModalContent}
            </InfoModal>
        );
    }
}
export default injectIntl(AddOrUpdateCompany);
