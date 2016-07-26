import React, { Component } from 'react';
import Select from '../../components/common/Select/index';
import Pager from '../../components/common/Pager/index';
import Dialog from '../../components/common/Dialog/Index';
const Option = Select.Option;
/* eslint-disable no-console */

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  show() {
    this.setState({ visible: true });
  }
  render() {
    return (
      <div>
        <div style={{ width: 600, height: 50 }}>
          select 组件测试
          <Select placeholder="请选择项目" style={{ width: 250 }}>
            <Option value="去哪儿网3W">去哪儿网3W</Option>
            <Option value="系统应用">系统应用</Option>
            <Option value="无线大客户端">无线大客户端无线大客户端</Option>
            <Option value="disabled" disabled>Disabled</Option>
          </Select>
        </div>
        <input type="button" value="dialog demo" onClick={() => this.show()} />
        <Dialog visible={this.state.visible} empty>
          看我随手一打就是标准十五字
        </Dialog>
        <div style={{ width: 600 }}>
          <Pager
            defaultCurrent={1}
            onClick={(index) => { console.log(index); }}
            totalPage={50}
          />
        </div>
      </div>
    );
  }
}
