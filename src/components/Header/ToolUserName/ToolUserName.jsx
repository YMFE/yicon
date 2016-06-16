import React from 'react';
import styles from './ToolUserName.scss';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const ToolUserName = () => (
  <FlatButton
    children={<FontIcon className={styles['p-icon']} hoverColor={'#00bcd4'} />}
    icon={<FontIcon className={styles['name-icon']} hoverColor={'#00bcd4'} />}
    hoverColor={'#fff'}
  />
);

export default ToolUserName;
