import React, { PureComponent } from 'react';
import { Select } from 'antd';

// data数据类型：data =[{value:'',name:''}...]
const { Option } = Select;
export default class BaseSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    static defaultProps = {
        data: [{ value: '', name: '' }],
        allowClear: true,
    };

    //添加内部state管理value触发onChange以适配Form.getFieldDecorator校验包裹后的默认值管理
    triggerOnChange = (value, obj) => {
        let onChange = this.props;
        if (onChange) {
            onChange(value, obj);
        }
        this.setState({ value });
    };

    renderOption(data) {
        let optionList = null;
        if (data) {
            optionList = data.map((el, index) => (
                <Option ref={el} key={index} value={el.value}>
                    {el.name}
                </Option>
            ));
        }
        return optionList;
    }

    render() {
        const { className, data, ...rest } = this.props;
        return (
            <Select
                className={className}
                dropdownClassName={`${className}-dropdown`}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                onChange={this.triggerOnChange}
                {...rest}>
                {this.renderOption(data)}
            </Select>
        );
    }
}
