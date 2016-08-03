export default (size, color, path) => {
  const scale = size / 1024;
  const fill = /#[0-9a-z]{6}/i.test(color) ? color : '#000000';
  return `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style type="text/css"><![CDATA[]]></style>
  </defs>
  <g class="transform-group">
    <g transform="translate(0, ${size}) scale(${scale}, ${-scale})">
      <path d="${path}" fill="${fill}"></path>
    </g>
  </g>
</svg>`;
};
