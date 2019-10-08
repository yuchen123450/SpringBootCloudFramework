import React, { Component } from 'react';

class BoxComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTitle: '',
        };
    }
    static defaultProps = {
        icon: true,
        type: false,
        title: false,
        width: '20rem',
        height: '20rem',
    };

    renderTitle(title, titleSelect) {
        let { type } = this.props;
        let content = title;
        if (type === 'panel8') {
            if (typeof title === 'string') {
                content = (
                    <div className='tab'>
                        <div className='selected'>
                            <span>{title}</span>
                        </div>
                    </div>
                );
            }
            if (Array.isArray(title)) {
                let titleEl = title.map((item, index) => (
                    <div
                        key={index}
                        className={index === 0 ? 'selected' : null}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            let targetEl = e.target.parentElement;
                            let children = targetEl.parentElement.children;
                            for (let i = 0, count = children.length; i < count; i++) {
                                children[i].removeAttribute('class');
                            }
                            targetEl.setAttribute('class', 'selected');
                            if (titleSelect) {
                                titleSelect(item);
                            }
                        }}>
                        <span>{item.value ? item.value : item}</span>
                    </div>
                ));
                content = <div className='tab'>{titleEl}</div>;
            }
        }

        return content;
    }

    render() {
        let { type, title, titleSelect, icon, width, height, children, ...rest } = this.props;
        let className = 'panel';
        if (type) {
            className = `${className} ${type}`;
        } else {
            className = `${className} default`;
        }
        return (
            <div className='statistical-box' {...rest}>
                <div className={className} style={{ width, height }}>
                    <div className='corner'>
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className='info'>
                        {title ? (
                            <div className='title'>
                                {icon ? <div className='icon' /> : null}
                                {this.renderTitle(title, titleSelect)}
                            </div>
                        ) : null}
                        <div
                            className='content'
                            style={
                                title
                                    ? null
                                    : {
                                          top: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                      }
                            }>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BoxComponent;
