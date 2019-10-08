import React, { Component, Fragment } from 'react';
import { Layout, Row, Col, Tooltip, Icon, Button as AntdButton } from 'antd';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { locale, formatMessage } from '../../../pages/locale';
import Loading from '../../../components/loading';
import { CONFIG } from '../../../configs';
import { isEmpty } from '../../../utils/common';
import { setFullScreen } from '../../../utils/dom';
import LCDComponent from '../../../components/statistical/LCD';
import BaseSelect from '../../../components/statistical/baseSelect';
import SelectLang from '../../../containers/header/selectLang';
import { commonAction, archiveAction, systemAction } from '../../../actions';
import eventProxy from '../../../utils/eventProxy';
import { authComponent } from '../../../components/authComponent';

const Button = authComponent(AntdButton);
@connect(
    (state) => ({
        companyInfoState: state.companyReducer,
        substationInfoState: state.substationReducer,
    }),
    (dispatch) => ({
        changLang: (langType) => dispatch(commonAction.changLang(langType)),
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
            ),
        //获取用户的菜单
        getUserMenus: () => dispatch(systemAction.getUserMenus()),
    })
)
class Dashborad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fullscreen: false,
            activeKey: 'main',
            showCompanySelectKeys: [
                'substation/dataStatistics',
                'substation/wiringDiagram',
                'substation/threeDModel',
                'detectionTask/dataDetail',
                'detectionTask/reportManager',
                'smartMonitor',
            ],
            companyName: '',
            companyId: '',
            menu: [],
            refreshPage: false,
            substation: {},
        };
        this.hasActiveContent = {};
    }

    componentDidMount = async () => {
        this.refreshMenus();
        // 模拟获取数据
        window.setTimeout(() => {
            if (this.currentTime) {
                this.currentTime.changeContent(moment().format('YYYY-MM-DD HH:mm:ss'));
            }
        }, 1000);

        //获取公司列表
        await this.getCompanyInfo();
        this.receiveEvent();
    };

    receiveEvent = () => {
        eventProxy.on('changeMenuAction', (companyId, substation, companyName, activeKey) => {
            this.setState(
                {
                    companyName,
                    companyId,
                    substation: substation,
                    activeKey: isEmpty(activeKey) ? this.state.activeKey : activeKey,
                    refreshPage: true,
                },
                () => {
                    this.getSubstationInfo(companyId, companyName);
                }
            );
        });
        eventProxy.on('refreshMenus', () => {
            this.refreshMenus();
        });
    };

    refreshMenus = async () => {
        let { getUserMenus } = this.props;
        let getUserMenusResult = await getUserMenus();
        if (getUserMenusResult.success && getUserMenusResult.data) {
            let statisticsMenuList = getUserMenusResult.data[0].children;
            if (!isEmpty(statisticsMenuList)) {
                statisticsMenuList.map((item) => {
                    let keyStr = item.key;
                    item.key = keyStr.substring(keyStr.lastIndexOf('/') + 1, keyStr.length);
                    if (item.key == 'substation') {
                        item.children = [
                            {
                                id: null,
                                key: 'substation/dataStatistics',
                                name: 'AGYDataStatistics',
                                icon: 'dashboard.svg',
                                visible: true,
                                children: null,
                            },
                            {
                                id: null,
                                auth: 'SubstationWiringDiagram',
                                key: 'substation/wiringDiagram',
                                name: 'SubstationWiringDiagram',
                                icon: 'dashboard.svg',
                                visible: true,
                                children: null,
                            },
                            // {
                            // 	id: null,
                            // 	key: 'substation/threeDModel',
                            // 	name: 'ThreeDModel',
                            // 	icon: 'dashboard.svg',
                            // 	visible: true,
                            // 	children: null,
                            // },
                        ];
                    } else if (item.key == 'detectionTask') {
                        item.children = [
                            {
                                id: null,
                                key: 'detectionTask/dataDetail',
                                name: 'DataDetails',
                                icon: 'dashboard.svg',
                                visible: true,
                                children: null,
                            },
                            {
                                id: null,
                                auth: 'StatisticsTaskReportManager',
                                key: 'detectionTask/reportManager',
                                name: 'MenuReportManager',
                                icon: 'dashboard.svg',
                                visible: true,
                                children: null,
                            },
                        ];
                    } else {
                        item.children = null;
                    }
                });
                this.setState({
                    menu: statisticsMenuList,
                });
            }
        }
    };

    getCompanyInfo = async () => {
        let { getCompanyInfo } = this.props;
        let result = await getCompanyInfo('', '', '', -1, -1, '', 1, 10000);
        if (
            result &&
            result.success &&
            result.data &&
            result.data.list &&
            result.data.list.length > 0
        ) {
            let cId = result.data.list[0].id;
            let cName = result.data.list[0].company;
            this.setState({
                companyName: cName,
                companyId: cId,
                loading: false,
            });
            this.getSubstationInfo(cId, cName);
        } else {
            this.setState({
                loading: false,
            });
        }
    };

    getSubstationInfo = async (cId, cName) => {
        let { getSubstationInfo } = this.props;
        let res = await getSubstationInfo(cId, cName, '', '', '', '', '', 1, 10000);
        if (res && res.success && res.data && res.data.list && res.data.list.length > 0) {
            this.setState({
                substation: res.data.list[0],
            });
        } else {
            this.setState({
                substation: {},
            });
        }
    };

    componentWillUnmount() {
        eventProxy.off('changeMenuAction');
    }

    changeCompany = (companyId, item) => {
        let {
            ref: { name },
        } = item;
        this.setState(
            {
                companyId,
                companyName: name,
                refreshPage: true,
            },
            () => {
                this.getSubstationInfo(companyId, name);
            }
        );
    };

    changeSubstation = (substationId, item) => {
        let {
            ref: { name },
        } = item;
        let {
            substationInfoState: { substationDataSource },
        } = this.props;
        let substation = {};
        if (isEmpty(substationDataSource)) {
            substation = {
                substationId,
                substationName: name,
            };
        } else {
            substation = substationDataSource.list.filter(
                (station) => station.substationId == substationId
            )[0];
        }
        this.setState({
            substation: substation,
        });
    };

    renderHeader = () => {
        const {
            fullscreen,
            activeKey,
            menu,
            showCompanySelectKeys,
            companyName,
            substation,
        } = this.state;
        let menu1EL = [],
            menu2EL = [];
        let {
            companyInfoState: { dataSource },
            substationInfoState: { substationDataSource },
        } = this.props;
        menu1EL = menu.map((item) => {
            if (item.visible) {
                if (activeKey.indexOf(item.key) > -1) {
                    if (isEmpty(item.children) === false) {
                        menu2EL = item.children.map((item1) => {
                            if (item1.visible) {
                                if (activeKey === item1.key) {
                                    return (
                                        <Button
                                            auth={item1.auth}
                                            key={item1.key}
                                            className='selected'>
                                            <div className='focus'>
                                                <span />
                                                <span />
                                            </div>
                                            {formatMessage(locale[item1.name])}
                                        </Button>
                                    );
                                } else {
                                    return (
                                        <Button
                                            auth={item1.auth}
                                            key={item1.key}
                                            onClick={() => {
                                                this.setState({ activeKey: item1.key });
                                            }}>
                                            {formatMessage(locale[item1.name])}
                                        </Button>
                                    );
                                }
                            }
                        });
                    }
                    return (
                        <Button key={item.key} className='selected'>
                            {formatMessage(locale[item.name])}
                        </Button>
                    );
                } else {
                    return (
                        <Button
                            key={item.key}
                            onClick={() => {
                                if (isEmpty(item.children)) {
                                    this.setState({ activeKey: item.key });
                                } else {
                                    this.setState({ activeKey: item.children[0].key });
                                }
                            }}>
                            {formatMessage(locale[item.name])}
                        </Button>
                    );
                }
            }
        });
        return (
            <Fragment>
                <Row className='top'>
                    <Col className='system'>
                        <img className='logo' src={CONFIG.website.logo} />
                        <div className='name'>{CONFIG.website.title}</div>
                    </Col>
                    <Col className='menu-1'>
                        <div className='menu-1-btn'>{menu1EL}</div>
                    </Col>
                    <Col className='tool'>
                        <LCDComponent
                            ref={(currentTime) => (this.currentTime = currentTime)}
                            size='small'
                            color='#73D1EB'
                        />
                        <SelectLang
                            chang={(type) => {
                                let { changLang } = this.props;
                                changLang(type);
                            }}
                        />
                        <a
                            onClick={() => {
                                setFullScreen((screenState) => {
                                    this.setState({
                                        fullscreen: screenState,
                                    });
                                });
                            }}>
                            <Tooltip
                                title={
                                    fullscreen
                                        ? formatMessage(locale.ExitFullScreen)
                                        : formatMessage(locale.FullScreen)
                                }>
                                <Icon type={fullscreen ? 'fullscreen-exit' : 'fullscreen'} />
                            </Tooltip>
                        </a>
                        <a
                            onClick={() => {
                                window.location.href = './home.html';
                            }}>
                            <Tooltip title={formatMessage(locale.EnterBusinessSystem)}>
                                <Icon type='right-circle' />
                            </Tooltip>
                        </a>
                    </Col>
                </Row>
                <Row className='bottom'>
                    <Col className='menu-2'>
                        <div className='menu-2-btn'>{menu2EL}</div>
                    </Col>
                    <Col
                        className='select'
                        style={{
                            display: showCompanySelectKeys.includes(activeKey) ? 'block' : 'none',
                            marginRight: '0.5rem',
                        }}>
                        <div className='focus'>
                            <span />
                            <span />
                        </div>
                        <BaseSelect
                            className='statistical-select'
                            value={companyName}
                            allowClear={false}
                            data={
                                dataSource && dataSource.list && dataSource.list.length > 0
                                    ? dataSource.list.map((item) => ({
                                          name: item.company,
                                          value: item.id,
                                      }))
                                    : []
                            }
                            onChange={this.changeCompany}
                        />
                    </Col>
                    <Col
                        className='select'
                        style={{
                            display: showCompanySelectKeys.includes(activeKey) ? 'block' : 'none',
                        }}>
                        <div className='focus'>
                            <span />
                            <span />
                        </div>
                        <BaseSelect
                            className='statistical-select'
                            value={substation.substationName}
                            allowClear={false}
                            data={
                                substationDataSource &&
                                substationDataSource.list &&
                                substationDataSource.list.length > 0
                                    ? substationDataSource.list.map((item) => ({
                                          name: item.substationName,
                                          value: item.substationId,
                                      }))
                                    : []
                            }
                            onChange={this.changeSubstation}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    };

    renderContent = () => {
        let { activeKey, companyId, substation, refreshPage } = this.state;
        let Content = this.hasActiveContent[activeKey];
        if (isEmpty(Content) || refreshPage) {
            Content = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "statistics" */ `../default/${activeKey}/index.js`),
                loading: () => <Loading />,
                render(loaded, props) {
                    let Component = loaded.default;
                    return (
                        <Fragment>
                            <Component
                                companyId={companyId}
                                substation={substation}
                                activeKey={activeKey}
                                {...props}
                            />
                        </Fragment>
                    );
                },
            });
            this.hasActiveContent[activeKey] = Content;
        }
        return <Content />;
    };
    render() {
        const { loading, activeKey } = this.state;

        return loading ? null : (
            <Layout className='container'>
                <Layout.Header className='header'>{this.renderHeader()}</Layout.Header>
                <Layout.Content className={`content ${activeKey}`}>
                    {this.renderContent()}
                </Layout.Content>
            </Layout>
        );
    }
}
export default injectIntl(Dashborad);
