import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Button, Modal, Spin } from 'antd';
import { locale, formatMessage } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { connect } from 'react-redux';
import { archiveAction, systemAction } from '../../../../actions';
import { injectIntl } from 'react-intl';
import { isEmpty, deepClone } from '../../../../utils/common';
import { formItemTips } from '../../../../utils/dom';
import StandardForm from '../../../../components/standardForm';
import CheckBoxGroup from '../../../../components/checkboxGroup';
import Select from '../../../../components/baseSelect';
import { CHECKBOX_GROUP_TYPE } from '../../../../components/checkboxGroup';
import Scrollbar from '../../../../components/baseScroll';
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
        companyInfoState: state.companyReducer,
    }),
    (dispatch) => ({
        //获取电力公司列表
        getCompanyInfo: (country, province, city, parentId, companyType, company, page, limit) =>
            dispatch(
                archiveAction.getCompanyInfo(
                    country,
                    province,
                    city,
                    parentId,
                    companyType,
                    company,
                    page,
                    limit
                )
            ),
        //获取变电站列表
        getSubstationInfo: (
            companyId,
            companyName,
            substationNames,
            voltageLevels,
            countryId,
            provinceId,
            cityCountyId,
            page,
            limit
        ) =>
            dispatch(
                archiveAction.getSubstationInfo(
                    companyId,
                    companyName,
                    substationNames,
                    voltageLevels,
                    countryId,
                    provinceId,
                    cityCountyId,
                    page,
                    limit
                )
            ),
        //修改数据权限
        updateRecordGroup: (id, name, remark, strIds, recordGroupType) =>
            dispatch(systemAction.updateRecordGroup(id, name, remark, strIds, recordGroupType)),
        //新增用户数据权限
        addRecordGroup: (name, remark, strIds, recordGroupType) =>
            dispatch(systemAction.addRecordGroup(name, remark, strIds, recordGroupType)),
    })
)
@Form.create()
class DataAuthManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            multipleData: [],
            callBackData: [],
            recordGroupType: 2,
            checkBoxType: CHECKBOX_GROUP_TYPE.NORMAL,
            dataGroupID: '',
            loading: true,
        };
        this.originSubstationData = [];
        this.originCompanyData = [];
        this.loadingTimeOutEvent = '';
    }

    static defaultProps = {};

    componentDidMount() {
        this.getSubstations(false);
        this.props.onRef(this);
        this.setLoading();
    }

    setLoading = () => {
        this.setState({
            loading: true,
        });
        this.loadingTimeOutEvent = setTimeout(() => {
            this.setState({ loading: false });
        }, 500);
    };

    componentWillUnmount() {
        clearTimeout(this.loadingTimeOutEvent);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps && nextProps.dataInfo && nextProps.dataInfo.id !== nextState.dataGroupID) {
            this.setState({
                dataGroupID: nextProps.dataInfo.id,
                recordGroupType:
                    nextProps.actionMenuType === 1
                        ? nextState.recordGroupType
                        : nextProps.dataInfo.recordGroupType,
                callBackData: nextProps.dataInfo.record,
            });
        }
        return true;
    }

    getSubstations = async (editFlag = false, disabledFlag = false) => {
        let { getSubstationInfo } = this.props;
        let title = formatMessage(locale.MenuDataPermission);
        if (this.originSubstationData.length === 0) {
            let result = await getSubstationInfo('', '', '', '', '', '', '', 1, 10000);
            let substations = [
                {
                    id: -1,
                    title,
                    value: -1,
                    checked: false,
                    indeterminate: false,
                    children: [],
                },
            ];
            if (
                result &&
                result.success &&
                result.data &&
                result.data.list &&
                result.data.list.length > 0
            ) {
                result.data.list.forEach((element) => {
                    if (isEmpty(substations[0].children)) {
                        substations[0].children.push({
                            id: element.companyId,
                            title: element.companyName,
                            value: element.companyId,
                            checked: false,
                            indeterminate: false,
                            children: [
                                {
                                    id: element.substationId,
                                    title: element.substationName,
                                    value: element.substationId,
                                    checked: false,
                                    indeterminate: false,
                                },
                            ],
                        });
                    } else {
                        let findCompanyIndex = substations[0].children.findIndex(
                            (item) => item.id === element.companyId
                        );
                        if (-1 === findCompanyIndex) {
                            substations[0].children.push({
                                id: element.companyId,
                                title: element.companyName,
                                value: element.companyId,
                                checked: false,
                                indeterminate: false,
                                children: [
                                    {
                                        id: element.substationId,
                                        title: element.substationName,
                                        value: element.substationId,
                                        checked: false,
                                        indeterminate: false,
                                    },
                                ],
                            });
                        } else {
                            substations[0].children[findCompanyIndex].children.push({
                                id: element.substationId,
                                title: element.substationName,
                                value: element.substationId,
                                checked: false,
                                indeterminate: false,
                            });
                        }
                    }
                });
            }
            this.originSubstationData = deepClone(substations);
            this.updateSubstationData(editFlag, substations, disabledFlag);
        } else {
            let result = this.handlerSubstationData(title);
            this.updateSubstationData(editFlag, result, disabledFlag);
        }
    };

    handlerSubstationData = (title) => {
        this.originSubstationData[0].title = title;
        return deepClone(this.originSubstationData);
    };

    updateSubstationData = (editFlag, substations, disabledFlag) => {
        if (!editFlag) {
            this.setState({
                multipleData: substations,
                checkBoxType: CHECKBOX_GROUP_TYPE.NORMAL,
            });
        } else {
            this.getDefaultCheckSubstations(substations, disabledFlag);
        }
    };

    getDefaultCheckSubstations = (substations, disabledFlag) => {
        if (substations && substations[0].children && substations[0].children.length > 0) {
            let { dataInfo } = this.props;
            if (
                dataInfo &&
                dataInfo.record &&
                dataInfo.record.length &&
                dataInfo.record.length > 0
            ) {
                substations[0].children.map((item) => {
                    item.disabled = disabledFlag;
                    if (item.children && Array.isArray(item.children)) {
                        let findSubstationIndex = 0;
                        item.children.map((ele) => {
                            let findSubstation = dataInfo.record.find(
                                (selectSubstation) => selectSubstation.strId === ele.id
                            );
                            if (undefined !== findSubstation) {
                                ele.checked = true;
                                findSubstationIndex++;
                            }
                            ele.disabled = disabledFlag;
                        });
                        if (findSubstationIndex > 0 && !disabledFlag) {
                            item.indeterminate = true;
                            if (findSubstationIndex === item.children.length) {
                                item.checked = true;
                                item.indeterminate = false;
                            }
                        }
                    }
                });
            }
        }
        this.setState({
            multipleData: substations,
            checkBoxType: CHECKBOX_GROUP_TYPE.NORMAL,
        });
    };

    getCompanies = async (editFlag = false, disabledFlag = false) => {
        let { getCompanyInfo } = this.props;
        let title = formatMessage(locale.MenuDataPermission);
        if (this.originCompanyData.length === 0) {
            let result = await getCompanyInfo('', '', '', -1, -1, '', 1, 10000);
            let companies = [
                {
                    id: -1,
                    title,
                    value: -1,
                    checked: false,
                    indeterminate: false,
                    children: [],
                },
            ];
            if (
                result &&
                result.success &&
                result.data &&
                result.data.list &&
                result.data.list.length > 0
            ) {
                result.data.list.forEach((element) => {
                    if (isEmpty(companies[0].children)) {
                        companies[0].children.push({
                            id: element.id,
                            title: element.company,
                            value: element.id,
                            checked: false,
                            indeterminate: false,
                            children: [],
                        });
                    } else {
                        let findCompanyIndex = companies[0].children.findIndex(
                            (item) => item.id === element.id
                        );
                        if (-1 === findCompanyIndex) {
                            companies[0].children.push({
                                id: element.id,
                                title: element.company,
                                value: element.id,
                                checked: false,
                                indeterminate: false,
                                children: [],
                            });
                        } else {
                            companies[0].children[findCompanyIndex].children.push({
                                id: element.id,
                                title: element.company,
                                value: element.id,
                                checked: false,
                                indeterminate: false,
                            });
                        }
                    }
                });
            }
            this.originCompanyData = deepClone(companies);
            this.updateCompanyData(editFlag, companies, disabledFlag);
        } else {
            let result = this.handlerCompanyData(title);
            this.updateCompanyData(editFlag, result, disabledFlag);
        }
    };

    handlerCompanyData = (title) => {
        this.originCompanyData[0].title = title;
        return deepClone(this.originCompanyData);
    };

    updateCompanyData = (editFlag, companies, disabledFlag) => {
        if (!editFlag) {
            this.setState({
                multipleData: companies,
                checkBoxType: CHECKBOX_GROUP_TYPE.TITLE_WITH_CHECKBOX,
            });
        } else {
            this.getDefaultCheckCompanies(companies, disabledFlag);
        }
    };

    getDefaultCheckCompanies = (companies, disabledFlag) => {
        if (companies && companies[0].children && companies[0].children.length > 0) {
            let { dataInfo } = this.props;
            if (
                dataInfo &&
                dataInfo.record &&
                dataInfo.record.length &&
                dataInfo.record.length > 0
            ) {
                companies[0].children.map((item) => {
                    let findCompany = dataInfo.record.find(
                        (selectCompany) => selectCompany.strId == item.id
                    );
                    if (undefined !== findCompany) {
                        item.checked = true;
                    }
                    item.disabled = disabledFlag;
                });
            }
        }
        this.setState({
            multipleData: companies,
            checkBoxType: CHECKBOX_GROUP_TYPE.TITLE_WITH_CHECKBOX,
        });
    };

    /**
     * 公司/站点切换显示
     */
    operateModelChange = (recordGroupType) => {
        let { actionMenuType, handlerEdit, recordGroupTypeChange, dataInfo } = this.props;
        recordGroupTypeChange(recordGroupType);
        this.setState(
            {
                recordGroupType,
                checkBoxType:
                    recordGroupType === 2
                        ? CHECKBOX_GROUP_TYPE.NORMAL
                        : CHECKBOX_GROUP_TYPE.TITLE_WITH_CHECKBOX,
            },
            () => {
                if (actionMenuType === 2) {
                    handlerEdit(dataInfo, recordGroupType);
                } else {
                    recordGroupType === 2 ? this.getSubstations(false) : this.getCompanies(false);
                }
            }
        );
    };

    handlerCallBack = (multipleData) => {
        this.setState({ callBackData: multipleData });
    };

    handlerCreateOrEditDataGroup = () => {
        let {
            addRecordGroup,
            updateRecordGroup,
            handlerRefreshClick,
            form: { validateFields },
            actionMenuType,
            dataInfo,
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                let { callBackData, recordGroupType } = this.state;
                let convertResult = this.convertSelectData(callBackData, recordGroupType);
                Modal.confirm({
                    title: formatMessage(locale.SaveConfirmation),
                    content: formatMessage(locale.SaveConfirmationContent),
                    onOk: async () => {
                        let result =
                            actionMenuType === 1
                                ? await addRecordGroup(
                                      values.name,
                                      values.remark,
                                      convertResult.join(','),
                                      values.recordGroupType
                                  )
                                : await updateRecordGroup(
                                      dataInfo.id,
                                      values.name,
                                      values.remark,
                                      convertResult.join(','),
                                      values.recordGroupType
                                  );
                        if (result.success) {
                            toast(
                                'success',
                                actionMenuType === 1
                                    ? formatMessage(locale.NewCreateSuccess)
                                    : formatMessage(locale.EditSuccess)
                            );
                            handlerRefreshClick();
                        }
                    },
                });
            }
        });
    };

    /*
     *将选择的数据转换成接口接收的数据格式
     */
    convertSelectData = (callBackData, recordGroupType) => {
        let result = [];
        if (callBackData && Array.isArray(callBackData)) {
            if (callBackData[0] && callBackData[0].children) {
                callBackData[0].children.forEach((item) => {
                    if (2 === recordGroupType) {
                        if (item.children && Array.isArray(item.children)) {
                            item.children.forEach((element) => {
                                element.checked ? result.push(element.id) : '';
                            });
                        }
                    } else {
                        item.checked ? result.push(item.id) : '';
                    }
                });
            } else {
                callBackData.forEach((item) => {
                    result.push(item.strId);
                });
            }
        }
        return result;
    };

    handlerReset = () => {
        let { recordGroupType } = this.state;
        let { handlerEdit, actionMenuType, dataInfo } = this.props;
        if (isEmpty(recordGroupType)) {
            this.getSubstations(false);
            return;
        }
        if (actionMenuType === 2) {
            handlerEdit(dataInfo, dataInfo.recordGroupType);
        } else {
            this.handlerSetDefValue('', recordGroupType, '');
            recordGroupType === 2 ? this.getSubstations(false) : this.getCompanies(false);
        }
    };

    handlerResetAllFields = () => {
        this.props.form.resetFields();
    };

    handlerSetDefValue = (name, recordGroupType, remark) => {
        this.props.form.setFieldsValue({ name });
        this.props.form.setFieldsValue({ recordGroupType });
        this.props.form.setFieldsValue({ remark });
    };

    render() {
        let {
            form: { getFieldDecorator },
            dataInfo,
            actionMenuType,
        } = this.props;
        let { multipleData, checkBoxType } = this.state;
        return (
            <Scrollbar>
                <Card
                    title={formatMessage(locale.DataVisibilityRangeSetting)}
                    className='page-layout-content-card'
                    bordered={false}
                    extra={
                        <Row gutter={12} type='flex' justify='end' align='middle'>
                            <Col>
                                <Button
                                    disabled={actionMenuType === 1 ? false : actionMenuType === 3}
                                    onClick={this.handlerReset}>
                                    {formatMessage(locale['Reset'])}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    disabled={actionMenuType === 1 ? false : actionMenuType === 3}
                                    type='primary'
                                    onClick={this.handlerCreateOrEditDataGroup}>
                                    {formatMessage(locale.Save)}
                                </Button>
                            </Col>
                        </Row>
                    }>
                    <Spin spinning={this.state.loading}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.Name)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'name',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    { required: true, emptyHint: 'SubstationDataPermissionName' },
                                    actionMenuType === 1
                                        ? ''
                                        : dataInfo && dataInfo.name
                                        ? dataInfo.name
                                        : ''
                                )(
                                    <Input
                                        disabled={actionMenuType === 3}
                                        placeholder={formatMessage(
                                            locale.SubstationDataPermissionName
                                        )}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.SystemLogOperateModule)}>
                                {getFieldDecorator('recordGroupType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage(
                                                locale.SystemLogSelectOperateModule
                                            ),
                                        },
                                    ],
                                    // initialValue: recordGroupType ? recordGroupType : 2,
                                })(
                                    <Select
                                        allowClear={false}
                                        data={[
                                            {
                                                key: 2,
                                                value: 2,
                                                name: formatMessage(locale.Substation),
                                            },
                                            {
                                                key: 3,
                                                value: 3,
                                                name: formatMessage(locale.Company),
                                            },
                                        ]}
                                        onChange={this.operateModelChange}
                                        disabled={actionMenuType === 3}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.Remark)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'remark',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    false,
                                    actionMenuType === 1
                                        ? ''
                                        : dataInfo && dataInfo.remark
                                        ? dataInfo.remark
                                        : ''
                                )(
                                    <Input
                                        placeholder={formatMessage(locale.RemarkTips)}
                                        disabled={actionMenuType === 3}
                                    />
                                )}
                            </Form.Item>
                        </StandardForm>
                        <CheckBoxGroup
                            type={checkBoxType}
                            data={multipleData}
                            showFistLevelChecked={false}
                            handlerCallBack={this.handlerCallBack}
                        />
                    </Spin>
                </Card>
            </Scrollbar>
        );
    }
}
export default injectIntl(DataAuthManagement);
