import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './FancyHeader.css';

const allSites = ['', 'for Youtube', 'for Kanopy', 'for Netflix', 'for Disney+', 'v2.6.4'];

class FancyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    }
    this.changeText = this.changeText.bind(this);
  }

  changeText() {
    this.setState(prevState => {
      if (prevState.currentIndex < allSites.length) {
        return {
          currentIndex: prevState.currentIndex + 1,
        };
      } else {
        return {
          currentIndex: prevState.currentIndex
        }
      };
    });
  }

  componentDidMount() {
    window.setInterval(this.changeText, 1000);
  }

  render() {
    const { currentIndex } = this.state;
    const sites = allSites.slice(0, currentIndex).reverse();
    return (
      <div className='fancy-header-wrapper'>
        <TransitionGroup>
          {sites.map(site => (
            <CSSTransition key={site} timeout={200} classNames='fancy-header'>
              <div>{site}</div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}

export default FancyHeader;
