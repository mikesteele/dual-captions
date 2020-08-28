import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './FancyHeader.css';
import cn from 'classnames';
import packageJson from '../../package.json';

const allSites = ['for YouTube', 'for Kanopy', 'for Netflix', 'for Disney+', `v${packageJson.version}`];

class FancyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      isDone: false,
    }
    this.changeText = this.changeText.bind(this);
  }

  changeText() {
    this.setState(prevState => {
      if (prevState.currentIndex < allSites.length) {
        return {
          currentIndex: prevState.currentIndex + 1,
          isDone: prevState.currentIndex + 1 === allSites.length
        };
      };
    });
  }

  componentDidMount() {
    window.setInterval(this.changeText, 1000);
  }

  render() {
    const { currentIndex, isDone } = this.state;
    const sites = allSites.slice(0, currentIndex).reverse();
    return (
      <div className={cn('fancy-header-wrapper', {['fancy-header-done']: isDone})}>
        <p>Dual Captions</p>
        <TransitionGroup className='group-wrapper'>
          {sites.map(site => (
            <CSSTransition key={site} timeout={0} classNames='fancy-header'>
              <div>{site}</div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}

export default FancyHeader;
