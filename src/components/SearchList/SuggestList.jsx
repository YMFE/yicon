import React, { PropTypes } from 'react';

const SuggestList = props => {
  const {
    writeState,
    suggestList,
    noFoundTip,
    show,
    top,
    left,
    WRITE_STATE,
  } = props;
  const classList = ['SuggestList-list'];
  if (!show) classList.push('hide');
  return (
    <ul
      className={classList.join(' ')}
      style={{
        top,
        left,
      }}
    >
    {
      writeState === WRITE_STATE.HAS_RESULT
      ?
      suggestList.map((item, index) => (
        <li
          className={index === props.activeIndex ? 'active' : ''}
          key={index}
          data-index={index}
          data-id={item.id}
          onMouseDown={props.onChoseItem}
        >{item.name}
        </li>
      ))
      :
        <li>{noFoundTip}</li>
    }
    </ul>
  );
};

SuggestList.propTypes = {
  writeState: PropTypes.number,
  suggestList: PropTypes.array,
  noFoundTip: PropTypes.string,
  onChoseItem: PropTypes.func,
  onChoseMember: PropTypes.func,
  show: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number,
  activeIndex: PropTypes.number,
  WRITE_STATE: PropTypes.object,
};

export default SuggestList;
