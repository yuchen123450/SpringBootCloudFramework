import React, { Component } from 'react';
import { Row, Modal, Empty } from 'antd';
import { connect } from 'react-redux';
import Loading from '../../../../../components/loading';
import { isEmpty } from '../../../../../utils/common';
import { statisticsAction } from '../../../../../actions';
import SubStationDataDetail from '../../substationDataDetail';

@connect(
    (state) => ({
        substationDataDetailState: state.substationDataDetailReducer,
    }),
    (dispatch) => ({
        getSsdDeviceStatus: (substationId, page, limit) =>
            dispatch(statisticsAction.getSsdDeviceStatus(substationId, page, limit)),
        clearSubstationDataDetail: (type) =>
            dispatch(statisticsAction.clearSubstationDataDetail(type)),
    })
)
class MapDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noDataImg: require('../../../../../../assets/images/nodata.png'),
            loading: false,
        };
    }

    static defaultProps = {
        showFocus: false,
        visible: false,
    };
    componentDidMount = async () => {
        let { stationId, substation, getSsdDeviceStatus } = this.props;
        // if (!substation.pmapUrl) {
        // 	ssdDataList(stationId);
        // }
        this.setState({
            loading: true,
        });
        let res = await getSsdDeviceStatus(stationId);
        this.setState({
            loading: false,
        });
    };

    handleClose() {
        let { hideModal, clearSubstationDataDetail } = this.props;
        hideModal();
        clearSubstationDataDetail('substationDataDetail');
    }

    renderStationDataDetail(data) {
        let content = '';
        if (!isEmpty(data.list)) {
            let { substation } = this.props;
            content = <SubStationDataDetail substation={substation} data={data} />;
        } else {
            let { noDataImg } = this.state;
            content = <Empty key={`empty${0}`} image={noDataImg} className='noDataImg' />;
        }
        return content;
    }

    render() {
        let {
            showFocus,
            visible,
            substationDataDetailState: { ssdDeviceStatusList },
        } = this.props;
        let { loading } = this.state;
        return (
            <Modal
                visible={visible}
                onOk={this.handleClose.bind(this)}
                onCancel={this.handleClose.bind(this)}
                destroyOnClose={true}
                centered={true}
                width='100%'
                style={{ height: '100%', padding: 0 }}
                bodyStyle={{ height: '100%', padding: 0 }}
                footer={false}>
                {showFocus ? <div className='modalContent' /> : null}

                <Row type='flex' justify='space-around' align='top' style={{ height: '100%' }}>
                    {loading ? <Loading /> : this.renderStationDataDetail(ssdDeviceStatusList)}
                </Row>
            </Modal>
        );
    }
}
export default MapDetail;
