import './Header.scss';
import React, { PropTypes, Component } from 'react';
import Nav from './Nav/Nav';
import { connect } from 'react-redux';
import ToolUserName from './ToolUserName/ToolUserName.jsx';
// import LogOut from './LogOut/LogOut.jsx';
import Search from './Search/Search';
import Logo from './Logo/Logo';
import Cart from './Cart/Cart';
import Info from './Info/';
// import { autobind } from 'core-decorators';
import {
  toggleCartListDisplay,
  getIconsInLocalStorage,
} from '../../actions/cart.js';
import {
  fetchSearchResult,
} from '../../actions/search.js';

const iconManageList = [
  { name: '我上传的图标' },
  { name: '我收藏的图标' },
  { name: '我的图标项目' },
];

@connect(
  (state) => ({
    isShowCartList: state.cart.toggleCartListDisplay,
    searchValue: state.search.value,
    allReposotoryList: state.repository.allReposotoryList,
  }),
  {
    toggleCartListDisplay,
    getIconsInLocalStorage,
    fetchSearchResult,
  }
)

class Header extends Component {
  // constructor(props) {
  //   super(props);
  // }


  componentWillMount() {
    const {
      className,
      extraClass,
    } = this.props;

    if (className) {
      this.classList = className;
    } else if (extraClass) {
      this.classList = `global-header ${extraClass}`;
    } else {
      this.classList = 'global-header';
    }
  }
  render() {
    const {
      iconDatabase,
      isLogin,
      userName,
    } = this.props;

    return (
      <header className={this.classList}>
        <div className="container">
          <Logo />
          <nav className="nav quick-menu">
            <ul>
              <Nav name="图标库" list={iconDatabase} />
              <Nav name="图标管理" list={iconManageList} />
            </ul>
          </nav>
          <div className="quick-menu nav-menu-info">
            <ul className="clearfix">
              <ToolUserName login={isLogin} name={userName} />
              <Info infoCont={2} />
              <Cart
                isShowCart={this.props.isShowCartList}
              />
              <li className="lists">
                <a href="#" className="upload"><i className="iconfont">&#xf50a;</i></a>
              </li>
              <Search
                defaultValue={this.props.searchValue}
                onSubmit={this.props.fetchSearchResult}
              />
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  iconDatabase: PropTypes.array,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  isLogin: PropTypes.bool,
  userName: PropTypes.string,
  searchValue: PropTypes.string,
  onSearch: PropTypes.func,
  isShowCartList: PropTypes.bool,
  getIconsInLocalStorage: PropTypes.func,
  allReposotoryList: PropTypes.array,
  fetchSearchResult: PropTypes.func,
};

export default Header;
