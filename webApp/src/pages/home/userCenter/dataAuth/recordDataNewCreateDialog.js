import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { locale } from '../../../../pages/locale';
import { connect } from 'react-redux';
import { systemAction } from '../../../../actions';
import ArchiveTree, {
    ARCHIVE_NODE_TYPE,
    ARCHIVE_TREE_TYPE,
} from '../../../../containers/archiveTree';
import InfoModal from '../../../../containers/infoModal';
import StandardForm from '../../../../components/standardForm';
import { toast } from '../../../../components/toast';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
import { injectIntl } from 'react-intl';
import { formItemTips, handleSpace } from '../../../../utils/dom';
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
        //获取用户数据权限列表
        getRecordGroup: (name, page, limit) =>
            dispatch(systemAction.getRecordGroup(name, page, limit)),
        //修改数据权限
        updateRecordGroup: (id, name, remark, strIds, strIdType) =>
            dispatch(systemAction.updateRecordGroup(id, name, remark, strIds, strIdType)),
        //新增用户数据权限
        addRecordGroup: (name, remark, strIds, strIdType) =>
            dispatch(systemAction.addRecordGroup(name, remark, strIds, strIdType)),
    })
)
@Form.create()
class NewCreateDialog extends PureComponent {
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
            userCheckedCompanyId: '',
            userGroupSelects: '',
            dataGroupSelects: '',
            company: '',
            inputType: 'password',
            passwordDisabled: false,
            isUserGroupChanged: false,
            userCompany: '',
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
        userCheckedCompanyId: '', // 用户选择的电力单位
        userGroupSelects: '', //用户选择的用户组
        dataGroupSelects: '', //用户选择的数据组
        company: '', //公司
        inputType: 'password', //输入框输入类型
        passwordDisabled: false, //用户管理——书否禁用密码输入框，默认false
        isUserGroupChanged: false, //用户组是否改变
        userCompany: '', //用户公司名
    };

    handleOk = () => {
        let { actionMenuType, dataInfo } = this.props;
        let { dataSubstationChecks, isUserGroupChanged } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = handleSpace(values);
                this.setState({ confirmLoading: true });
                console.log('Received values of form: ', values);
                this.setState({
                    ModalText: 'The modal will be closed after two seconds',
                    confirmLoading: true,
                });
                let id = dataInfo ? dataInfo.id : '';
                //数据权限管理参数
                const dataPermissionName = values.dataPermissionName;
                const dataType = 2;
                const dataRemark = values.dataRemark;
                if (!isUserGroupChanged) {
                    dataSubstationChecks = dataInfo.substationIds;
                }
                const dataPermissionQuery = {
                    id,
                    dataPermissionName,
                    dataType,
                    dataSubstationChecks,
                    dataRemark,
                };
                if (actionMenuType == 2) {
                    this.updataData(dataPermissionQuery);
                } else if (actionMenuType == 1) {
                    this.addDataPermissionAsync(dataPermissionQuery);
                }
            }
        });
    };

    /**
     * 添加成功后查询数据(数据权限)name,remark,strIds,strIdType
     */
    async addDataPermissionAsync(dataPermissionQuery) {
        let { dataSubstationChecks } = dataPermissionQuery;
        let {
            addRecordGroup,
            intl: { formatMessage },
            handlerRefreshCLick,
            onCancel,
        } = this.props;
        let strIds = '';
        if (dataSubstationChecks) {
            dataSubstationChecks.forEach((item) => {
                strIds += `${item.node.key},`;
            });
        }
        let result = await addRecordGroup(
            dataPermissionQuery.dataPermissionName,
            dataPermissionQuery.dataRemark,
            strIds,
            dataPermissionQuery.dataType
        );
        if (result.success) {
            toast('success', formatMessage(locale.NewCreateSuccess));
            handlerRefreshCLick();
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    }

    async updataData(dataPermissionQuery) {
        let {
            intl: { formatMessage },
            updateRecordGroup,
            handlerRefreshCLick,
            onCancel,
        } = this.props;
        let strIds = '';
        if (
            dataPermissionQuery.dataSubstationChecks &&
            Array.isArray(dataPermissionQuery.dataSubstationChecks) &&
            dataPermissionQuery.dataSubstationChecks.length > 0
        ) {
            if (dataPermissionQuery.dataSubstationChecks[0].key) {
                dataPermissionQuery.dataSubstationChecks.forEach((element) => {
                    strIds += `${element.key},`;
                });
            } else {
                dataPermissionQuery.dataSubstationChecks.forEach((item) => {
                    if (item.node && item.node.key) {
                        strIds += `${item.node.key},`;
                    }
                });
            }
        } else {
            strIds = dataPermissionQuery.dataSubstationChecks;
        }
        let result = await updateRecordGroup(
            dataPermissionQuery.id,
            dataPermissionQuery.dataPermissionName,
            dataPermissionQuery.dataRemark,
            strIds,
            dataPermissionQuery.dataType
        );
        if (result.success) {
            toast('success', formatMessage(locale.EditSuccess));
            handlerRefreshCLick();
            onCancel();
        }
        this.setState({
            confirmLoading: false,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        let { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    };
    _onSubstationSelect(value, node, extra) {
        if (extra.allCheckedNodes && extra.allCheckedNodes.length === 0) {
            this.props.form.setFieldsValue({ dataSubstationHidden: undefined });
        } else {
            this.props.form.setFieldsValue({ dataSubstationHidden: value });
        }
        this.setState({
            dataSubstationChecks: extra.allCheckedNodes,
            isUserGroupChanged: true,
        });
    }

    onDataDefValueSet = (substationIds) => {
        this.props.form.setFieldsValue({ dataSubstationHidden: substationIds });
    };

    /**
     *数据管理页面
     * @param {*} selectedRows
     */
    getUserDataManager(dataInfo) {
        let { getFieldDecorator } = this.props.form;
        let {
            intl: { formatMessage },
            actionMenuType,
        } = this.props;
        let { name, companyId, remark, substationIds, substationNames, getDataType = 2 } =
            dataInfo && 2 == actionMenuType ? dataInfo : {};
        let substationNamesList = [],
            substationIdsList = [];
        if (substationNames && substationNames.includes(',')) {
            substationNamesList = substationNames.split(',');
        } else {
            substationNamesList.push(substationNames);
        }
        if (substationIds && substationIds.includes(',')) {
            substationIdsList = substationIds.split(',');
        } else {
            substationIdsList.push(substationIds);
        }
        getDataType = getDataType == 2 ? formatMessage(locale.Substation) : '';
        return (
            <StandardForm onSubmit={this.handleSubmit} vertical>
                <FormItem label={formatMessage(locale.Name)}>
                    {formItemTips(
                        getFieldDecorator,
                        'dataPermissionName',
                        0,
                        100,
                        formatMessage,
                        locale,
                        { required: true, emptyHint: 'SubstationDataPermissionName' },
                        name
                    )(<Input placeholder={formatMessage(locale.SubstationDataPermissionName)} />)}
                </FormItem>
                <FormItem label={formatMessage(locale.DataType)}>
                    {getFieldDecorator('dataType', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.DataTypeTips),
                                initialValue: '',
                            },
                        ],
                        initialValue: getDataType,
                    })(
                        <Select>
                            <Option value='2'>{formatMessage(locale.Substation)}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.Data)}>
                    {getFieldDecorator('dataSubstationHidden', {
                        rules: [
                            {
                                required: true,
                                message: formatMessage(locale.DataPermissionTips),
                            },
                        ],
                    })(<Input type='hidden' />)}
                    {getFieldDecorator('dataSubstation', {
                        rules: [
                            {
                                required: false,
                                message: formatMessage(locale.DataPermissionTips),
                            },
                        ],
                        initialValue: companyId,
                    })(
                        <ArchiveTree
                            moduleId={'userCenterSubstation'}
                            moduleType={ARCHIVE_TREE_TYPE.SELECT_TREE}
                            rootParentNodeType={ARCHIVE_NODE_TYPE.COMPANY}
                            leafNodeType={ARCHIVE_NODE_TYPE.SUBSTATION}
                            onTreeSelect={this._onSubstationSelect.bind(this)}
                            placeholder={formatMessage(locale.DataPermissionTips)}
                            checkable
                            defValue={{
                                key: substationIds === undefined ? 1 : substationIdsList,
                                value:
                                    substationNamesList[0] === undefined ? '' : substationNamesList,
                            }}
                            onDefValueSet={this.onDataDefValueSet.bind(this, substationIds)}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.Remark)}>
                    {formItemTips(
                        getFieldDecorator,
                        'dataRemark',
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
            dataInfo,
            visible,
        } = this.props;
        let title;
        let ModalContent = this.getUserDataManager(dataInfo);
        if (actionMenuType == 2) {
            title = formatMessage(locale.UserCenterEditDataPermission);
        } else {
            title = formatMessage(locale.UserCenterNewDataPermission);
        }
        return (
            <div>
                <InfoModal
                    title={title}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    {ModalContent}
                </InfoModal>
            </div>
        );
    }
}
export default injectIntl(NewCreateDialog);
