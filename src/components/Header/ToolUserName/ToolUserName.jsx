import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const ToolUserName = () => (
  <div style={{ float: 'left' }}>
    <FlatButton
      label="张文杰"
      labelStyle={{
        color: '#212121',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
      icon={<FontIcon className="iconfont" color={'#00bcd4'}>&#xf024;</FontIcon>}
    />
  </div>
);

export default ToolUserName;
