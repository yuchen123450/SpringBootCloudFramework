import React, { Component } from 'react';

class LCDComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            letters: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
            digitArr: [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
            ],
            symbolArr: ['.', ':', '-', '/', '%'],
            content: this.props.children ? this.props.children : '',
        };
    }

    static defaultProps = {
        size: 'defalut',
        color: '#000000',
    };

    static getDerivedStateFromProps(props, state) {
        if (props.children) {
            if (props.children !== state.content) {
                return {
                    content: props.children,
                };
            }
        }
        return null;
    }

    changeContent = (text) => {
        this.setState({ content: text });
    };
    renderLetterOrDigit = (type, char, index) => {
        let { digitArr } = this.state;
        let { color } = this.props;
        let content = [];
        for (let i = 1; i < 8; i++) {
            content.push(
                <span
                    key={`d${i}`}
                    className={`d${i}`}
                    style={{ backgroundColor: color, borderColor: color }}
                />
            );
        }

        return (
            <div key={index} className={type}>
                <div className={type === 'digit' ? digitArr[char] : char}>{content}</div>
            </div>
        );
    };

    renderSymbor = (symbol, index) => {
        let { color } = this.props;
        let symbolObj = {};
        switch (symbol) {
            case '.':
                symbolObj = {
                    className: 'dot',
                    spanCount: 1,
                };
                break;
            case ':':
                symbolObj = {
                    className: 'dots',
                    spanCount: 2,
                };
                break;
            case '-':
                symbolObj = {
                    className: 'line',
                    spanCount: 1,
                };
                break;
            case '/':
                symbolObj = {
                    className: 'slant',
                    spanCount: 2,
                };
                break;
            case '%':
                symbolObj = {
                    className: 'percent',
                    spanCount: 4,
                };
                break;
            default:
                symbolObj = {
                    className: '',
                    spanCount: 0,
                };
                break;
        }
        let content = [];
        for (let i = 0; i < symbolObj.spanCount; i++) {
            content.push(
                <span key={`d${i}`} style={{ backgroundColor: color, borderColor: color }} />
            );
        }
        return (
            <div key={index} className='symbol'>
                <div className={symbolObj.className}>{content}</div>
            </div>
        );
    };

    renderChar = (char, index) => {
        let { color } = this.props;
        return (
            <div key={index} className='char'>
                <span className={char === ' ' ? 'empty' : ''} style={{ color: color }}>
                    {char}
                </span>
            </div>
        );
    };

    renderLCD = (text) => {
        if (typeof text !== 'string') {
            if (isNaN(parseInt(text)) === false) {
                text = `${text}`;
            }
        }
        let content = [];
        let { letters, symbolArr } = this.state;
        //字符串遍历
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (isNaN(parseInt(char)) === false) {
                content.push(this.renderLetterOrDigit('digit', parseInt(char), i));
            }
            // else if (letters.indexOf(char) > -1) {
            //     content.push(this.renderLetterOrDigit('letter', char, i));
            // }
            else if (symbolArr.indexOf(char) > -1) {
                content.push(this.renderSymbor(char, i));
            } else {
                content.push(this.renderChar(char, i));
            }
        }
        return content;
    };
    render() {
        let { size } = this.props;
        let { content } = this.state;
        let className = 'default';
        if (size) {
            className = size;
        }
        return (
            <div className='LCD '>
                <div className={className}>{this.renderLCD(content)}</div>
            </div>
        );
    }
}
export default LCDComponent;
