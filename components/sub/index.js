import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router';

class Sub extends React.Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        exact: PropTypes.bool,
        component: PropTypes.any,
        path: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(PropTypes.shape({
          exact: PropTypes.bool,
          component: PropTypes.any.isRequired,
          path: PropTypes.string.isRequired,
          button: PropTypes.shape({
            onClick: PropTypes.func.isRequired,
            text: PropTypes.string.isRequired
          })
        })),
        button: PropTypes.shape({
          onClick: PropTypes.func.isRequired,
          text: PropTypes.string.isRequired
        })
      }), PropTypes.bool])).isRequired,
    children: PropTypes.any,
    match: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.subsubActive = this.subsubActive.bind(this);
  }
  subsubActive(path, child){

    return path.indexOf(child.path) > -1;
  }
  render(){
    const {routes, button} = this.props;
    const fr = routes.filter(a => a);
    const active = routes && fr.find(r => this.props.location.pathname.replace(/\//g, '').includes(r.path.split(':')[0].replace(/\//g, '')));
    const path = this.props.location.pathname;
    return active ?
      <div className="subnav-wrap">
        <div className="subnav">
          <div className="bunder-container">
            <div className="links">
              {fr.filter(a=>!a.hidden).map(route =>
                <a
                  id={`${route.nav.toLowerCase().replace(' ', '-')}-subnav`}
                  key={route.path}
                  className={active.path === route.path ? 'active' : 'inactive'}
                  href={`#${route.path.split(':')[0]}`}>{route.nav}</a>
              )}
            </div>
            <h2>{active.full}
              {active.children && active.children.filter(r =>
                this.props.location.pathname.replace(/\//g, '')
                  .includes(r.path.split(':')[0].replace(/\//g, ''))).map(c => {
                return c.button ?
                  <button
                    key={c.button.text}
                    style={{float: 'right'}}
                    className="primary button inline new"
                    onClick={c.button.onClick}>{c.button.text}</button> :
                  false;
              })}
              {active.button &&
                <button style={{float: 'right'}} className="primary button inline new" onClick={active.button.onClick}>{active.button.text}</button>}
            </h2>
            <div className="subsub">
              {active.children && active.children.filter(child => child.tabnav).map(child => {
                return <a
                  key={child.path}
                  className={this.subsubActive(this.props.location.pathname, child) ? 'active' : ''}
                  id={`${child.name.toLowerCase().replace(' ', '-')}-subnav`}
                  href={`/#${child.path}`}>
                  {child.name}
                </a>;
              })}
            </div>
          </div>
        </div>
        <Switch>
          {fr.filter(r => r.component).map(route =>
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact || false}
              component={route.component} />)}
          {active.children && active.children.filter(children => children.component).map(route => {
            return <Route
              key={route.path}
              path={route.path}
              exact={route.exact || false}
              component={route.component} />;
          })}
        </Switch>
      </div> :
      '';
  }
}

export default withRouter(Sub);
