import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { locale } from '../../../../pages/locale';
import SplitterLayout from '../../../../containers/splitterLayout';
import SiderDrawer from '../../../../containers/siderDrawer';
import StandardForm from '../../../../components/standardForm';
import StandardTable from '../../../../components/standardTable';
import Scrollbar from '../../../../components/baseScroll';
import ArchiveTree, {
    ARCHIVE_TREE_TYPE,
    ARCHIVE_NODE_TYPE,
} from '../../../../containers/archiveTree';
import SearchCard from '../../../../containers/searchCard';
import { archiveAction } from '../../../../actions';
import { formItemTips, handleSpace } from '../../../../utils/dom';
@connect(
    (state) => ({
        commonState: state.commonReducer,
        regionInfoState: state.regionReducer,
    }),
    (dispatch) => ({
        getRegionInfo: (parentRegionId, regionType, regionName, dataSource, page, limit) =>
            dispatch(
                archiveAction.getRegionInfo(
                    parentRegionId,
                    regionType,
                    regionName,
                    dataSource,
                    page,
                    limit
                )
            ),
        trigger: () => dispatch(archiveAction.trigger()),
    })
)
@Form.create()
class RegionManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            parentRegionId: '',
            expandedRowKeys: [],
            page: 1,
            pageSize: 10,
            regionType: '',
            regionName: '',
        };
    }

    static defaultProps = {
        // default input value actually is null
    };

    // did after constructor, before everything else
    componentDidMount() {
        let { parentRegionId, regionType, regionName, page, pageSize } = this.state;
        this.loadData(parentRegionId, regionType, regionName, null, page, pageSize);
    }

    loadData = async (parentRegionId, regionType, regionName, dataSource, page, pageSize) => {
        let { getRegionInfo } = this.props;
        this.setState({
            loading: true,
        });
        await getRegionInfo(parentRegionId, regionType, regionName, dataSource, page, pageSize);

        if (dataSource === null) {
            this.setState({
                loading: false,
                page: page,
                limit: pageSize,
                parentRegionId: parentRegionId,
                expandedRowKeys: [],
                regionType,
                regionName,
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    };

    /**
     *
     */
    expandedRowRender = (record) => {
        let {
            regionInfoState: { dataSource },
            intl: { formatMessage },
        } = this.props;

        const columns = [
            {
                title: formatMessage(locale.RegionName),
                dataIndex: 'regionName',
                key: 'regionName',
                width: 199,
            },
            {
                title: formatMessage(locale.Remark),
                dataIndex: 'remark',
                key: 'remark',
            },
        ];

        let recordData = dataSource.list.find((item) => item.id === record.id);
        return (
            <StandardTable
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={
                    recordData.childDataSource === undefined ? [] : recordData.childDataSource.list
                }
                pagination={false}
            />
        );
    };
    handSearchClick = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                let { regionName } = values;
                let { parentRegionId, regionType, page, pageSize } = this.state;
                this.loadData(parentRegionId, regionType, regionName, null, page, pageSize);
            }
        });
    };

    handlerReset = () => {
        this.setState(
            {
                regionName: '',
            },
            () => {
                this.handSearchClick();
            }
        );
        this.props.form.resetFields();
    };

    render() {
        const {
            form: { getFieldDecorator },
            intl: { formatMessage },
            isMobile,
            regionInfoState: { dataSource },
        } = this.props;
        let {
            loading,
            expandedRowKeys,
            regionType,
            regionName,
            parentRegionId,
            page,
            limit,
        } = this.state;
        const columns = [
            {
                title: formatMessage(locale.RegionName),
                dataIndex: 'regionName',
                key: 'regionName',
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
                        moduleId={'archive-region'}
                        moduleType={ARCHIVE_TREE_TYPE.MENU}
                        rootNodeParentType={ARCHIVE_NODE_TYPE.COUNTRY}
                        leafNodeType={ARCHIVE_NODE_TYPE.PROVINCE}
                        onClick={(key, parentKey, title, type) => {
                            this.loadData(key, type, regionName, null, page, limit);
                        }}
                    />
                </SiderDrawer>
                <Scrollbar>
                    <SearchCard
                        handlerSearch={this.handSearchClick}
                        handlerReset={this.handlerReset}>
                        <StandardForm>
                            <Form.Item label={formatMessage(locale.RegionName)}>
                                {formItemTips(
                                    getFieldDecorator,
                                    'regionName',
                                    0,
                                    50,
                                    formatMessage,
                                    locale,
                                    false
                                )(
                                    <Input
                                        placeholder={formatMessage(locale.SearchInput)}
                                        onChange={(e) => {
                                            this.setState({ regionName: e.target.value });
                                        }}
                                    />
                                )}
                            </Form.Item>
                        </StandardForm>
                    </SearchCard>
                    <StandardTable
                        loading={loading}
                        columns={columns}
                        current={page}
                        rowKey={(record) => record.id}
                        expandedRowKeys={expandedRowKeys}
                        dataSource={dataSource === null ? [] : dataSource.list}
                        expandedRowRender={(record) => this.expandedRowRender(record)}
                        onExpand={(expanded, record) => {
                            if (expanded) {
                                this.setState({
                                    expandedRowKeys: [record.id],
                                });
                                this.loadData(record.id, 'city', regionName, dataSource, 1, 1000);
                            } else {
                                this.setState({
                                    expandedRowKeys: [],
                                });
                            }
                        }}
                        onChange={(pagination) => {
                            this.loadData(
                                parentRegionId,
                                regionType,
                                regionName,
                                null,
                                pagination.current,
                                pagination.pageSize
                            );
                        }}
                        total={dataSource.totalRecords}
                        totalTip={formatMessage(locale.TableCount, {
                            count: dataSource.totalRecords,
                        })}
                    />
                </Scrollbar>
            </SplitterLayout>
        );
    }
}
export default injectIntl(RegionManagement);
