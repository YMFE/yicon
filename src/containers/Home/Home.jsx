import './Home.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchHomeData,
} from '../../actions/repository';
import RepoSection from '../../components/RepoSection/RepoSection';
import { Footer, Content } from '../../components/';

@connect(
  state => ({ list: state.repository.homeRepository }),
  { fetchHomeData }
)
class Home extends Component {
  static propTypes = {
    list: PropTypes.array,
    fetchHomeData: PropTypes.func,
  }

  componentWillMount() {
    this.props.fetchHomeData();
  }

  render() {
    const { list } = this.props;
    return (
      <div className="home">
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
        <Footer />
      </div>
    );
  }
}

export default Home;
