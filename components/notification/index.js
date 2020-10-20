import PropTypes from 'prop-types';
import React from 'react';
import _hotKeys from '../../lib/hotkeys.js';

class Notification extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    icon: PropTypes.string,
    className: PropTypes.string,
    close: PropTypes.func,
    actionText: PropTypes.string,
    actionUrl: PropTypes.string,
    wait: PropTypes.bool
  };
  componentDidMount() {
    this.HotKeys = new _hotKeys();
    this.HotKeys.register(['Escape'], 'notification', this.props.close, false, false, 'Clear current global notification.');
    this.HotKeys.register(['Enter'], 'notification', this.props.close, 'Clear current global notification.');
    if (!this.props.wait){
      setTimeout(this.props.close, 3000);
    }
  }
  componentWillUnmount() {
    this.HotKeys.nuke('notify');
  }
  render() {
    const {icon, className, message, close} = this.props;
    return <div className={`notification ${className}`}>
      {icon && <span className={`icon ${icon}`} />}
        {this.props.children}
        {this.props.actionUrl && 
          <span className="action">
            <a href={this.props.actionUrl}>
              {this.props.actionText}
            </a>
          </span>}
      {close && <span
        onClick={this.props.close}
        className="icon closex" />}
      </div>;
  }
}

class NotificationBody extends React.Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return <div className="notification-body">
      {this.props.children}
      </div>;
  }
}

Notification.Body = NotificationBody;

export default Notification;
