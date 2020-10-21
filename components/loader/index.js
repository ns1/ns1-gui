import React from 'react';
class LoaderComp extends React.Component{
  render(){
    return <div
      className="loader">
      <span className="loader-dot">.</span>
      <span className="loader-dot">.</span>
      <span className="loader-dot">.</span>
    </div>;
  }
}
export default LoaderComp;
export const Loader = LoaderComp;
export loaderMD from './loader.md.js';
export loaderEX from './loader.ex.md.js'
