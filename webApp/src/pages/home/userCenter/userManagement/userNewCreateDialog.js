import React, { PureComponent } from 'react';
import { Row, Form, Input, Button } from 'antd';
import { locale, formatMessage } from '../../../../pages/locale';
import { connect } from 'react-redux';
import { systemAction } from '../../../../actions';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import StandardForm from '../../../../components/standardForm';
import InfoModal from '../../../../containers/infoModal';
import { toast } from '../../../../components/toast';
import { injectIntl } from 'react-intl';
import { isEmpty } from '../../../../utils/common';
import { formItemTips, handleSpace } from '../../../../utils/dom';
import Select from '../../../../components/baseSelect';
import Enum from '../../../../utils/enum';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        //根据id获取数据信息
        getRecordGroupById: (id) => dispatch(systemAction.getRecordGroupById(id)),
        //根据电力单位获取数据权限
        getRecordInfoByCompanyId: (companyId) =>
            dispatch(systemAction.getRecordInfoByCompanyId(companyId)),
        //根据电力单位获取用户组
        getUserGroupByCompany: (companyId) =>
            dispatch(systemAction.getUserGroupByCompany(companyId)),
        //获取用户信息
        getUserInfo: (name, mobile, department, position, companyId, page, limit) =>
            dispatch(
                systemAction.getUserInfo(
                    name,
                    mobile,
                    department,
                    position,
                    companyId,

                    page,
                    limit
                )
            ),
        //更新用户信息
        updateUserInfo: (
            id,
            staffId,
            name,
            mobile,
            email,
            companyId,
            company,
            department,
            position,
            remark,
            nickName,
            avatar,
            groupId,
            groupCode
        ) =>
            dispatch(
                systemAction.updateUserInfo(
                    id,
                    staffId,
                    name,
                    mobile,
                    email,
                    companyId,
                    company,
                    department,
                    position,
                    remark,
                    nickName,
                    avatar,
                    groupId,
                    groupCode
                )
            ),
        //新增用户
        addUserInfo: (
            staffId,
            name,
            password,
            mobile,
            email,
            companyId,
            company,
            department,
            position,
            remark,
            nickName,
            avatar,
            groupCode,
            groupId
        ) =>
            dispatch(
                systemAction.addUserInfo(
                    staffId,
                    name,
                    password,
                    mobile,
                    email,
                    companyId,
                    company,
                    department,
                    position,
                    remark,
                    nickName,
                    avatar,
                    groupCode,
                    groupId
                )
            ),
        getUserDefaultRoles: (companyId, isDefault) =>
            dispatch(systemAction.getUserDefaultRoles(companyId, isDefault)),
    })
)
@Form.create()
class UserNewCreateDialog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'Content of the modal',
            confirmLoading: false,
            actionMenuType: this.props.actionMenuType,
            selectedRows: this.props.selectedRows,
            selectMenuShow: false,
            actionResult: [],
            allCheckedNodes: [],
            dataSubstationChecks: '',
            companyId: '',
            userGroupSelects: '',
            dataGroupSelects: '',
            company: '',
            inputType: 'password',
            passwordDisabled: false,
            userCompany: '',
            size: 'default',
            selectID: 0,
            groupId: '',
        };
    }

    static defaultProps = {
        type: 1, //操作类型
        loading: false, //是否在加载中
        actionMenuType: 1, //操作按钮type 1 新增 2 编辑 3 删除 4 刷新
        selectedRows: [], // 表格选择的行内容
        selectMenuShow: false, // 是否显示增删改刷操作按钮组件
        actionResult: [], // action请求结果
        allCheckedNodes: [], //用户组所有选择的菜单信息
        dataSubstationChecks: '', // 数据管理选择的变电站信息
        companyId: '', // 用户选择的电力单位
        userGroupSelects: '', //用户选择的用户组
        dataGroupSelects: '', //用户选择的数据组
        company: '', //公司
        inputType: 'password', //输入框输入类型
        passwordDisabled: false, //用户管理——书否禁用密码输入框，默认false
        // isUserGroupChanged: false,//用户组是否改变
        userCompany: '', //用户公司名
        // isDataGroupChanged: false,//数据组是否改变
        size: 'default', //默认大小（数据组和用户组选择框）
        selectID: 0,
    };

    /**
     * 点击确定按钮操作
     */
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                console.log('Received values of form: ', values);
                this.addOrUpdateUser(values);
            }
        });
    };

    /**
     * 更新或者添加用户
     */
    addOrUpdateUser = async (values) => {
        this.setState({ confirmLoading: true });
        let { companyId, company, groupId } = this.state;
        let {
            addUserInfo,
            handlerRefreshCLick,
            onCancel,
            showSystemPassword,
            actionMenuType,
            updateUserInfo,
            userInfo,
        } = this.props;
        let {
            staffId,
            name,
            password,
            department,
            nickName,
            mobile,
            position,
            remark,
            email,
            groupCode = '',
        } = values ? values : {};
        let result =
            actionMenuType === 1
                ? await addUserInfo(
                      staffId,
                      name,
                      password,
                      mobile,
                      email,
                      companyId,
                      company,
                      department,
                      position,
                      remark,
                      nickName,
                      '',
                      groupCode,
                      groupId
                  )
                : await updateUserInfo(
                      userInfo.id,
                      staffId,
                      name,
                      mobile,
                      email,
                      companyId,
                      company,
                      department,
                      position,
                      remark,
                      nickName,
                      '',
                      groupId,
                      groupCode
                  );
        if (result.success) {
            handlerRefreshCLick();
            actionMenuType === 2
                ? toast('success', formatMessage(locale.EditSuccess))
                : showSystemPassword(result.data, '');
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    };

    /**
     * 选择用户公司操作
     */
    onCompanySelect = (value, node, extra) => {
        if (!isEmpty(node.key)) {
            let { company } = this.state;
            let { getUserDefaultRoles } = this.props;
            if (company != node.title) {
                this.props.form.setFieldsValue({ hidden: value });
                this.props.form.setFieldsValue({ userGroup: [], dataGroup: [] });
                this.setState(
                    {
                        companyId: node.key,
                        company: node.title,
                    },
                    () => {
                        getUserDefaultRoles(node.key, 1);
                        this.props.form.setFieldsValue({ groupCode: undefined });
                    }
                );
            }
        }
    };

    /**
     * 编辑时设置用户的默认公司
     */
    userCompanyDefValueSet = (userCompanyId, userCompany) => {
        let { userInfo, actionMenuType, getUserDefaultRoles } = this.props;
        this.setState(
            {
                companyId: userCompanyId,
                company: userCompany,
                groupId:
                    actionMenuType === 2
                        ? userInfo && userInfo.userGroupIds
                            ? userInfo.userGroupIds
                            : ''
                        : '',
            },
            async () => {
                getUserDefaultRoles(userCompanyId, 1);
            }
        );
        this.props.form.setFieldsValue({ hidden: userCompanyId });
    };

    roleChange = (roleName) => {
        let {
            userCenterState: { useDefaultRoles },
        } = this.props;
        let role = useDefaultRoles.find((ele) => ele.groupCode == roleName);
        if (undefined !== role) {
            this.setState({
                groupId: role.id,
            });
        }
    };

    handlerRole = (useDefaultRoles = [], companyId) => {
        let result = [];
        if (useDefaultRoles && useDefaultRoles.length > 0) {
            useDefaultRoles.map((item) => {
                result.push({
                    id: item.id,
                    name: item.name,
                    value: `${item.groupCode}`,
                });
            });
            let { userInfo } = this.props;
            if (companyId == this.state.companyId && userInfo && !this.isDefaultUser(userInfo)) {
                result.push({
                    id: userInfo.userGroupIds,
                    name: userInfo.userGroupNames,
                    value: userInfo.groupCodes, //userGroupIds
                });
            }
        }
        return result;
    };

    isDefaultUser = (userInfo) => {
        let { groupCodes = '' } = userInfo;
        return (
            groupCodes == 10000 || groupCodes == 10001 || groupCodes == 10002 || groupCodes == 10003
        );
    };

    /**
     * 用户管理页面
     * @param {} selectedRows
     */
    getUserManager(userInfo) {
        let {
            actionMenuType,
            form: { getFieldDecorator },
            userCenterState: { useDefaultRoles },
        } = this.props;
        let {
            name,
            position,
            mobile,
            email,
            companyId,
            company,
            department,
            remark,
            staffId,
            nickName,
            id,
            groupCodes = '',
        } = actionMenuType === 2 && userInfo ? userInfo : {};
        useDefaultRoles = this.handlerRole(useDefaultRoles, companyId);
        return (
            <StandardForm onSubmit={this.handleSubmit} vertical primary={[0, 1, 2, 3, 4]}>
                <FormItem label={formatMessage(locale.UserName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'name',
                        2,
                        64,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'UserCenterUserNameHint' },
                        name,
                        'userName',
                        formatMessage(locale.UserNameCheckTips),
                        true
                    )(<Input placeholder={formatMessage(locale.UserCenterUserNameHint)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.Email)}>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                required: true,
                                type: 'email',
                                message: formatMessage(locale.EmailErrorTips),
                            },
                        ],
                        initialValue: email,
                    })(<Input placeholder={formatMessage(locale.UserCenterEmailHint)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.ElectricPowerCompany)}>
                    {getFieldDecorator('hidden', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.ElectricPowerCompanyTips),
                            },
                        ],
                    })(<Input type='hidden' />)}
                    <ArchiveTree
                        moduleId={'userCenterCompany'}
                        moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                        rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        leafNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                        onTreeSelect={this.onCompanySelect.bind(this)}
                        onDefValueSet={this.userCompanyDefValueSet.bind(this, companyId, company)}
                        defValue={{
                            key: id,
                            value: company,
                        }}
                    />
                </FormItem>
                <FormItem label={formatMessage(locale.Role)}>
                    {getFieldDecorator('groupCode', {
                        initialValue:
                            useDefaultRoles.find((ele) => ele.value == groupCodes) === undefined
                                ? undefined
                                : groupCodes,
                        rules: [{ required: true, message: formatMessage(locale.RoleTips) }],
                    })(
                        <Select
                            data={useDefaultRoles}
                            placeholder={formatMessage(locale.RoleTips)}
                            onChange={this.roleChange}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.PhoneNum)}>
                    {formItemTips(
                        getFieldDecorator,
                        'mobile',
                        0,
                        20,
                        formatMessage,
                        locale,
                        false,
                        mobile,
                        'phoneNumber',
                        formatMessage(locale.PhoneCheckTips)
                    )(<Input placeholder={formatMessage(locale.UserCenterPhoneNumberHint)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.Depart)}>
                    {formItemTips(
                        getFieldDecorator,
                        'department',
                        0,
                        64,
                        formatMessage,
                        locale,
                        false,
                        department
                    )(<Input placeholder={formatMessage(locale.UserCenteDepHint)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.PersonNum)}>
                    {formItemTips(
                        getFieldDecorator,
                        'staffId',
                        0,
                        64,
                        formatMessage,
                        locale,
                        false,
                        staffId
                    )(<Input placeholder={formatMessage(locale.UserCenterUserNumHint)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.RealName)}>
                    {formItemTips(
                        getFieldDecorator,
                        'nickName',
                        2,
                        64,
                        formatMessage,
                        locale,
                        false,
                        nickName,
                        'userName',
                        formatMessage(locale.UserNameCheckTips),
                        true
                    )(<Input placeholder={formatMessage(locale.UserCenterUserRealNameHint)} />)}
                </FormItem>

                <FormItem label={formatMessage(locale.JobPosition)}>
                    {formItemTips(
                        getFieldDecorator,
                        'position',
                        0,
                        64,
                        formatMessage,
                        locale,
                        false,
                        position
                    )(<Input placeholder={formatMessage(locale.UserCenterPositionHint)} />)}
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
        let { actionMenuType, userInfo, visible, onCancel } = this.props;
        let title;
        let okHandle = {};
        if (actionMenuType == 2) {
            title = formatMessage(locale.UserCenterEditUserManager);
            okHandle = {
                onOk: this.handleOk,
            };
        } else {
            title = formatMessage(locale.UserCenterNewUsermanager);
            okHandle = {
                onOkGo: this.handleOk,
            };
        }
        return (
            <InfoModal
                title={title}
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={() => {
                    onCancel();
                }}
                {...okHandle}>
                {this.getUserManager(userInfo)}
            </InfoModal>
        );
    }
}
export default injectIntl(UserNewCreateDialog);
