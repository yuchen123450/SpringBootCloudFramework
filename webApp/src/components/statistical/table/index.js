import React, { Component } from 'react';
// import { Table } from 'antd';
import Table from '../../../components/standardTable';
import { isEqual } from '../../../utils/common';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectFirstRow: this.selectFirstRow(),
        };
    }
    static defaultProps = {
        rowSelect: true,
        id: `tableId${Math.random()}`,
    };
    componentDidMount() {
        let { rowSelect } = this.props;
        //默认选中首个item
        if (rowSelect) {
            this.selectFirstRow();
        }
    }

    getSnapshotBeforeUpdate(prevProps) {
        if (!isEqual(prevProps.dataSource, this.props.dataSource)) {
            return true;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            let { rowSelect } = this.props;
            //默认选中首个item
            if (rowSelect) {
                this.selectFirstRow();
            }
        }
    }
    selectFirstRow = () => {
        let { id } = this.props;
        var tables = document.getElementsByClassName(`statistical-table ${id}`);
        if (tables) {
            for (let t = 0; t < tables.length; t++) {
                let trs = tables[t].querySelectorAll('tbody tr');
                if (trs) {
                    for (let r = 0; r < trs.length; r++) {
                        if (r === 0) {
                            let tr = trs[0];
                            this.selectedRow(tr);
                        }
                        trs[r].addEventListener('click', (e) => {
                            let tr = e.target.parentNode;
                            this.selectedRow(tr);
                        });
                    }
                }
            }
        }
    };

    selectedRow = (row) => {
        let table = this.props.showHeader
            ? row.parentNode
            : row.parentNode.parentNode.parentNode.parentNode;
        //清除表格中所有选中项
        let trs = table.querySelectorAll('tr');
        for (let i = 0; i < trs.length; i++) {
            if (trs[i].className.indexOf('ant-table-row-selected') > -1) {
                trs[i].className = trs[i].className.replace('ant-table-row-selected', '');
            }
        }
        if (row.className.indexOf('ant-table-row-selected') === -1) {
            row.className = `ant-table-row-selected ${row.className}`;
        }
    };

    render() {
        let { id, ...rest } = this.props;
        let cName = 'statistical-table';
        if (id) {
            cName = `${cName} ${id}`;
        }
        return <Table className={cName} {...rest} />;
    }
}

export default TableComponent;
