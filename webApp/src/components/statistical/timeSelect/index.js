import React, { Component } from 'react';
import { Button, DatePicker } from 'antd';
import moment from 'moment';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            begin: moment(),
            end: moment(),
        };
    }

    static defaultProps = {
        dateFormat: 'YYYY-MM-DD',
        rowSelect: true,
    };

    componentDidMount() {
        let { buttons, type } = this.props;
        if (!type && buttons) {
            buttons.map((button, index) => {
                if (button.type == 'primary') {
                    let {
                        interval: { key, value },
                    } = button;
                    let start =
                        key == 'days' && value == 0 ? moment() : moment().subtract(value, key);
                    this.dateChange(start, moment());
                }
            });
        } else {
            this.dateChange(moment());
        }
    }

    checkDateButton = (button, data) => {
        let buttons = this.timeSelect.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].className.indexOf('ant-btn-primary') > -1) {
                buttons[i].className = buttons[i].className.replace('ant-btn-primary', '');
            }
        }
        if (button) {
            if (button.className.indexOf('ant-btn-primary') === -1) {
                button.className = `ant-btn-primary ${button.className}`;
            }
            let {
                interval: { key, value },
            } = data;
            let start = key == 'days' && value == 0 ? moment() : moment().subtract(value, key);
            this.dateChange(start, moment());
        }
    };

    dateChange = (begin, end) => {
        let { onDateChange, type } = this.props;
        if (type) {
            begin = begin.startOf('day');
            this.setState(
                {
                    begin,
                },
                () => {
                    if (onDateChange) {
                        onDateChange(begin);
                    }
                }
            );
        } else {
            begin = begin.startOf('day');
            end = end.endOf('day');
            this.setState(
                {
                    begin,
                    end,
                },
                () => {
                    if (onDateChange) {
                        onDateChange([begin, end]);
                    }
                }
            );
        }
    };

    render() {
        let { buttons, className, dateFormat, onDateChange, type, ...rest } = this.props;
        let { begin, end } = this.state;
        let btns = '';
        if (buttons) {
            btns = buttons.map((button, index) => (
                <Button
                    key={index}
                    type={button.type ? button.type : ''}
                    onClick={(envent) => {
                        let btn = envent.target;
                        this.checkDateButton(btn, button);
                    }}>
                    {button.text}
                </Button>
            ));
        }

        return (
            <div
                ref={(timeSelect) => (this.timeSelect = timeSelect)}
                className={`timeSelect ${className}`}>
                <div style={{ display: 'flex' }}>
                    {type ? null : btns}
                    <DatePicker.RangePicker
                        allowClear={false}
                        separator='--'
                        format={dateFormat}
                        value={[moment(begin, dateFormat), moment(end, dateFormat)]}
                        showTime={false}
                        onChange={([begin, end]) => {
                            this.dateChange(begin, end);
                            this.checkDateButton();
                        }}
                        {...rest}
                    />
                </div>
            </div>
        );
    }
}

export default TableComponent;
