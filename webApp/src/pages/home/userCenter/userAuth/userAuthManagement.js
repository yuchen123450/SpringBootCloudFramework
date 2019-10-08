import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Button, Modal, Spin } from 'antd';
import { locale, formatMessage } from '../../../../pages/locale';
import { toast } from '../../../../components/toast';
import { connect } from 'react-redux';
import { systemAction } from '../../../../actions';
import { injectIntl } from 'react-intl';
import { isEmpty, deepClone } from '../../../../utils/common';
import StandardForm from '../../../../components/standardForm';
import CheckBoxGroup from '../../../../components/checkboxGroup';
import { CHECKBOX_GROUP_TYPE } from '../../../../components/checkboxGroup';
import BaseCardInfo from '../../../../components/baseInfoCard';
import Scrollbar from '../../../../components/baseScroll';
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
        companyInfoState: state.companyReducer,
    }),
    (dispatch) => ({
        //获取用户组权限列表
        getUserGroup: (page, limit, name) => dispatch(systemAction.getUserGroup(page, limit, name)),
        //获取用户数据权限列表
        getRecordGroup: (name, companyId, recordGroupType, page, limit) =>
            dispatch(systemAction.getRecordGroup(name, companyId, recordGroupType, page, limit)),
        userAuthoritySet: (id, groupId, recordGroupIds) =>
            dispatch(systemAction.userAuthoritySet(id, groupId, recordGroupIds)),
    })
)
@Form.create()
class UserAuthManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            callBackData: [],
            checkBoxType: CHECKBOX_GROUP_TYPE.NORMAL,
            rolesData: [],
            dataGroup: [],
            selectRole: '',
            loading: true,
            refresh: 0,
            selectRecordGroupIds: [],
            refresh: 0,
            originDataGroup: [],
        };
        this.loadingTimeOutEvent = '';
    }

    static defaultProps = {};

    async componentDidMount() {
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

    changeLocale = () => {
        let { rolesData, dataGroup } = this.state;
        if (Array.isArray(rolesData) && rolesData[0] && rolesData[0].title) {
            rolesData[0].title = formatMessage(locale.RoleSetting);
        }
        if (Array.isArray(dataGroup)) {
            dataGroup[0].title = formatMessage(locale.DataVisibilityRangeSetting);
        }
        this.setState({ rolesData, dataGroup, refresh: new Date().getTime() });
    };

    handlerDefSelect = () => {
        let {
            actionMenuType,
            userInfo: { recordGroupIds, userGroupIds },
        } = this.props;
        let { rolesData, originDataGroup } = this.state;
        let result = deepClone(originDataGroup);
        let selectRecordGroupIds = [];
        result = this.handlerSelectDataGroup(result, recordGroupIds, selectRecordGroupIds);
        if (!isEmpty(rolesData)) {
            rolesData.map((item) => {
                item.children.map((item) => {
                    item.disabled = actionMenuType === 3;
                });
            });
        }
        this.setState({
            dataGroup: result,
            rolesData,
            selectRole: userGroupIds,
            refresh: new Date().getTime(),
            selectRecordGroupIds,
        });
    };

    handlerSelectDataGroup = (result, recordGroupIds, selectRecordGroupIds) => {
        let { actionMenuType } = this.props;
        if (!isEmpty(result)) {
            selectRecordGroupIds =
                recordGroupIds && !isEmpty(recordGroupIds) && recordGroupIds.includes(',')
                    ? recordGroupIds.split(',')
                    : [recordGroupIds];
            result.map((item) => {
                if (item && item.children && Array.isArray(item.children)) {
                    item.children.map((dataGroupItem) => {
                        let find = selectRecordGroupIds.find((ele) => ele == dataGroupItem.id);
                        dataGroupItem.checked = undefined !== find;
                        dataGroupItem.disabled = actionMenuType === 3;
                    });
                }
            });
        }
        return result;
    };

    getInitData = async () => {
        this.getRoles();
        this.getDataGroups();
    };

    getRoles = async () => {
        let { getUserGroup } = this.props;
        let result = await getUserGroup(1, 10000, '');
        let roles = this.initCheckGroupData(result, formatMessage(locale.RoleSetting));
        this.setState({ rolesData: roles }, () => {
            this.handlerDefSelect();
        });
    };

    initCheckGroupData = (result, title) => {
        let data = [
            {
                id: -1,
                title,
                value: -1,
                children: [],
            },
        ];
        if (
            result &&
            result.success &&
            result.data.list &&
            result.data.list.length &&
            result.data.list.length > 0
        ) {
            result.data.list.forEach((element) => {
                data[0].children.push({
                    id: element.id,
                    title: element.name,
                    value: element.id,
                    checked: false,
                    disabled: false,
                    children: [],
                });
            });
        }
        return data;
    };

    getDataGroups = async () => {
        let { getRecordGroup } = this.props;
        let result = await getRecordGroup('', '', '', 1, 10000);
        let dataGroup = this.initCheckGroupData(
            result,
            formatMessage(locale.DataVisibilityRangeSetting)
        );
        this.setState({ dataGroup, originDataGroup: dataGroup }, () => {
            this.handlerDefSelect();
        });
    };

    handlerCallBack = (multipleData) => {
        this.setState({ callBackData: multipleData });
    };

    handlerUserAuth = () => {
        let {
            handlerRefreshClick,
            form: { validateFields },
            userInfo,
            userAuthoritySet,
        } = this.props;
        validateFields((err) => {
            if (!err) {
                let convertResult = [];
                let jumpOver = false;
                debugger;
                let { callBackData, selectRole } = this.state;
                let {
                    userInfo: { recordGroupIds },
                } = this.props;
                if (isEmpty(callBackData) && isEmpty(selectRole)) {
                    if (this.handlerEmpty(selectRole, recordGroupIds)) {
                        return;
                    }
                    jumpOver = true;
                } else {
                    convertResult = this.convertSelectData(callBackData);
                    if (this.handlerEmpty(selectRole, convertResult)) {
                        return;
                    }
                }
                Modal.confirm({
                    title: formatMessage(locale.SaveConfirmation),
                    content: formatMessage(locale.SaveConfirmationContent),
                    onOk: async () => {
                        let result = !jumpOver
                            ? await userAuthoritySet(
                                  userInfo.id,
                                  selectRole,
                                  isEmpty(callBackData) && isEmpty(selectRole)
                                      ? recordGroupIds
                                      : convertResult.join(',')
                              )
                            : 1;
                        if (result.success || result === 1) {
                            toast('success', formatMessage(locale.AuthorizeSuccess));
                            handlerRefreshClick();
                        }
                    },
                });
            }
        });
    };

    handlerEmpty = (selectRole) => {
        if (isEmpty(selectRole)) {
            toast('warn', formatMessage(locale.RoleSelectTips));
            return true;
        }
    };

    convertSelectData = (callBackData) => {
        let result = [];
        if (
            callBackData &&
            callBackData[0] &&
            callBackData[0].children &&
            Array.isArray(callBackData[0].children)
        ) {
            callBackData[0].children.forEach((item) => {
                if (item.checked) {
                    result.push(item.id);
                }
            });
        } else {
            result = this.state.selectRecordGroupIds;
        }
        return result;
    };

    handlerReset = () => {
        let { originDataGroup } = this.state;
        let result = deepClone(originDataGroup);
        let {
            userInfo: { recordGroupIds, userGroupIds },
        } = this.props;
        result = this.handlerSelectDataGroup(result, recordGroupIds, []);
        this.setState({
            dataGroup: result,
            selectRole: userGroupIds,
            refresh: new Date().getTime(),
        });
    };

    handlerRadioCallBack = (selectValue) => {
        this.setState({
            selectRole: selectValue,
        });
    };

    render() {
        let { userInfo, actionMenuType } = this.props;
        let { rolesData, dataGroup, selectRole } = this.state;
        return (
            <Scrollbar>
                <Card
                    title={formatMessage(locale.AuthorizationSettings)}
                    className='page-layout-content-card'
                    bordered={false}
                    extra={
                        <Row gutter={12} type='flex' justify='end' align='middle'>
                            <Col>
                                <Button
                                    disabled={actionMenuType ? actionMenuType === 3 : false}
                                    onClick={this.handlerReset}>
                                    {formatMessage(locale['Reset'])}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    disabled={actionMenuType ? actionMenuType === 3 : false}
                                    type='primary'
                                    onClick={this.handlerUserAuth}>
                                    {formatMessage(locale.Save)}
                                </Button>
                            </Col>
                        </Row>
                    }>
                    <Spin spinning={this.state.loading}>
                        <BaseCardInfo title={formatMessage(locale.UserInfo)}>
                            <StandardForm label>
                                <Form.Item label={formatMessage(locale.UserName)}>
                                    <span className='ant-form-text'>{userInfo.name}</span>
                                </Form.Item>
                                <Form.Item label={formatMessage(locale.Email)}>
                                    <span className='ant-form-text'>{userInfo.email}</span>
                                </Form.Item>
                                <Form.Item label={formatMessage(locale.PhoneNum)}>
                                    <span className='ant-form-text'>{userInfo.mobile}</span>
                                </Form.Item>
                                <Form.Item label={formatMessage(locale.Company)}>
                                    <span className='ant-form-text'>{userInfo.company}</span>
                                </Form.Item>
                                <Form.Item label={formatMessage(locale.Depart)}>
                                    <span className='ant-form-text'>{userInfo.department}</span>
                                </Form.Item>
                                <Form.Item label={formatMessage(locale.JobPosition)}>
                                    <span className='ant-form-text'>{userInfo.position}</span>
                                </Form.Item>
                            </StandardForm>
                        </BaseCardInfo>
                        <CheckBoxGroup
                            type={CHECKBOX_GROUP_TYPE.TITLE_WITH_RADIO_CHECK}
                            data={rolesData}
                            selected={selectRole}
                            handlerCallBack={this.handlerRadioCallBack}
                        />
                        <CheckBoxGroup
                            type={CHECKBOX_GROUP_TYPE.TITLE_WITH_CHECKBOX}
                            data={dataGroup}
                            handlerCallBack={this.handlerCallBack}
                        />
                    </Spin>
                </Card>
            </Scrollbar>
        );
    }
}
export default injectIntl(UserAuthManagement);
