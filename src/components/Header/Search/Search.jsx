import React from 'react';

const floatStyle = {
  float: 'left',
};

const Search = () => (
  <div style={floatStyle}>
    <input type="input" placeholder="请输入查询关键字" />
  </div>
);

export default Search;
