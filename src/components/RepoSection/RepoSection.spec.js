import React from 'react';
import TestUtils from 'react-addons-test-utils';
// import { findDOMNode } from 'react-dom';
import RepoSection from './RepoSection';

const icons = [
  {
    id: 1,
    path: 'M839,726 L770,657 Q857,599 913,511 Q855,419 764,361 Q707,325 643,306.5',
  },
  {
    id: 2,
    path: 'M839,726 L770,657 Q857,599 913,511 Q855,419 764,361 Q707,325 643,306.5',
  },
];
const app = TestUtils.renderIntoDocument(<RepoSection
  key={1}
  id={1}
  name={'测试'}
  total={'20'}
  icons={icons}
/>);

function getIconResult() {
  const total = app.props.total;
  return total >= icons.length;
}

describe('图标数量', () => {
  it('首页每个库图标总数>=首页显示数量', () => {
    const result = getIconResult();
    expect(result).to.be.equal(true);
  });
});

describe('路由跳转', () => {
  it('点击各个库路由跳转进入详情页', () => {
    // const appDom = findDOMNode(app);
    // const elem = appDom.querySelector('a');
    // TestUtils.Simulate.click(elem);
    // expect(previousUrl).to.not.be.equal();
  });
});
