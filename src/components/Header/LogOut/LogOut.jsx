import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const LogOut = () => (
  <div style={{ float: 'left' }}>
    <FlatButton
      label="退出"
      labelStyle={{
        fontSize: '12.8px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    />
  </div>
);

export default LogOut;
