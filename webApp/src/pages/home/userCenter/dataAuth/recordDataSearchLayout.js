import React, { PureComponent } from 'react';
import { Form, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import { systemAction } from '../../../../actions';
import { injectIntl } from 'react-intl';
import StandardForm from '../../../../components/standardForm';
const FormItem = Form.Item;
const Option = Select.Option;
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //获取用户数据权限列表
        queryRecordGroup: (name, page, limit) =>
            dispatch(systemAction.queryRecordGroup(name, page, limit)),
    })
)
@Form.create()
class RecordDataSearchLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.state = {
            fetching: false,
            dataGroupValue: [],
            dataGroupData: [],
        };
    }

    static defaultProps = {
        fetching: false,
        dataGroupValue: [], //数据组值
        dataGroupData: [], //数据组
    };

    fetchDataGroupSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ userGroupData: [], fetching: true });
        let { queryRecordGroup } = this.props;
        if (queryRecordGroup) {
            this.getDataGroupByName(queryRecordGroup, value, fetchId);
        }
    };

    handleDataGroupChange = (value) => {
        this.setState({
            dataGroupValue: value,
            dataGroupData: [],
            fetching: false,
        });
        let { onSearch } = this.props;
        if (onSearch) {
            onSearch({ dataGroup: value });
        }
    };

    async getDataGroupByName(queryRecordGroup, value, fetchId) {
        let result = await queryRecordGroup(value, 1, 500);
        if (result && result.success) {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            const dataGroupData = result.data.list.map((data) => ({
                text: `${data.name}`,
                value: data.name,
            }));
            this.setState({ dataGroupData, fetching: false });
        }
    }

    renderRecordDataLayout(
        formatMessage,
        getFieldDecorator,
        dataGroupData,
        dataGroupValue,
        fetching
    ) {
        return (
            <StandardForm>
                <FormItem label={formatMessage(locale.UserCenterDataGroup)}>
                    {getFieldDecorator('dataGroup')(
                        <Select
                            mode='multiple'
                            labelInValue
                            value={dataGroupValue}
                            placeholder={formatMessage(locale.UserCenterDataGroupTips)}
                            notFoundContent={fetching ? <Spin size='small' /> : null}
                            filterOption={false}
                            onSearch={this.fetchDataGroupSearch}
                            onChange={this.handleDataGroupChange}
                            style={{ width: '100%' }}>
                            {dataGroupData.map((d) => (
                                <Option key={d.value}>{d.text}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
            </StandardForm>
        );
    }

    render() {
        let {
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;
        let { fetching, dataGroupValue, dataGroupData } = this.state;
        let renderLayout = this.renderRecordDataLayout(
            formatMessage,
            getFieldDecorator,
            dataGroupData,
            dataGroupValue,
            fetching
        );
        return renderLayout;
    }
}
export default injectIntl(RecordDataSearchLayout);
