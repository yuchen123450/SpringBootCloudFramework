import React, { PureComponent } from 'react';
import { Input, Form, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import { locale } from '../../../../pages/locale';
import { systemAction } from '../../../../actions';
import { injectIntl } from 'react-intl';
import StandardForm from '../../../../components/standardForm';
import { debounce } from '../../../../utils/common';
const FormItem = Form.Item;
const Option = Select.Option;
@connect(
    state => ({
        userCenterState: state.userCenterReducer,
    }),
    dispatch => ({
        //查询用户组
        searchUserGroup: (page, limit, name) => dispatch(systemAction.searchUserGroup(page, limit, name)),
        //获取用户数据权限列表
        queryRecordGroup: (name, page, limit) => dispatch(systemAction.queryRecordGroup(name, page, limit)),
    })
)
@Form.create()
class UserSearchLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUserGroupSearch = debounce(this.fetchUserGroupSearch, 500);
        let { intl: { formatMessage } } = this.props;
        this.state = {
            searchNameHint: formatMessage(locale.UserCenterUserNameHint),
            userGroupData: [],
            userGroupValue: [],
            fetching: false,
            dataGroupValue: [],
            dataGroupData: [],
            userSearchType: 0,//0 用户名 1 姓名
        };
    }

    static defaultProps = {
        searchNameHint: '',//查询名字提示文字
        userGroupData: [],//用户数据组
        userGroupValue: [],//用户组值
        fetching: false,
        dataGroupValue: [],//数据组值
        dataGroupData: [],//数据组
        userSearchType: 0,//0 用户名 1 姓名
    };

    onChange = (e) => {
        let  { value } = e.target;
        let { onSearch } = this.props;
        let { userSearchType } = this.state;
        if (userSearchType == 0) {
            if (onSearch) {
                onSearch({ userName: value });
            }
        } else {
            if (onSearch) {
                onSearch({ realName: value });
            }
        }
    }

    handleChange = (value, option) => {
        let { key } = option;
        let { intl: { formatMessage } } = this.props;
        let hintText = '';
        let userSearchType;
        switch (key) {
            case 'userName':
                hintText = formatMessage(locale.UserCenterUserNameHint);
                userSearchType = 0;
                break;
            case 'realName':
                hintText = formatMessage(locale.UserCenterRealNameTips);
                userSearchType = 1;
                break;
            default:
                break;
        }
        this.setState({
            searchNameHint: hintText,
            userSearchType,
        });
    }

    fetchUserGroupSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ userGroupData: [], fetching: true });
        let { searchUserGroup } = this.props;
        if (searchUserGroup) {
            this.getUserGroupByName(searchUserGroup, value, fetchId);
        }

    }

    async getUserGroupByName(searchUserGroup, value, fetchId) {
        let result = await searchUserGroup(1, 500, value);
        if (result && result.success) {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            const userGroupData = result.data.list.map(userGroup => ({
                text: `${userGroup.name}`,
                value: userGroup.name,
            }));
            this.setState({ userGroupData, fetching: false });
        }
    }

    handleUserGroupChange = (value) => {
        this.setState({
            userGroupValue: value,
            userGroupData: [],
            fetching: false,
        });
        let { onSearch } = this.props;
        if (onSearch) {
            onSearch({ userGroup: value });
        }
    }

    fetchDataGroupSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ userGroupData: [], fetching: true });
        let { queryRecordGroup } = this.props;
        if (queryRecordGroup) {
            this.getDataGroupByName(queryRecordGroup, value, fetchId);
        }
    }

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
    }

    async getDataGroupByName(queryRecordGroup, value, fetchId) {
        let result = await queryRecordGroup(value, 1, 500);
        if (result && result.success) {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            const dataGroupData = result.data.list.map(data => ({
                text: `${data.name}`,
                value: data.name,
            }));
            this.setState({ dataGroupData, fetching: false });
        }
    }

    renderUserLayout(formatMessage, getFieldDecorator, searchNameHint, fetching, userGroupData, userGroupValue, dataGroupValue, dataGroupData) {
		let { intl: { formatMessage } } = this.props;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: formatMessage(locale.UserName),
        })(
            <Select onChange={this.handleChange}>
                <Option value={formatMessage(locale.UserName)} key="userName">{formatMessage(locale.UserName)}</Option>
                <Option value={formatMessage(locale.RealName)} key="realName">{formatMessage(locale.RealName)}</Option>
            </Select>
        );
        return (
            <StandardForm style={{ paddingRight: 10 }} >
                <Form.Item label={formatMessage(locale.Name)} >
                    {getFieldDecorator('name', {
                        rules: [{ required: false, message: formatMessage(locale.UserName) }],
                    })(<Input addonBefore={prefixSelector} placeholder={searchNameHint} onChange={this.onChange} />)}
                </Form.Item>
                <FormItem label={formatMessage(locale.UserCenterUserGroup)}>
                    {getFieldDecorator('userGroup',{initialValue:userGroupValue})(
                        <Select
                            mode="multiple"
                            labelInValue
                          //  value={userGroupValue}
                            placeholder={formatMessage(locale.UserCenterUserGroupTips)}
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.fetchUserGroupSearch}
                            onChange={this.handleUserGroupChange}
                            style={{ width: '100%' }}
                        >
                            {userGroupData.map(d => <Option key={d.value}>{d.text}</Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.UserCenterDataGroup)}>
                    {getFieldDecorator('dataGroup',{initialValue:dataGroupValue})(
                        <Select
                            mode="multiple"
                            labelInValue
                           // value={dataGroupValue}
                            placeholder={formatMessage(locale.UserCenterDataGroupTips)}
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.fetchDataGroupSearch}
                            onChange={this.handleDataGroupChange}
                            style={{ width: '100%' }}
                        >
                            {dataGroupData.map(d => <Option key={d.value}>{d.text}</Option>)}
                        </Select>
                    )}
                </FormItem>
            </StandardForm>
        );
    }

    render() {
        let { getFieldDecorator } = this.props.form;
        let { intl: { formatMessage } } = this.props;
        let { searchNameHint, fetching, userGroupData, userGroupValue, dataGroupValue, dataGroupData } = this.state;
        let renderLayout = this.renderUserLayout(formatMessage, getFieldDecorator, searchNameHint, fetching, userGroupData, userGroupValue, dataGroupValue, dataGroupData);
        return (
            renderLayout
        );
    }
}
export default injectIntl(UserSearchLayout);
