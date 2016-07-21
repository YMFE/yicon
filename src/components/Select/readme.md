// /**
//  * 暂时不支持多选
//  * extraClass 组件扩展样式名称 string  选择框大小，可选 large small
//  * defaultValue 指定默认选中的条目
//  * value 指定当前选中的条目
//  * onSelect 被选中时调用，参数为选中项的value值
//  * onChange 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
//  * dropdownMatchSelectWidth 下拉菜单和选择器同宽
//  * optionLabelProp 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value。
//  * disabled 是否禁用
//  * defaultActiveFirstOption 是否默认高亮第一个选项。
//  */

// const defaultProps = {
//   extraClass: '',
//   defaultValue: '',
//   value: '',
//   onSelect: (value, option) => {
//     console.log(option);
//   },
//   onChange: (value) => {
//     console.log(value);
//   },
//   dropdownMatchSelectWidth: true,
//   optionLabelProp: '',
//   disabled: false,
//   defaultActiveFirstOption: true,
//   getPopupContainer: (evt) => {
//     console.log(evt);
//   //  document.body;
//   },
// };
// const propTypes = {
//   extraClass: PropTypes.string,
//   defaultValue: PropTypes.string,
//   value: PropTypes.string,
//   onSelect: PropTypes.func,
//   onChange: PropTypes.func,
//   dropdownMatchSelectWidth: PropTypes.bool,
//   optionLabelProp: PropTypes.string,
//   disabled: PropTypes.bool,
//   defaultActiveFirstOption: PropTypes.bool,
//   getPopupContainer: PropTypes.func,
// };
//
// export default class Select extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       defaultValue: this.props.defaultValue,
//       value: this.props.value,
//     };
//   }
//   render() {
//     const { extraClass,} = this.props;
//     const selectClass = ["defaultSelect", extraClass].join(' ');
//     return (
//       <RcSelect className={selectClass}>
//         <Option value="lucy">lucy</Option>
//       </RcSelect>
//     );
//   }
// }
// Select.propTypes = propTypes;
// Select.defaultProps = defaultProps;
