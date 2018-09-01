import React, { Component } from 'react';
import { isPast, isToday } from 'date-fns';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import New from './New';
import History from './History';
import Data from '../mock'; // NOTE: Dev
import '../css/App.css';
import Main from './Main';

class App extends Component {
  constructor() {
    super();
    this.state = {
      allData: [],
      current: [],
      history: [],
      page: 'main',
    };

    this.recalcData = this.recalcData.bind(this);
    this.saveNewItem = this.saveNewItem.bind(this);
    this.drillPageType = this.drillPageType.bind(this);
    this.drillDoneItem = this.drillDoneItem.bind(this);
    this.drillSaveItem = this.drillSaveItem.bind(this);
  }

  componentWillMount() {
    // Organize data into history and current.
    this.setState({ allData: Data }, this.recalcData);
  }

  saveNewItem(item) {
    // New item.
    this.setState((({ allData }) => {
      allData.push(item);
      return allData;
    }), this.recalcData);
    // BUG: Recalc dates isn't working?
  }

  drillSaveItem(newItem, oldItem = false) {
    // Ensure there was actually a change made.
    if (newItem.link !== oldItem.link || newItem.date !== oldItem.date || newItem.notes !== oldItem.notes) {
      const allData = this.state.allData.map(o => ({ ...o }));
      // Search for the oldItem, get the index.
      for (let i = 0; i < allData.length; ++i) {
        if (allData[i].link === oldItem.link) {
          // If we found it, update allData and recalc current / history.
          allData[i] = newItem;
          this.setState({ allData }, this.recalcData);
          return;
        }
      }
      throw new Error('drillSaveItem: Couldnt find item to save.');
    }
  }

  drillDoneItem(item) {
    // Search for item, mark it done (or not done).
    const allData = this.state.allData.map(o => ({ ...o }));
    for (let i = 0; i < allData.length; ++i) {
      if (allData[i].link === item.link) {
        allData[i].done = true;
        this.setState({ allData }, this.recalcData);
      }
    }
  }

  drillPageType(page) {
    // This is not properly changing navbar display.
    this.setState({ page });
  }

  recalcData() {
    // Function to recalc current and history.
    this.setState((({ allData }) => {
      const current = [];
      const history = [];
      allData.forEach((item) => {
        if (isToday(item.date) && !item.done) {
          current.push(item);
        } else if (isPast(item.date) || item.done) {
          history.push(item);
        } else current.push(item);
      });
      return { current, history };
    }));
  }

  render() {
    const { current, history, page } = this.state;

    // TODO: Replace switch with React Router implementation.
    return (
      <div className="App">
        <Navbar drillPageType={this.drillPageType} active={page} />
        {(() => {
          switch (page) {
            case 'main': return (
              <Main
                data={current}
                newBtn={(() => this.drillPageType('new'))}
                drillSaveItem={this.drillSaveItem}
                drillDoneItem={this.drillDoneItem}
              />
            );
            case 'history': return (
              <History
                data={history}
                drillDoneItem={this.drillDoneItem}
                drillSaveItem={this.drillSaveItem}
              />
            );
            case 'new': return (
              <New
                saveNewItem={this.saveNewItem}
                drillPageType={this.drillPageType}
              />
            );
            default: throw new Error('invalid page type on nav switch');
          }
        })()}
        <p className="footer">
          <a href="https://github.com/Egrodo">made by egrodo</a>
        </p>
      </div>
    );
  }
}

export default App;
