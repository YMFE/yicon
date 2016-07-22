// import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Slider from './Slider.jsx';


function shallowRender(Component, props) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Component {...props} />);
  return renderer.getRenderOutput();
}

describe('Slider', () => {
  it('should render a Slider with correct DOM structure', () => {
    const slider = shallowRender(Slider);
    expect(slider.props.children[0].type).to.equal('span');
    expect(slider.props.children[1].type).to.equal('span');
  });

  it('should render a Slider with default value correctly', () => {
    const slider = shallowRender(Slider, { defaultValue: 50 });
    expect(slider.props.children[0].props.style.width).to.equal('50%');
    expect(slider.props.children[1].props.style.left).to.equal('50%');
  });

  it('should render a Slider with value correctly', () => {
    const slider = shallowRender(Slider, { value: 50 });
    expect(slider.props.children[0].props.style.width).to.equal('50%');
    expect(slider.props.children[1].props.style.left).to.equal('50%');
  });

  it('should render a Slider with min, max and value correctly', () => {
    const slider = shallowRender(Slider, { min: 30, max: 80, value: 55 });
    expect(slider.props.children[0].props.style.width).to.equal('50%');
    expect(slider.props.children[1].props.style.left).to.equal('50%');
  });
});
