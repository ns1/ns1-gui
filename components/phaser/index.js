import React from 'react';
import PropTypes from 'prop-types';
// this is a special component, should probably put it in the boots dir actually
import resource from '../../resource';
export class Phaser extends React.Component {
  static propTypes = {
    phases: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props);
  }
  next(){}
  render(){
    const {phases, active} = this.props;
    const phase = phases[active];
    const activeIndex = Object.keys(phases).indexOf(active);
    return <div className="phaser flex-wrap">
      <div className="flex-third">
        <ol className="toc">
          {Object.keys(phases).map((pk, idx) => {
            return <li key={pk} className={idx <= activeIndex && 'active' || ''}>Step {idx + 1}: {phases[pk].title}</li>;
          })}
        </ol>
      </div>
      <div className="phase-body flex-two-third">
        <div className="phase-header">
          <div className="left">
            <span className="stepno flex-one">Step {activeIndex + 1}</span>
            <span className="steptitle">{phase.title}</span>
          </div>
          {(phase.next || phase.extra) &&
            <div className="right">
              {phase.extra && !phase.extra.download && phase.extra.onClick &&
                <button
                  disabled={phase.extra.condition ?
                    phase.extra.condition() :
                    false}
                  className="button tertiary short flex-one inline right gutter-right extra"
                  onClick={phase.extra.onClick}>{phase.extra.title}</button>}
              {phase.extra && phase.extra.download &&
                <a
                  href={phase.extra.download}
                  download={'ns1_ddi.json'}
                  onClick={phase.extra.onClick}
                  target='_blank'
                  className="button tertiary short flex-one inline right gutter-right">
                  {phase.extra.title}
                </a>}
              {(phase.next && phase.next.href) && phase.next.condition() ?
                <a
                  className="button tertiary short flex-one inline right continue"
                  href={phase.next.href}>Continue</a> :
                (phase.next && phase.next.onClick) && phase.next.condition() ?
                  <a
                    className="button tertiary short flex-one inline right continue"
                    onClick={phase.next.onClick}>Continue</a> :
                  phase.next && phase.next.href && <button
                    className="button tertiary short flex-one inline right continue"
                    disabled={true}>Continue</button>}
              {phase.next &&
                !phase.next.href &&
                !phase.next.onClick &&
                <button
                  className="button tertiary short flex-one inline right continue"
                  onClick={() => resource.boots.phase.set(phase.next.phase)}
                  disabled={!phase.next.condition()}>Continue</button>}
            </div>}
        </div>
        {phase.component}
      </div>
    </div>;
  }
}
