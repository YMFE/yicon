import './GenerateVersion.scss';
import React, { PropTypes } from 'react';
import Dialog from '../../components/common/Dialog/Index';

const GenerateVersion = (props) => (
  <Dialog
    onOk={props.onOk}
    onCancel={props.onCancel}
    title="生成版本"
    visible={props.showGenerateVersion}
  >
    <form className="project-form GenerateVersion">
      <ul
        style={{
          padding: '10px 0',
        }}
      >
        <li>
          <label
            htmlFor="project-version-reversion"
            onClick={props.onChange}
          >
            小版本迭代
            <input
              type="radio"
              value="reversion"
              name="project-version-reversion"
              checked={props.value === 'reversion'}
              onChange={() => {}}
            />
          </label>
        </li>
        <li>
          <label
            htmlFor="project-version-minor"
            onClick={props.onChange}
          >
            较少变化
            <input
              type="radio"
              value="minor"
              name="project-version-minor"
              checked={props.value === 'minor'}
              onChange={() => {}}
            />
          </label>
        </li>
        <li>
          <label
            htmlFor="project-version-major"
            onClick={props.onChange}
          >
            重大变更
            <input
              type="radio"
              value="major"
              name="project-version-major"
              checked={props.value === 'major'}
              onChange={() => {}}
            />
          </label>
        </li>
      </ul>
    </form>
  </Dialog>
);

GenerateVersion.propTypes = {
  onChange: PropTypes.func,
  showGenerateVersion: PropTypes.bool,
  value: PropTypes.oneOf([
    'reversion',
    'minor',
    'major',
  ]),
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};
export default GenerateVersion;
