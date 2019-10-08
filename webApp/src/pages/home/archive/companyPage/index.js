import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button as AntdButton, Modal, Icon } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import SplitterLayout from '../../../../containers/splitterLayout';
import StandardForm from '../../../../components/standardForm';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import ArchiveTree, {
    ARCHIVE_TREE_TYPE,
    ARCHIVE_NODE_TYPE,
} from '../../../../containers/archiveTree';
import SiderDrawer from '../../../../containers/siderDrawer';
import SearchCard from '../../../../containers/searchCard';
import TableAction from '../../../../containers/tableAction';
import AddOrUpdateCompany from './addOrUpdateCompany';
import { archiveAction } from '../../../../actions';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);

@connect(
    (state) => ({
        commonState: state.commonReducer,
        companyInfoState: state.companyReducer,
    }),
    (dispatch) => ({
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
        addEditCompanyInfo: (companyInfo) =>
            dispatch(archiveAction.addEditCompanyInfo(companyInfo)),
        deleteCompanyInfo: (selectedIds, selectedParentIds, selectedKeys) =>
            dispatch(archiveAction.deleteCompanyInfo(selectedIds, selectedParentIds, selectedKeys)),
    })
)
@Form.create()
class CompanyManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            countryId: null,
            stateId: null,
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
            loading: false,
            page: 1,
            pageSize: 10,
            country: '',
            province: '',
            city: '',
            companyType: '-1',
            company: '',
            addVisible: false,
            actionMenuType: 1,
            searchLocationInfo: '',
            searchCountryId: '',
            searchProvinceId: '',
            searchCityId: '',
            searchRegionValues: '',
            companyInfo: {},
            clearEnterListener: false,
        };
    }

    static defaultProps = {
        loading: false, //是否加载中(电力公司)
        parentId: '', //父级ID
        country: '-1', //国家ID
        province: '-1', //省份ID
        city: '-1', //地区ID
        companyType: '-1', //电力公司类型
        company: '', //电力公司名称
        addVisible: false, //新增或者编辑弹出框是否显示
        actionMenuType: 1, // 1 新建 2 编辑
        searchLocationInfo: '', //地区信息(查询)
        searchCountryId: '', //国家ID(查询)
        searchProvinceId: '', //省份ID(查询)
        searchCityId: '', //城市ID(查询)
        searchRegionValues: '',
        companyInfo: {},
    };

    componentDidMount() {
        // did after constructor, before everything else
        let {
            parentId,
            country,
            province,
            city,
            companyType,
            company,
            page,
            pageSize,
        } = this.state;
        this.loadData(
            parentId,
            country,
            province,
            city,
            companyType,
            company,
            null,
            page,
            pageSize
        );
    }

    loadData = async (
        parentId,
        country,
        province,
        city,
        companyType,
        company,
        dataSource,
        page,
        pageSize
    ) => {
        let { getCompanyInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getCompanyInfo(
            country,
            province,
            city,
            parentId,
            companyType,
            company,
            page,
            pageSize
        );

        if (dataSource === null) {
            this.setState({
                loading: false,
                page: page,
                limit: pageSize,
                parentId,
                country,
                province,
                city,
                companyType,
                company,
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    };

    handlerCreate = () => {
        this.setState({
            addVisible: true,
            actionMenuType: 1,
            clearEnterListener: true,
        });
    };

    handlerEdit = () => {
        let { selectedRowKeys } = this.state;
        let {
            intl: { formatMessage },
        } = this.props;
        if (selectedRowKeys && selectedRowKeys.length == 1) {
            this.setState({
                addVisible: true,
                actionMenuType: 2,
                clearEnterListener: true,
            });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.UserCenterEditSelectTips),
            });
        }
    };

    onSelectCallBack = (selectedRowKeys, selectedItems) => {
        let selectedParentIds = [];
        let selectedUniqueKeys = [];
        selectedItems.map((item) => {
            selectedParentIds.push(item.parentId);
            selectedUniqueKeys.push(item.id);
        });
        this.setState({
            selectedRowKeys,
            selectedParentIds,
            selectedUniqueKeys,
        });
    };

    handlerRefresh = () => {
        let { country, province, city, companyType, company, page, pageSize } = this.state;
        this.loadData(null, country, province, city, companyType, company, null, page, pageSize);
    };

    handlerDelete = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys, selectedParentIds, selectedUniqueKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteCompanyInfo,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys } = this.state;
                    if (deleteCompanyInfo) {
                        let result = await deleteCompanyInfo(
                            selectedRowKeys.join(','),
                            selectedParentIds,
                            selectedUniqueKeys
                        );
                        if (result.success) {
                            toast('success', formatMessage(locale.DeleteSuccess));
                            this.handlerRefresh();
                            selectedRowKeys = '';
                            selectedParentIds = [];
                            selectedUniqueKeys = [];
                            this.setState({
                                selectedRowKeys,
                                selectedParentIds,
                                selectedUniqueKeys,
                            });
                        }
                    }
                },
            });
        } else {
            Modal.warning({
                title: formatMessage(locale.TipMessage),
                content: formatMessage(locale.SelectedNone),
            });
        }
    };

    onUpdateData = () => {
        let { country, province, city, companyType, company, page, pageSize } = this.state;
        this.loadData(null, country, province, city, companyType, company, null, page, pageSize);
    };

    handSearchClick = () => {
        this.cleanSelectedKeys();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                const searchCompanyName = values.searchCompanyName;
                const searchCompanyType = values.searchCompanyType;
                let { searchCountryId, searchProvinceId, searchCityId, pageSize } = this.state;
                this.loadData(
                    -1,
                    searchCountryId,
                    searchProvinceId,
                    searchCityId,
                    searchCompanyType,
                    searchCompanyName,
                    null,
                    1,
                    pageSize
                );
            }
        });
    };

    handlerReset = () => {
        this.setState(
            {
                searchRegionValues: '',
                searchCountryId: '',
                searchProvinceId: '',
                searchCityId: '',
                searchCompanyName: '',
                searchCompanyType: -1,
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    handleAction = () => {};

    handlerEditClickOnTable = (actionID, object) => {
        this.setState({
            addVisible: true,
            actionID,
            companyInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    handlerDeleteClickOnTable = (actionID, object) => {
        let {
            intl: { formatMessage },
            deleteCompanyInfo,
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let { selectedRowKeys, selectedParentIds, selectedUniqueKeys } = this.state;
                if (deleteCompanyInfo) {
                    let result = await deleteCompanyInfo(actionID, [object.parentId], [actionID]);
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.handlerRefresh();
                        if (selectedRowKeys && selectedRowKeys.length > 0) {
                            selectedRowKeys.splice(
                                selectedRowKeys.findIndex((item) => item === actionID),
                                1
                            );
                            selectedParentIds.splice(
                                selectedParentIds.findIndex((item) => item === object.parentId),
                                1
                            );
                            selectedUniqueKeys.splice(
                                selectedUniqueKeys.findIndex((item) => item === actionID),
                                1
                            );
                            this.setState({
                                selectedRowKeys,
                                selectedParentIds,
                                selectedUniqueKeys,
                            });
                        }
                    }
                }
            },
        });
    };

    getLocationValue = (node, type) => {
        let _this = this;
        if (node.type != 'country') {
            switch (node.type) {
                case 'cityOrCounty':
                    _this.state.city = node.key;
                    break;
                case 'province':
                    _this.state.province = node.key;
                    break;
                default:
                    break;
            }
            this.getLocationValue(node.parentRef, type);
        } else {
            _this.state.country = node.key;
        }
        switch (type) {
            case ARCHIVE_NODE_TYPE.COUNTRY:
                _this.state.province = '';
                _this.state.city = '';
                break;
            case ARCHIVE_NODE_TYPE.PROVINCE:
                _this.state.city = '';
                break;
            default:
                break;
        }
        return this.state;
    };

    onCancel = () => {
        this.setState({ addVisible: false, clearEnterListener: false });
    };

    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
        });
    };

    render() {
        let {
            loading,
            country,
            province,
            city,
            companyType,
            company,
            page,
            pageSize,
            addVisible,
            actionMenuType,
            companyInfo,
            selectedRowKeys,
            clearEnterListener,
        } = this.state;
        let {
            form: { getFieldDecorator },
            intl: { formatMessage },
            companyInfoState: { dataSource },
            isMobile,
        } = this.props;
        if (dataSource && dataSource.list && dataSource.list.length > 0) {
            dataSource.list = dataSource.list.map((element) => {
                element.key = element.id;
                if (element.companyType == 0) {
                    element.companyType = formatMessage(locale.CompanyManagerTestingCompany);
                } else if (element.companyType == 1) {
                    element.companyType = formatMessage(locale.ElectricPowerCompany);
                } else if (
                    element.companyType == formatMessage(locale.CompanyManagerTestingCompany)
                ) {
                    element.companyType = formatMessage(locale.CompanyManagerTestingCompany);
                } else if (element.companyType == formatMessage(locale.ElectricPowerCompany)) {
                    element.companyType = formatMessage(locale.ElectricPowerCompany);
                } else {
                    element.companyType = formatMessage(locale.CompanyManagerTestingCompany);
                }
                return element;
            });
        }
        const columns = [
            {
                title: formatMessage(locale.CompanyName),
                dataIndex: 'company',
                key: 'company',
                width: 200,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.CompanyManagerSuperCompanyName),
                dataIndex: 'parentName',
                key: 'parentName',
                width: 200,
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            // { title: formatMessage(locale.CompanyManagerCompanyType), dataIndex: 'companyType', key: 'companyType', width: 150 },
            {
                title: formatMessage(locale.Region),
                dataIndex: 'cityName',
                key: 'cityName',
                width: 150,
            },
            {
                title: formatMessage(locale.Province),
                dataIndex: 'provinceName',
                key: 'provinceName',
                width: 150,
            },
            {
                title: formatMessage(locale.Country),
                dataIndex: 'countryName',
                key: 'countryName',
                width: 150,
            },
            {
                title: formatMessage(locale.Remark),
                dataIndex: 'remark',
                key: 'remark',
                render: (content) =>
                    isEmpty(content) ? (
                        ''
                    ) : (
                        <Ellipsis tooltip fullWidthRecognition lines>
                            {content}
                        </Ellipsis>
                    ),
            },
            {
                title: formatMessage(locale.Operate),
                dataIndex: 'id',
                key: 'id',
                fixed: 'right',
                width: 150,
                align: 'center',
                render: (actionID, object) => (
                    <TableHandler
                        batchActions={[{ title: 'Edit', auth: 'NewOrEditCompany' }]}
                        batchActionsMore={[{ title: 'Delete', auth: 'DeleteCompany' }]}
                        handleAction={(menu) => {
                            if (menu === 'Edit') {
                                this.handlerEditClickOnTable(actionID, object);
                            }
                        }}
                        handleActionMore={(menu) => {
                            if (menu.key === 'Delete') {
                                this.handlerDeleteClickOnTable(actionID, object);
                            }
                        }}
                    />
                ),
            },
        ];
        return (
            <SplitterLayout
                percentage={true}
                secondaryInitialSize={isMobile ? 100 : 80}
                secondaryMinSize={isMobile ? 100 : 60}>
                <SiderDrawer
                    className='page-layout-sider-drawer'
                    title={formatMessage(locale.RegionTree)}
                    mode={isMobile ? 'drawer' : 'sider'}>
                    <ArchiveTree
                        moduleId={'regionCompanyIndex'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COUNTRY}
                        leafNodeType={ARCHIVE_NODE_TYPE.CITY_OR_COUNTY}
                        onTreeSelect={this._onStationTreeSelect}
                        onClick={(key, dataRef, title, type) => {
                            let result = this.getLocationValue(dataRef, type);
                            this.loadData(
                                -1,
                                result.country,
                                result.province,
                                result.city,
                                companyType,
                                company,
                                null,
                                1,
                                pageSize
                            );
                        }}
                    />
                </SiderDrawer>
                <Scrollbar>
                    <SearchCard
                        handlerSearch={this.handSearchClick}
                        handlerReset={this.handlerReset}
                        clearEnterListener={clearEnterListener}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.CompanyName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'searchCompanyName',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    { required: false }
                                )(
                                    <Input
                                        placeholder={formatMessage(
                                            locale.CompanyManagerCompanyNameRequest
                                        )}
                                    />
                                )}
                            </Form.Item>
                            {/* <Form.Item
                                label={formatMessage(locale.CompanyManagerCompanyType)}
                                >
                                {getFieldDecorator('searchCompanyType')(<Select placeholder={formatMessage(locale.CompanySelectCompanyType)}>
                                    <Select.Option value="0">{formatMessage(locale.CompanyManagerTestingCompany)}</Select.Option>
                                    <Select.Option value="1">{formatMessage(locale.ElectricPowerCompany)}</Select.Option>
                                </Select>)}
                            </Form.Item> */}
                        </StandardForm>
                    </SearchCard>
                    <StandardTable
                        loading={loading}
                        columns={columns}
                        current={page}
                        title={() => (
                            <TableAction
                                batchActions={[{ title: 'Delete', auth: 'DeleteCompany' }]}
                                handleAction={(menu) => {
                                    if (menu.key === 'Delete') {
                                        this.handlerDelete();
                                    }
                                }}
                                cleanSelectedKeys={this.cleanSelectedKeys}
                                rowCount={selectedRowKeys.length}>
                                <Row gutter={12} type='flex' justify='end' align='middle'>
                                    <Col>
                                        <Button
                                            auth='NewOrEditCompany'
                                            type='primary'
                                            onClick={this.handlerCreate}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    e.preventDefault();
                                                }
                                            }}>
                                            <Icon type='plus' theme='outlined' />
                                            {formatMessage(locale.New)}
                                        </Button>
                                    </Col>
                                </Row>
                            </TableAction>
                        )}
                        rowKey={(record) => record.id}
                        dataSource={dataSource === null ? [] : dataSource.list}
                        onChange={(pagination) => {
                            let { parentId } = this.state;
                            this.loadData(
                                parentId,
                                country,
                                province,
                                city,
                                companyType,
                                company,
                                null,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={dataSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: dataSource.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack.bind(this)}
                    />
                    <AddOrUpdateCompany
                        visible={addVisible}
                        onCancel={this.onCancel}
                        actionMenuType={actionMenuType}
                        onUpdateData={this.onUpdateData.bind(this)}
                        companyInfo={companyInfo}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(CompanyManagement);
