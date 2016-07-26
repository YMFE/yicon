import './Home.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchHomeData,
} from '../../actions/repository';
import RepoSection from '../../components/RepoSection/RepoSection';

import Select from '../../components/common/Select/index';
import Pager from '../../components/common/Pager/index';
const Option = Select.Option;

import { Content } from '../../components/';
@connect(
  state => ({ list: state.repository.homeRepository }),
  { fetchHomeData }
)
class Home extends Component {
  componentWillMount() {
    // hack
    // if (typeof document !== 'object') {
    this.props.fetchHomeData();
    // }
  }
  render() {
    const { list } = this.props;
    return (
      <div className="home">
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
          <Pager defaultCurrent={1} onClick={(index) => { console.log(index); }} totalPage={50} />
        </div>
        <Content className="home-container">
          {
            list.map(repo => (
              <RepoSection
                key={repo.id}
                id={repo.id}
                name={repo.name}
                iconCount={repo.iconCount}
                icons={repo.icons}
                user={repo.user}
              />
            ))
          }
        </Content>

      </div>
    );
  }
}

Home.propTypes = {
  list: PropTypes.array,
  fetchHomeData: PropTypes.func,
};

export default Home;
