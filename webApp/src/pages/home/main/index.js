import React, { PureComponent, Fragment } from 'react';
import { Card, Dropdown, Menu, BackTop } from 'antd';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import Loading from '../../../components/loading';
import BaseIcon from '../../../components/baseIcon';
import { deepClone, isEmpty } from '../../../utils/common';
import { storage } from '../../../utils/storage';
import eventProxy from '../../../utils/eventProxy';
import { LOCALSTORAGE } from '../../../constants/common';
import { locale, formatMessage } from '../../../pages/locale';
import Header from '../../../containers/header';
import { authAction, systemAction } from '../../../actions';

@connect(
    (state) => ({
        commonState: state.commonReducer,
        userCenterState: state.userCenterReducer,
    }),
    (dispatch) => ({
        checkToken: (authId) => dispatch(authAction.checkToken(authId)),
        //获取用户的菜单
        getUserMenus: () => dispatch(systemAction.getUserMenus()),
    })
)
class Main extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabList: [
                {
                    key: 'workbench',
                    tab: (
                        <span style={{ margin: '0 12px' }}>
                            <BaseIcon icon='workbench.svg' />
                            {formatMessage(locale.MenuWorkbench)}
                        </span>
                    ),
                },
            ],
            activeKey: 'workbench',
            menuList: [],
        };
        this.contentListNoTitle = {};
    }

    componentDidMount = async () => {
        this.refreshMenus();
        eventProxy.on('activeTab', (activeKey) => {
            this.addTab(activeKey);
        });
        eventProxy.on('refreshMenus', () => {
            this.refreshMenus();
        });
    };

    componentWillUnmount() {
        eventProxy.off('refreshMenus');
        eventProxy.off('activeTab');
    }

    refreshMenus = async () => {
        let { getUserMenus } = this.props;
        let getUserMenusResult = await getUserMenus();
        if (getUserMenusResult.success && getUserMenusResult.data) {
            if (
                getUserMenusResult.data[0] &&
                getUserMenusResult.data[0].key == 'dashboard' &&
                getUserMenusResult.data[0].children
            ) {
                getUserMenusResult.data[0].children = null;
            }
            this.setState(
                {
                    menuList: getUserMenusResult.data,
                },
                () => {
                    let activeKey = storage.get(LOCALSTORAGE.activeKey);
                    this.addTab(activeKey);
                }
            );
        }
    };

    getMenuByKey = (key, menuList) => {
        let menuItem = null;
        if (menuList) {
            menuList.forEach((menu) => {
                if (menu.children) {
                    menu.children.forEach((item) => {
                        if (item.key === key) {
                            menuItem = item;
                        }
                    });
                } else {
                    if (menu.key === key) {
                        menuItem = menu;
                    }
                }
            });
        }
        return menuItem;
    };

    addTab = (key) => {
        if (key === 'dashboard') {
            window.location.href = '/statistics.html';
        } else {
            let { tabList, menuList } = this.state;
            let menuItem = this.getMenuByKey(key, menuList);
            if (menuItem) {
                // every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true。
                // some()是对数组中每一项运行给定函数，如果该函数对任一项返回true，则返回true。
                let hasTab = tabList.some((item) => item.key === menuItem.key);
                if (hasTab != true) {
                    tabList.push({
                        key: menuItem.key,
                        tab: (
                            <Dropdown
                                trigger={['contextMenu']}
                                placement='bottomCenter'
                                overlay={
                                    <Menu
                                        onClick={({ key, domEvent }) => {
                                            domEvent.stopPropagation(); //阻止点击事件向上冒泡
                                            this.rightClickTab(key, menuItem.key);
                                        }}>
                                        <Menu.Item key='CloseCurrentTab'>
                                            {formatMessage(locale.CloseCurrentTab)}
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key='CloseRightTab'>
                                            {formatMessage(locale.CloseRightTab)}
                                        </Menu.Item>
                                        <Menu.Item key='CloseOtherTab'>
                                            {formatMessage(locale.CloseOtherTab)}
                                        </Menu.Item>
                                        <Menu.Item key='CloseAllTab'>
                                            {formatMessage(locale.CloseAllTab)}
                                        </Menu.Item>
                                    </Menu>
                                }>
                                <span>
                                    <BaseIcon icon={menuItem.icon} />
                                    {formatMessage(locale[menuItem.name])}
                                    <BaseIcon
                                        icon='close'
                                        className='tab-close'
                                        onClick={(e) => {
                                            e.stopPropagation(); //阻止点击事件向上冒泡
                                            this.removeTab(menuItem.key);
                                        }}
                                    />
                                </span>
                            </Dropdown>
                        ),
                    });
                }
                this.setState(
                    {
                        activeKey: menuItem.key,
                        tabList: tabList,
                    },
                    () => {
                        storage.set(LOCALSTORAGE.activeKey, menuItem.key);
                    }
                );
            }
        }
    };

    removeTab = (key) => {
        let { tabList, activeKey } = this.state;
        let tabs = deepClone(tabList);
        let index = tabs.findIndex((item) => item.key === key);
        tabs.splice(index, 1);
        if (key === activeKey) {
            activeKey = tabs[index - 1].key;
            this.setState({
                activeKey: activeKey,
                tabList: tabs,
            });
        } else {
            this.setState({
                tabList: tabs,
            });
        }
        storage.set(LOCALSTORAGE.activeKey, activeKey);
    };

    changeTab = (key) => {
        //切换Tab页面
        // this.contentListNoTitle[key] = this.refs.content;
        this.setState(
            {
                activeKey: key,
            },
            () => {
                storage.set(LOCALSTORAGE.activeKey, key);
            }
        );
    };

    rightClickTab = (menuKey, tabKey) => {
        let { activeKey, tabList } = this.state;
        let activeCurrent = '';
        let tabCurrent = deepClone(tabList);
        let currentIndex = tabList.findIndex((tab) => tab.key === tabKey);
        switch (menuKey) {
            case 'CloseCurrentTab':
                if (tabKey === activeKey) {
                    activeCurrent = tabList[currentIndex - 1].key;
                } else {
                    activeCurrent = activeKey;
                }
                tabCurrent.splice(currentIndex, 1);
                break;
            case 'CloseRightTab':
                activeCurrent = tabKey;
                tabCurrent = tabList.slice(0, currentIndex + 1);
                break;
            case 'CloseOtherTab':
                activeCurrent = tabKey;
                tabCurrent = [tabList[0], tabList[currentIndex]];
                break;
            case 'CloseAllTab':
                activeCurrent = tabList[0].key;
                tabCurrent = [tabList[0]];
                break;
        }
        this.setState({
            activeKey: activeCurrent,
            tabList: tabCurrent,
        });
    };

    renderContent = (activeKey) => {
        let {
            commonState: { isMobile },
        } = this.props;
        let Content = this.contentListNoTitle[activeKey];
        if (isEmpty(Content)) {
            Content = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "home" */ `../../home/${activeKey}/index.js`),
                loading: () => <Loading />,
                render(loaded, props) {
                    let Component = loaded.default;
                    return (
                        <Fragment>
                            <Component {...props} />
                            <BackTop
                                visibilityHeight={10}
                                target={() => {
                                    //目标定位到BaseScroll组件下第一个子元素
                                    let targetEl = document.querySelector(
                                        '[class="page-layout-scroll"]'
                                    );
                                    if (targetEl) {
                                        return targetEl.firstChild;
                                    } else {
                                        return document.body;
                                    }
                                }}
                            />
                        </Fragment>
                    );
                },
            });
            this.contentListNoTitle[activeKey] = Content;
        }
        return <Content isMobile={isMobile} />;
    };

    updateTab = (tabList) => {
        if (tabList.length > 0) {
            let { menuList } = this.state;
            let tabs = deepClone(tabList);
            tabs.forEach((item) => {
                if (item.key === 'workbench') {
                    let { children } = item.tab.props;
                    children[1] = formatMessage(locale.MenuWorkbench);
                } else {
                    let menuItem = this.getMenuByKey(item.key, menuList);
                    if (menuItem) {
                        let {
                            props: { children },
                        } = item.tab.props.children;
                        children[1] = formatMessage(locale[menuItem.name]);
                    }
                }
            });
            return tabs;
        } else {
            return tabList;
        }
    };

    render() {
        let { menuList, tabList, activeKey } = this.state;
        return (
            <Fragment>
                <Header
                    page='home'
                    menuList={menuList}
                    activeKey={activeKey}
                    onMenuClick={(item) => {
                        this.addTab(item);
                    }}
                />
                <Card
                    className='page-layout'
                    tabList={this.updateTab(tabList)}
                    activeTabKey={activeKey}
                    onTabChange={this.changeTab.bind(this)}>
                    {this.renderContent(activeKey)}
                </Card>
            </Fragment>
        );
    }
}

export default Main;
