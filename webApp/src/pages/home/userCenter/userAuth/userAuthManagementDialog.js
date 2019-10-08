import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { locale, formatMessage } from '../../../locale';
import { connect } from 'react-redux';
import { systemAction } from '../../../../actions';
import InfoModal from '../../../../containers/infoModal';
import StandardForm from '../../../../components/standardForm';
import { toast } from '../../../../components/toast';
const FormItem = Form.Item;
import { isEmpty } from '../../../../utils/common';
import Select from '../../../../components/baseSelect';

@connect(
    (state) => ({
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        userAuthoritySet: (id, groupId, recordGroupIds) =>
            dispatch(systemAction.userAuthoritySet(id, groupId, recordGroupIds)),
    })
)
@Form.create()
class UserAuthManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
        };
    }

    static defaultProps = {};

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handlerAuth(values);
            }
        });
    };

    handlerAuth = async (values) => {
        this.setState({ confirmLoading: true });
        let {
            userInfo: { id },
            userAuthoritySet,
            onCancel,
            handlerRefreshClick,
        } = this.props;
        let { groupId, recordGroupIds } = values;
        let result = await userAuthoritySet(id, groupId, recordGroupIds.join(','));
        if (result && result.success) {
            onCancel();
            handlerRefreshClick();
            toast('success', formatMessage(locale.AuthorizeSuccess));
        }
        this.setState({ confirmLoading: false });
    };

    /**
     *授权管理页面
     * @param {*} selectedRows
     */
    getUserAuthManager() {
        let {
            form: { getFieldDecorator },
            userCenterState: { dataRecordSource, userGroupDataSource },
            userInfo: { userGroupIds, recordGroupIds },
        } = this.props;
        return (
            <StandardForm onSubmit={this.handleSubmit} vertical>
                <FormItem label={formatMessage(locale.Role)}>
                    {getFieldDecorator('groupId', {
                        initialValue: isEmpty(userGroupIds) ? undefined : Number(userGroupIds),
                        rules: [{ required: true, message: formatMessage(locale.RoleTips) }],
                    })(
                        <Select
                            data={
                                userGroupDataSource &&
                                userGroupDataSource.list &&
                                userGroupDataSource.list.length > 0
                                    ? userGroupDataSource.list.map((item) => ({
                                          name: item.name,
                                          value: item.id,
                                      }))
                                    : []
                            }
                            placeholder={formatMessage(locale.RoleTips)}
                            onChange={this.roleChange}
                        />
                    )}
                </FormItem>
                <FormItem label={formatMessage(locale.UserCenterDataGroup)}>
                    {getFieldDecorator('recordGroupIds', {
                        initialValue: isEmpty(recordGroupIds)
                            ? undefined
                            : recordGroupIds.split(',').map(Number),
                        rules: [
                            { required: true, message: formatMessage(locale.DataPermissionTips) },
                        ],
                    })(
                        <Select
                            data={
                                dataRecordSource &&
                                dataRecordSource.list &&
                                dataRecordSource.list.length > 0
                                    ? dataRecordSource.list.map((item) => ({
                                          name: item.name,
                                          value: item.id,
                                      }))
                                    : []
                            }
                            placeholder={formatMessage(locale.DataPermissionTips)}
                            onChange={this.roleChange}
                            mode='multiple'
                        />
                    )}
                </FormItem>
            </StandardForm>
        );
    }

    render() {
        let { confirmLoading } = this.state;
        let { visible, onCancel } = this.props;
        return (
            <div>
                <InfoModal
                    title={formatMessage(locale.MenuUserAuth)}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onOk={this.handleOk}
                    onCancel={() => onCancel()}>
                    {this.getUserAuthManager()}
                </InfoModal>
            </div>
        );
    }
}
export default UserAuthManagement;
