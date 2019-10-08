import React from 'react';
import { Layout, Tooltip } from 'antd';
import { injectIntl } from 'react-intl';
import { throttle } from '../../utils/common';
import eventProxy from '../../utils/eventProxy';
import { toast } from '../toast';
import { locale } from '../../pages/locale';

class Svg extends React.Component {
    constructor(props) {
        super(props);
        this.throttle = throttle.bind(this);
        this.iX = 0;
        this.iY = 0;
        this.oX = 0;
        this.oY = 0;
        this.svgWidth = 0;
        this.svgHeight = 0;
        this.initWidth = 0;
        this.initHeight = 0;
        this.state = {
            data: '',
            svgElement: null,
            viewBoxValue: [],
            dragging: false,
            zoomLevel: 50,
            moveLevel: 0.1,
        };
    }
    componentDidMount = () => {
        this.receiveEvent();
    };

    receiveEvent = () => {
        eventProxy.on('svgExpand', (svgExpand) => {
            svgExpand && this.handleInitPos();
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let svgElement = prevState.svgElement;
        if (svgElement) {
            let { svgDataControl } = nextProps;
            svgDataControl(nextProps, prevState, svgElement);
        }
        svgElement = null;
        //避免地址引用
        if (JSON.stringify(nextProps.data) === prevState.data) {
            return null;
        } else {
            return {
                data: JSON.stringify(nextProps.data),
            };
        }
    }

    // //测点跳动
    //     _self.beatPoint = function (gEl) {
    //         var selected = true;
    //         pointInterval = setInterval(function () {
    //             if (selected) {
    //                 gEl.setAttribute('style', 'cursor:pointer;fill-opacity:0.4;');
    //                 selected = false;
    //             } else {
    //                 gEl.setAttribute('style', 'cursor:pointer;fill-opacity:1');
    //                 selected = true;
    //             }
    //         }, 500);

    //     };

    //移动
    setLocaltion(x, y) {
        let { viewBoxValue } = this.state;
        if (viewBoxValue != null) {
            this.oX = parseFloat(viewBoxValue[0]) + parseFloat(x);
            this.oY = parseFloat(viewBoxValue[1]) + parseFloat(y);
        }
        if (
            this.oX < this.initWidth - 20 &&
            this.oY < this.initHeight - 20 &&
            this.oX > 20 - this.initWidth &&
            this.oY > 20 - this.initHeight
        ) {
            this.setViewBox(this.oX, this.oY, this.svgWidth, this.svgHeight);
        } else {
            this.oX = viewBoxValue[0];
            this.oY = viewBoxValue[1];
        }
    }

    //缩放
    setZoom(delta) {
        let { viewBoxValue, zoomLevel } = this.state;

        if (delta < 0 && this.svgWidth < parseFloat(this.initWidth) * 1.5) {
            this.oX = parseFloat(viewBoxValue[0]) - zoomLevel / 2;
            this.oY = parseFloat(viewBoxValue[1]) - zoomLevel / 2;
            this.svgWidth = parseFloat(this.svgWidth) + zoomLevel;
            this.svgHeight = parseFloat(this.svgHeight) + zoomLevel;
        } else if (delta > 0 && this.svgWidth > parseFloat(this.initWidth) * 0.35) {
            this.oX = parseFloat(viewBoxValue[0]) + zoomLevel / 2;
            this.oY = parseFloat(viewBoxValue[1]) + zoomLevel / 2;
            this.svgWidth = parseFloat(this.svgWidth) - zoomLevel;
            this.svgHeight = parseFloat(this.svgHeight) - zoomLevel;
        }

        if (parseFloat(this.svgWidth) > 0 && parseFloat(this.svgHeight) > 0) {
            this.setViewBox(this.oX, this.oY, this.svgWidth, this.svgHeight);
        } else {
            this.svgWidth = viewBoxValue[2];
            this.svgHeight = viewBoxValue[3];
        }
    }

    //设置svg的viewBox
    setViewBox(x, y, width, height) {
        let viewBoxValue = [x, y, width, height];
        this.setState({
            viewBoxValue: viewBoxValue,
        });
        if (this.state.svgElement) {
            this.state.svgElement.setAttribute('viewBox', viewBoxValue.join(' '));
        }
    }

    //初始化文档
    svgIntail() {
        let {
            intl: { formatMessage },
        } = this.props;
        let { svgControl } = this.props;
        let svgContent = this.refs.svg;
        let svgElement = null;
        if (svgContent) {
            svgElement = svgContent.contentDocument.querySelector('svg');
        } else {
            try {
                svgElement = svgContent.getSVGDocument().querySelector('svg');
            } catch (e) {
                console.log(e);
            }
        }
        if (svgElement) {
            svgElement.setAttribute(
                'style',
                'cursor: inherit;-moz-user-select: none;-webkit-user-select: none;'
            );
            //控制
            svgControl(svgElement);

            //this.initWidth = parseFloat(svgElement.getAttribute('width'));
            //this.initHeight = parseFloat(svgElement.getAttribute('height'));

            //let viewBoxValue = [0, 0, this.initWidth, this.initHeight];
            let viewBoxValue = svgElement.getAttribute('viewBox').split(' ');
            this.initWidth = viewBoxValue[2];
            this.initHeight = viewBoxValue[3];
            this.svgWidth = this.initWidth;
            this.svgHeight = this.initHeight;
            this.setState({
                svgElement: svgElement,
            });

            // svgContent.setAttribute('height', svgElement.clientHeight);

            //this.setViewBox(viewBoxValue);
            this.setState({
                viewBoxValue: viewBoxValue,
            });

            let sensorLayer = svgElement.querySelector('g#sensor-1');
            if (sensorLayer) {
            }

            //视图还原
            svgElement.addEventListener(
                'dblclick',
                function() {
                    this.oX = 0;
                    this.oY = 0;
                    this.svgWidth = this.initWidth;
                    this.svgHeight = this.initHeight;
                    this.setViewBox(this.oX, this.oY, this.svgWidth, this.svgHeight);
                }.bind(this),
                false
            );

            //鼠标滚动调整缩放
            //svgElement.onmousewheel = this.debounce.bind(this);
            svgElement.addEventListener(
                'mousewheel',
                function(e) {
                    var e = e || window.event;
                    let delta = e.wheelDelta || e.detail;
                    this.setZoom(delta);
                }.bind(this),
                false
            );
            //处理Firfox下滚轮事件
            svgElement.addEventListener(
                'DOMMouseScroll',
                function(e) {
                    var e = e || window.event;
                    let delta = e.wheelDelta || e.detail;
                    setTimeout(this.setZoom(delta), 100);
                }.bind(this),
                false
            );

            svgElement.addEventListener(
                'mousedown',
                function(e) {
                    var e = e || window.event;
                    //排除鼠标右键
                    if (e.button != 2) {
                        this.setState({
                            dragging: true,
                            iX: e.offsetX,
                            iY: e.offsetY,
                        });
                        return false;
                    }
                }.bind(this),
                false
            );

            svgElement.addEventListener(
                'mousemove',
                function(e) {
                    var e = e || window.event;
                    let { dragging, iX, iY, moveLevel } = this.state;
                    if (dragging) {
                        this.setState({
                            oX: iX - e.offsetX,
                            oY: iY - e.offsetY,
                        });
                        this.setLocaltion(this.state.oX * moveLevel, this.state.oY * moveLevel);
                        return false;
                    }
                }.bind(this),
                false
            );

            svgElement.addEventListener(
                'mouseup',
                function(e) {
                    this.setState({
                        dragging: false,
                    });
                    e.cancelBubble = true;
                }.bind(this),
                false
            );
        } else {
            toast('error', formatMessage(locale.getSVGError)); //获取SVG图失败
            let svgShow = window.setTimeout(() => {
                eventProxy.trigger('svgShow', false);
                window.clearInterval(svgShow);
            }, 2000);
        }
    }
    handleInitPos() {
        this.oX = 0;
        this.oY = 0;
        this.svgWidth = this.initWidth;
        this.svgHeight = this.initHeight;
        this.setViewBox(this.oX, this.oY, this.svgWidth, this.svgHeight);
    }

    render() {
        let { path } = this.props;
        return (
            <Layout.Content>
                <object
                    ref='svg'
                    name='svgIframe'
                    type='image/svg+xml'
                    width='100%'
                    height='100%'
                    style={{ cursor: 'inherit', MozUserSelect: 'none', WebkitUserSelect: 'none' }}
                    data={path.layout}
                    onLoad={this.svgIntail.bind(this)}
                />
                <Tooltip>
                    <a
                        href='javascript:void(0)'
                        id='initpos'
                        className='initpos_btn'
                        onClick={this.handleInitPos.bind(this)}
                    />
                </Tooltip>
            </Layout.Content>
        );
    }
}

export default injectIntl(Svg);
