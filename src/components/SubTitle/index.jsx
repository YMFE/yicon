import './SubTitle.scss';
import React, { PropTypes } from 'react';

const SubTitle = (props) => {
  let classList = props.extraClass ? `global-subtitle ${props.extraClass}` : 'global-subtitle';
  return (
    <header className={classList}>
      <div className="container">
        <div className="options">
          <div className="title">
            <h2>{props.tit}</h2>
          </div>
          {props.children}
        </div>
      </div>
    </header>
  );
};
SubTitle.propTypes = {
  extraClass: PropTypes.string,
  tit: PropTypes.string,
  children: PropTypes.element,
};
export default SubTitle;
