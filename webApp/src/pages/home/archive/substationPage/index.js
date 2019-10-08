import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button as AntdButton, Select, Icon, Modal, Upload } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../locale';
import { toast } from '../../../../components/toast';
import { getFileMD5 } from '../../../../utils/browserMd5File';
import SplitterLayout from '../../../../containers/splitterLayout';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import Ellipsis from '../../../../components/ellipsis';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import SiderDrawer from '../../../../containers/siderDrawer';
import SearchCard from '../../../../containers/searchCard';
import TableAction from '../../../../containers/tableAction';
import AddOrUpdateSubstation from './addOrUpdateSubstation';
import { archiveAction } from '../../../../actions';
import moment from 'moment';
import StandardForm from '../../../../components/standardForm';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import TableHandler from '../../../../containers/tableHandler';
import ajax from '../../../../utils/ajax';
import { getSign } from '../../../../utils/sign';
import CryptoJS from 'crypto-js';
import { authComponent } from '../../../../components/authComponent';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        substationInfoState: state.substationReducer,
    }),
    (dispatch) => ({
        //获取变电站
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
            ), // just substationNames and voltageLevels
        //添加/更新变电站
        addEditSubstationInfo: (substationInfo) =>
            dispatch(archiveAction.addEditSubstationInfo(substationInfo)),
        //删除变电站
        deleteSubstationInfo: (selectedIds, selectedParentIds, selectedKeys) =>
            dispatch(
                archiveAction.deleteSubstationInfo(selectedIds, selectedParentIds, selectedKeys)
            ),
        uploadSubstationInfo: (file, type, md5) =>
            dispatch(archiveAction.uploadSubstationInfo(file, type, md5)),
        uploadSubstationSVG: (svgParam) => dispatch(archiveAction.uploadSubstationSVG(svgParam)),
    })
)
@Form.create()
class subsationManagent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedParentIds: [],
            selectedUniqueKeys: [],
            loading: false,
            page: 1,
            pageSize: 10,
            actionMenuType: 1,
            addVisible: false,
            companyId: -1,
            searchCountryID: '',
            searchProvinceID: '',
            searchCityID: '',
            searchVoltageLevelID: '',
            searchSubstation: '',
            searchCompany: '',
            voltageLevelName: '',
            substaionInfo: {},
            isBatchDelete: false,
            uploadLoading: false,
            uploadDisabled: false,
            uploadIconType: 'upload',
            uploadSubstationID: undefined,
            searchLocationName: '',
            clearEnterListener: false,
            svgDrawVisible: false,
        };
        this.fileMd5 = '';
    }

    static defaultProps = {
        selectedRowKeys: [], //选中的 key集合
        loading: false, // 数据是否加载中
        page: 1, // 当前页码
        pageSize: 10, //每页查询数量
        actionMenuType: 1, //操作类型 1 新增 2 更新
        addVisible: false, //新增或者编辑弹出框是否显示
        companyId: -1, //公司ID
        searchCountryID: '', //国家ID(查询条件)
        searchProvinceID: '', //省份ID(查询条件)
        searchCityID: '', //城市ID(查询条件)
        searchVoltageLevelID: '', //电压等级ID(查询条件)
        searchSubstation: '',
        searchCompany: '',
        voltageLevelName: '',
        substaionInfo: {},
    };

    componentDidMount() {
        // did after constructor, before everything else
        const {
            searchCompany,
            searchSubstation,
            voltageLevelName,
            searchCountryID,
            searchProvinceID,
            searchCityID,
            companyId,
            page,
            pageSize,
        } = this.state;
        this.getData(
            companyId,
            searchCompany,
            searchSubstation,
            voltageLevelName,
            searchCountryID,
            searchProvinceID,
            searchCityID,
            page,
            pageSize,
            null
        );
    }

    getData = async (
        companyId,
        searchCompany,
        searchSubstation,
        voltageLevelName,
        countryId,
        provinceId,
        cityCountyId,
        page,
        limit,
        dataSource
    ) => {
        this.setState({
            loading: true,
        });
        let { getSubstationInfo } = this.props;
        if (getSubstationInfo) {
            await getSubstationInfo(
                companyId,
                searchCompany,
                searchSubstation,
                voltageLevelName,
                countryId,
                provinceId,
                cityCountyId,
                page,
                limit
            );
        }
        this.setState({
            loading: false,
            page: page,
            pageSize: limit,
            companyId,
            searchCompany,
            searchSubstation,
            voltageLevelName,
            countryId,
            provinceId,
            cityCountyId,
        });
    };

    handSearchClick = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                const searchSubstation =
                    values.searchSubstation == undefined ? '' : values.searchSubstation;
                const voltageLevelName =
                    values.voltageLevelName == undefined ? '' : values.voltageLevelName;
                const searchCompany = values.searchCompany == undefined ? '' : values.searchCompany;
                const {
                    searchCountryID,
                    searchProvinceID,
                    searchCityID,
                    companyId,
                    pageSize,
                } = this.state;
                this.getData(
                    companyId,
                    searchCompany,
                    searchSubstation,
                    voltageLevelName,
                    searchCountryID,
                    searchProvinceID,
                    searchCityID,
                    1,
                    pageSize
                );
            }
        });
    };

    handlerCreate = () => {
        this.setState({
            addVisible: true,
            actionMenuType: 1,
            clearEnterListener: true,
        });
    };

    handlerEdit = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
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

    handlerDelete = () => {
        let {
            intl: { formatMessage },
        } = this.props;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            Modal.confirm({
                title: formatMessage(locale.DelConfirm),
                content: formatMessage(locale.DelConfirmTips),
                onOk: async () => {
                    let {
                        deleteSubstationInfo,
                        intl: { formatMessage },
                    } = this.props;
                    let { selectedRowKeys, selectedParentIds, selectedUniqueKeys } = this.state;
                    if (deleteSubstationInfo) {
                        let result = await deleteSubstationInfo(
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

    handlerReset = () => {
        this.setState(
            {
                searchCountryID: '',
                searchProvinceID: '',
                searchCityID: '',
                searchCompany: '',
                searchSubstation: '',
                voltageLevelName: '',
                searchLocationName: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    handlerRefresh = () => {
        let {
            searchCompany,
            searchSubstation,
            voltageLevelName,
            searchCountryID,
            searchProvinceID,
            searchCityID,
            companyId,
            page,
            pageSize,
        } = this.state;
        this.getData(
            companyId,
            searchCompany,
            searchSubstation,
            voltageLevelName,
            searchCountryID,
            searchProvinceID,
            searchCityID,
            page,
            pageSize,
            null
        );
    };

    handleAction = () => {};

    onSelectCallBack = (selectedRowKeys, selectedItems) => {
        let selectedParentIds = [];
        let selectedUniqueKeys = [];
        selectedItems.map((item) => {
            selectedParentIds.push(item.companyId);
            selectedUniqueKeys.push(item.substationId);
        });
        this.setState({
            selectedRowKeys,
            selectedParentIds,
            selectedUniqueKeys,
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

    onSearchSubstationLocationSelect = (value, node, extra) => {
        let result = this.getLocationValue(node, node.type);
        this.setState({
            searchCountryID: result.country,
            searchProvinceID: result.province,
            searchCityID: result.city,
        });
        this.setState({ searchLocationName: value });
    };

    handlerEditClickOnTable = (actionID, object) => {
        this.setState({
            addVisible: true,
            actionID,
            substaionInfo: object,
            actionMenuType: 2,
            clearEnterListener: true,
        });
    };

    handlerDeleteClickOnTable = (actionID, object) => {
        let {
            intl: { formatMessage },
        } = this.props;
        Modal.confirm({
            title: formatMessage(locale.DelConfirm),
            content: formatMessage(locale.DelConfirmTips),
            onOk: async () => {
                let {
                    deleteSubstationInfo,
                    intl: { formatMessage },
                } = this.props;
                let { selectedRowKeys, selectedParentIds, selectedUniqueKeys } = this.state;
                if (deleteSubstationInfo) {
                    let result = await deleteSubstationInfo(
                        actionID,
                        [object.companyId],
                        [object.substationId]
                    );
                    if (result.success) {
                        toast('success', formatMessage(locale.DeleteSuccess));
                        this.handlerRefresh();
                        if (selectedRowKeys && selectedRowKeys.length > 0) {
                            selectedRowKeys.splice(
                                selectedRowKeys.findIndex((item) => item === actionID),
                                1
                            );
                            selectedParentIds.splice(
                                selectedParentIds.findIndex((item) => item === object.companyId),
                                1
                            );
                            selectedUniqueKeys.splice(
                                selectedUniqueKeys.findIndex(
                                    (item) => item === object.substationId
                                ),
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

    asyncUploadSubstationInfo = async (file, fileType, res) => {
        let { uploadSubstationInfo } = this.props;
        await uploadSubstationInfo(file, fileType, res);
        this.setState({
            uploadDisabled: false,
            uploadLoading: false,
            uploadIconType: 'upload',
        });
    };

    onCancel = () => {
        this.setState({ addVisible: false, clearEnterListener: false });
    };

    handlerUpdateSVGClickOnTable = (station) => {
        this.setState({ uploadSubstationID: station.substationId });
    };

    handlerEditSVGClickOnTable = (station) => {
        let urlParms = {
            data: getSign({
                substationId: station.substationId,
                type: 2,
            }),
            header: ajax.getHeaders(),
        };
        urlParms.header['Content-Type'] = 'application/json;charset=UTF-8';
        this.setState({
            svgDrawVisible: true,
            urlParms,
        });
    };

    getFile = (file) => {
        let {
            intl: { formatMessage },
        } = this.props;
        let fileType = file.name.substr(file.name.lastIndexOf('.')).replace('.', '');
        if (fileType != 'svg') {
            toast('error', formatMessage(locale.SubstationManagerUploadSVGTip));
            this.setState({
                uploadDisabled: false,
                uploadLoading: false,
                uploadIconType: 'upload',
            });
            return;
        }
        let _this = this;
        let result = '';
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            result = reader.result;
            _this.setState({
                uploadLoading: true,
                uploadDisabled: true,
                uploadIconType: 'loading',
            });
            _this.asyncUploadSubstationSVG(result);
        };
    };

    asyncUploadSubstationSVG = async (result) => {
        let {
            uploadSubstationSVG,
            intl: { formatMessage },
        } = this.props;
        let { uploadSubstationID } = this.state;
        let data = {
            substationId: uploadSubstationID,
            type: 1,
            key: 'layout',
            svgString: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result)),
        };
        let res = uploadSubstationSVG(data);
        if (res) {
            toast('success', formatMessage(locale.SubstationManagerUploadSVGSuccess));
        }
        this.setState({
            uploadDisabled: false,
            uploadLoading: false,
            uploadIconType: 'upload',
        });
    };

    render() {
        let {
            loading,
            page,
            pageSize,
            addVisible,
            actionMenuType,
            companyId,
            searchCompany,
            searchSubstation,
            voltageLevelName,
            searchCountryID,
            searchProvinceID,
            searchCityID,
            substaionInfo,
            selectedRowKeys,
            uploadLoading,
            uploadDisabled,
            uploadIconType,
            searchLocationName,
            clearEnterListener,
            svgDrawVisible,
            urlParms,
        } = this.state;
        const {
            form: { getFieldDecorator },
            intl: { formatMessage, formats },
            substationInfoState: { substationDataSource, commonTypeVoltageLevel },
            isMobile,
        } = this.props;
        const StationiUploadProps = {
            showUploadList: false,
            customRequest: (action) => {
                let file = action.file;
                this.getFile(file);
            },
        };
        const columns = [
            {
                title: formatMessage(locale.SubstationName),
                dataIndex: 'substationName',
                key: 'substationName',
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
                title: formatMessage(locale.VoltageClass),
                dataIndex: 'voltageLevelName',
                key: 'voltageLevelName',
                width: 150,
            },
            {
                title: formatMessage(locale.ElectricPowerCompany),
                dataIndex: 'companyName',
                key: 'companyName',
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
                title: formatMessage(locale.SubstationManagerOperatorName),
                dataIndex: 'operationCompanyName',
                key: 'operationCompanyName',
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
                title: formatMessage(locale.SubstationManagerStartTime),
                dataIndex: 'putIntoOperationDate',
                key: 'putIntoOperationDate',
                visible: false,
                width: 200,
                render: (putIntoOperationDate) =>
                    isEmpty(putIntoOperationDate)
                        ? ''
                        : moment(putIntoOperationDate).format(formats.dateTime),
            },
            {
                title: formatMessage(locale.Region),
                dataIndex: 'cityCountyName',
                key: 'cityCountyName',
                width: 200,
            },
            {
                title: formatMessage(locale.Province),
                dataIndex: 'provinceName',
                key: 'provinceName',
                width: 200,
            },
            {
                title: formatMessage(locale.Country),
                dataIndex: 'countryName',
                key: 'countryName',
                width: 200,
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
                render: (actionID, object) => {
                    let customBatchItem = [
                        {
                            auth: 'UploadOrEditSVG',
                            key: 'UploadSvg',
                            content: (
                                <Upload {...StationiUploadProps}>
                                    <Button className='archive-upload-btn'>
                                        {formatMessage(
                                            locale['SubstationManagerUploadSVG']
                                        ) /*上传布置图*/}
                                    </Button>
                                </Upload>
                            ),
                        },
                    ];
                    if (object.pmapUrl) {
                        customBatchItem.push({
                            auth: 'UploadOrEditSVG',
                            key: 'EditSvg',
                            content: (
                                <span>
                                    {formatMessage(
                                        locale['SubstationManagerEditSVG']
                                    ) /*编辑布置图*/}
                                </span>
                            ),
                        });
                    }
                    return (
                        <TableHandler
                            batchActions={[{ title: 'Edit', auth: 'NewOrEditSubstation' }]}
                            batchActionsMore={[{ title: 'Delete', auth: 'DeleteSubstation' }]}
                            customBatchActionsMore={customBatchItem}
                            handleAction={(menu) => {
                                if (menu === 'Edit') {
                                    this.handlerEditClickOnTable(actionID, object);
                                }
                            }}
                            handleActionMore={(menu) => {
                                if (menu.key === 'Delete') {
                                    this.handlerDeleteClickOnTable(actionID, object);
                                } else if (menu.key === 'UploadSvg') {
                                    this.handlerUpdateSVGClickOnTable(object);
                                } else if (menu.key === 'EditSvg') {
                                    this.handlerEditSVGClickOnTable(object);
                                }
                            }}
                        />
                    );
                },
            },
        ];
        let children = [];
        if (commonTypeVoltageLevel && commonTypeVoltageLevel.length > 0) {
            commonTypeVoltageLevel.forEach((element) => {
                children.push(<Select.Option key={element.typeCode}>{element.name}</Select.Option>);
            });
        }
        return (
            <SplitterLayout
                percentage={true}
                secondaryInitialSize={isMobile ? 100 : 80}
                secondaryMinSize={isMobile ? 100 : 60}>
                <SiderDrawer
                    className='page-layout-sider-drawer'
                    title={formatMessage(locale.ArchiveManagerArchiveTree)}
                    mode={isMobile ? 'drawer' : 'sider'}>
                    <ArchiveTree
                        moduleId={'substationList'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this._onStationTreeSelect}
                        onClick={(key, name, type, item) => {
                            this.getData(
                                key,
                                searchCompany,
                                searchSubstation,
                                voltageLevelName,
                                searchCountryID,
                                searchProvinceID,
                                searchCityID,
                                page,
                                pageSize,
                                null
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
                            <Form.Item label={formatMessage(locale.SubstationName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'searchSubstation',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    false
                                )(<Input placeholder={formatMessage(locale.SearchInput)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.ElectricPowerCompany)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'searchCompany',
                                    0,
                                    100,
                                    formatMessage,
                                    locale,
                                    false
                                )(<Input placeholder={formatMessage(locale.SearchInput)} />)}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.VoltageClass)}>
                                {getFieldDecorator('voltageLevelName')(
                                    <Select
                                        onChange={this.onVoltageChange}
                                        placeholder={formatMessage(locale.VoltageClassTip)}>
                                        {children}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label={formatMessage(locale.RegionTree)}>
                                {getFieldDecorator('searchSubstationLocation')(
                                    <ArchiveTree
                                        moduleId={'searchSubstationLocation'}
                                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                                        rootNodeParentType={ARCHIVE_NODE_TYPE.COUNTRY}
                                        leafNodeType={ARCHIVE_NODE_TYPE.CITY}
                                        onTreeSelect={this.onSearchSubstationLocationSelect.bind(
                                            this
                                        )}
                                        // onTreeSelectExpand={this.onSearchSubstationLocationExpand.bind(this)}
                                        defValue={{
                                            key: 1,
                                            value: searchLocationName,
                                        }}
                                    />
                                )}
                            </Form.Item>
                        </StandardForm>
                    </SearchCard>
                    <StandardTable
                        loading={loading}
                        columns={columns}
                        title={() => (
                            <TableAction
                                batchActions={[{ title: 'Delete', auth: 'DeleteSubstation' }]}
                                handleAction={(menu) => {
                                    if (menu.key === 'Delete') {
                                        this.handlerDelete();
                                    }
                                }}
                                cleanSelectedKeys={() => {
                                    this.setState({
                                        selectedRowKeys: [],
                                        selectedParentIds: [],
                                        selectedUniqueKeys: [],
                                    });
                                }}
                                rowCount={selectedRowKeys.length}>
                                <Row gutter={12} type='flex' justify='end' align='middle'>
                                    <Col style={{ display: 'none' }}>
                                        <Upload
                                            multiple={true}
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                getFileMD5(file).then(
                                                    (res) => {
                                                        this.setState({
                                                            uploadLoading: true,
                                                            uploadDisabled: true,
                                                            uploadIconType: 'loading',
                                                        });
                                                        let fileType = file.name
                                                            .substr(file.name.lastIndexOf('.'))
                                                            .replace('.', '');
                                                        this.asyncUploadSubstationInfo(
                                                            file,
                                                            fileType,
                                                            res
                                                        );
                                                    },
                                                    (err) => {
                                                        console.log(err.message);
                                                    }
                                                );
                                                return false;
                                            }}>
                                            <Button
                                                loading={uploadLoading}
                                                disabled={uploadDisabled}>
                                                <Icon type={uploadIconType} theme='outlined' />
                                                {formatMessage(locale['Import'])}
                                            </Button>
                                        </Upload>
                                    </Col>
                                    <Col>
                                        <Button
                                            auth='NewOrEditSubstation'
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
                        current={page}
                        rowKey={(record) => record.id}
                        dataSource={substationDataSource === null ? [] : substationDataSource.list}
                        onChange={(pagination) => {
                            this.getData(
                                companyId,
                                searchCompany,
                                searchSubstation,
                                voltageLevelName,
                                searchCountryID,
                                searchProvinceID,
                                searchCityID,
                                pagination.current,
                                pagination.pageSize,
                                substationDataSource
                            );
                        }}
                        total={substationDataSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: substationDataSource.totalRecords,
                        })}
                        selectedRowKeys={selectedRowKeys}
                        selectCallBack={this.onSelectCallBack.bind(this)}
                    />
                    <AddOrUpdateSubstation
                        intl={formatMessage}
                        visible={addVisible}
                        substaionInfo={substaionInfo}
                        actionMenuType={actionMenuType}
                        onCancel={this.onCancel}
                        handlerRefresh={this.handlerRefresh.bind(this)}
                    />
                    {/* <Modal
						title=''
						visible={svgDrawVisible}
						centered={true}
						style={{ height: '100%' }}
						bodyStyle={{ height: '100%', padding: 0 }}
						width='100%'
						height={window.innerHeight - 28}
						footer={false}
						onCancel={() => {
							this.setState({
								svgDrawVisible: false,
							});
						}}>
						<iframe
							src={`../../../../../../plugins/svg_draw/indexDMP.html?params=${CryptoJS.enc.Base64.stringify(
								CryptoJS.enc.Utf8.parse(JSON.stringify(urlParms))
							)}`}
							style={{ borderWidth: 0, width: '100%', height: '100%' }}
							frameBorder={0}
							scrolling='no'
						/>
					</Modal> */}
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(subsationManagent);
