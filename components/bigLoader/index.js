import React from 'react';
import Loader from './loader';
export default class BigLoader extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    const {
      className,
      loadingText,
      details,
      loading,
      warn,
      warnText,
      noData,
      noDataText
    } = this.props;
    return <div className="bl-wrapper">
        <div className={`big-loader ${className} flex-wrap vert-middle`}>
          {loading &&
            <div className="loading vert-middle flex-whole">
              <h3>{loadingText}</h3>
              {details && <h4>{details}</h4>}
              <Loader />
            </div>}
          {noData &&
            <div className="no-data vert-middle flex-whole">
              <h3>{noDataText}</h3>
            </div>}
          {warn &&
            <div className="warning vert-middle flex-whole">
              <h3>{warnText}</h3>
            </div>}
      </div>
    </div>;
  }
}
