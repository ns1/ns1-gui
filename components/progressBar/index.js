import PropTypes from 'prop-types';
import React from 'react';
import './progressBar.scss';
class ProgressBarComp extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    percent: PropTypes.number.isRequired,
    showValue: PropTypes.bool,
    customValue: PropTypes.number,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
  }
  render() {
    return <div className={`bunder-progress-bar ${this.props.className}`}>
      {this.props.label &&
        <span className="progress-label">{this.props.label}</span>}
      <div className="bar">
        <div
          style={{flex: `${this.props.percent}`}}
          className="bar-part completed"
          />
        <div
          style={{flex: `${100 - this.props.percent}`}}
          className="bar-part incomplete"
          />
      </div>
      <span className="percent-done">
        {this.props.customValue !== undefined ?
          this.props.customValue :
          <span>{this.props.percent}%</span>
        }
      </span>
    </div>;
  }
}

export default ProgressBarComp;
export const ProgressBar = ProgressBarComp;
export progressbarEX from './progressbar.ex.md.js';
export progressbarMD from './progressbar.md.js';
