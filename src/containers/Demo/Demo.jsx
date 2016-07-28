import './Demo.scss';
import React, { Component } from 'react';
// select
import Select from '../../components/common/Select/index';
const Option = Select.Option;
// 分页
import Pager from '../../components/common/Pager/index';
import Dialog from '../../components/common/Dialog/Index';
// dropdown  依赖menu
import Dropdown from '../../components/common/Dropdown/index';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';

// Slider
import Slider from '../../components/common/Slider/Slider.jsx';

/* eslint-disable no-console */

function onSelect({ key }) {
  console.log(`${key} selected`);
}

function onVisibleChange(visible) {
  console.log(visible);
}
const menu = (
  <Menu className="rc-dropdown-menutest" onSelect={onSelect}>
    <MenuItem disabled><a href="http://baidu.com">我上传的图标项目</a></MenuItem>
    <MenuItem key="1"><a href="http://baidu.com">我上传的图标项目</a></MenuItem>
    <Divider />
    <MenuItem key="2"><span>已审核的图标项目</span></MenuItem>
  </Menu>
);

const menu2 = (
  <Menu className="menutest" onSelect={onSelect}>
    <MenuItem key="1">test</MenuItem>
    <MenuItem key="2"><span>test22222</span></MenuItem>
    <MenuItem key="3">test</MenuItem>
    <MenuItem key="4"><span>test22222</span></MenuItem>
  </Menu>
);
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
        <div style={{ width: 600, height: 50 }}>
          select 组件测试 simple
          <Select placeholder="色位" style={{ width: 70 }} className={'select-narrow'}>
            <Option value="64" className={'select-narrow-menu'}>64</Option>
            <Option value="32" className={'select-narrow-menu'}>32</Option>
            <Option value="56" className={'select-narrow-menu'}>56</Option>
            <Option value="disabled" disabled className={'select-narrow-menu'}>255</Option>
          </Select>
        </div>
        <div style={{ backgroundColor: '#fff' }}>
          <div style={{ width: 200, padding: 10 }}>
            <Slider />
          </div>
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
        <div className={'testdropdown'}>
          <h4>测试Dropdown</h4>
          <ul>
            <li>
              <Dropdown
                extraClass="demotest"
                menu={menu}
                curtext={'图标管理'}
                onVisibleChange={onVisibleChange}
              />
            </li>
            <li>
              <Dropdown
                extraClass="dropleft"
                menu={menu2}
                curtext={'权限设置'}
                onVisibleChange={onVisibleChange}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
