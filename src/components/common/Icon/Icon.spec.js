import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Icon from './Icon';

const d = `M800,960 Q868,958 913,913 Q958,868 960,800 Q959,745 928,704
L864,640 L640,864 L704,928 Q745,959 800,960 M129,352 L65,64 L353,130
L816,594 L592,816 M652,596 L332,276 L277,331 L597,651 L652,596`;

function shallowRender(Component) {
  const renderer = TestUtils.createRenderer();
  renderer.render(Component);
  return renderer.getRenderOutput();
}

describe('<Icon />', () => {
  it('Icon 应该生成一个 <div>', () => {
    const dom = shallowRender(<Icon d={d} />);
    expect(dom.type).to.equal('div');
  });
});
