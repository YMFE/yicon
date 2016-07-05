import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrRepository } from '../../actions/getCurrRepository';

@connect(
  state => ({ cartIconIds: state.cartIconIds, list: state.currRepository.list }),
  { getCurrRepository }
)
export default class Repository extends Component {
  componentDidMount() {
    this.props.getCurrRepository(this.props.params.id);
  }
  render() {
    const { id } = this.props.params;
    return (
      <div>
        <h1>Repository</h1>
        <p>This is repository page. Id: {id}.</p>
        {
          this.props.list.map((icon) => (icon.id))
        }
      </div>
    );
  }
}

Repository.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  getCurrRepository: PropTypes.func,
  list: PropTypes.array,
};
