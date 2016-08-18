import './Help.scss';
import React, { Component } from 'react';

/* eslint-disable max-len */
export default class Help extends Component {
  state = {
    type: 'draw',
  }

  click(type) {
    this.setState({
      type,
    });
  }

  render() {
    const { type } = this.state;
    return (
      <div className="yicon-container">
        <div className="yicon-spec-title">
          <div className="txt">图标绘制详细说明</div>
        </div>

        <div className="yicon-spec clearfix">
          <aside className="menu">
            <div
              className={`menu-item ${type === 'draw' ? 'on' : ''}`}
              onClick={() => this.click('draw')}
            >
              图标绘制规范
            </div>
            <div
              className={`menu-item ${type === 'style' ? 'on' : ''}`}
              onClick={() => this.click('style')}
            >
              图标样式规范
            </div>
          </aside>
          <main className={`spec-content ${type === 'draw' ? 'on' : ''}`}>
            <div className="content-title">
              图标绘制规范
            </div>
            <ul className="spec-detail">
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">1. 软件使用</p>
                  请使用Adobe Illustrator CC 2014 及以上版本绘制图标，绘制完成后，每个图标按照模版规格单独保存为SVG格式（以默认设置保存），上传服务器完成字体转化。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">2. 图标尺寸</p>
                  请以16X16点阵为对齐参考，务必在限定边框内绘制图形，尽量撑满绘制区域，规则图形线条、边缘尽量对齐网格。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">3. 减少节点</p>
                  为了确保图标的清晰显示，在绘制时须避免水平、垂直的边缘出现半个单位。（半个单位的路径会导致图标在最终显示时边缘模糊，不清晰），弧线在绘制时要保证弧度饱满，图形尽量减少节点使用，简化图形，去除无用节点。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">4. 路径闭合</p>
                  在绘制图形的时候，曲线必须是闭合的（如果曲线是不闭合的在字体转化的过程中是无法转译未闭合曲线的图形）。
                </div>
                <div className="spec-img-box width">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">5. 路径扩展</p>
                  字体或线形描边图标绘制完成后，务必对对象执行“扩展”操作，以矢量图形输出（未“扩展”的字体或路径在转化为字体后无法正常显示）。
                </div>
                <div className="spec-img-box width">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">6. 形状合并</p>
                  如果包含两个及以上图形，或者有布尔关系的图形请对图形扩展或合并（全选欲合并的两个或多个图形，按住“Alt键”单击路径查找器中的“联集”以创建一个复合形状，再点击“扩展”选项）。
                </div>
                <div className="spec-img-box width">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">7. 色彩填充</p>
                  在绘制好封闭图形后，对图形进行颜色填充（任意颜色，数值不影响最终的字体转化）。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
            </ul>
          </main>
          <main className={`spec-content ${type === 'style' ? 'on' : ''}`}>
            <div className="content-title">
              图标样式规范
            </div>
            <ul className="spec-detail">
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">1. 图形区域</p>
                  设计区域以中间12x12点阵为图形主体区域，四个方向的2点阵为辅助区域。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">2. 对齐基线</p>
                  图标要基于基线对齐，同时需要综合考虑图标在组合使用时的水平位置关系，同类型图标做到体量上一致。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">3. 图标类型</p>
                  操作类图标，在表意清晰的基础上，尽量简洁明了；展示类图标，在不影响展示的前提下，可适当体现一些细节，从视觉上增加亲和力。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">4. 展示形式</p>
                  线形图标，在设计中使用粗线24pt、细线16pt线条组合来展示，粗线展示图标寓意的主体部分，细线作为辅助细节，可理解为空心图标；填色图标，即实心图标，细节上的展示效果略逊于线形图标。线形图标适用于浅色底的中、大图标使用，填色图标适用于深色反白环境，或中、小图标使用。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
              <li className="item">
                <div className="spec-info">
                  <p className="info-title">5. 细节表现</p>
                  图标中尽量避免锋利的尖角，拐点圆润，并且在图形的尾端使用圆点结束。
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
                <div className="spec-img-box">
                  <img className="spec-img" src="" alt="" />
                </div>
              </li>
            </ul>
          </main>
        </div>
      </div>
    );
  }
}
