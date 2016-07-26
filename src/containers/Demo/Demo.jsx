import React, { Component } from 'react';
import Select from '../../components/common/Select/index';
import Pager from '../../components/common/Pager/index';
const Option = Select.Option;

export default class Demo extends Component {
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
