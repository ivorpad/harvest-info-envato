import React, { Component, createContext } from "react";
import "./App.css";
import Form from './Form'
import Report from './Report';
import moment from "moment";
require("dotenv").config();

const currentMonth = moment.months(moment().month()).toLowerCase();

export const AppContext = createContext({
  monthSelected: '',
  setMonth: () => {}
});

class App extends Component {

  setMonth = (month) => {
    this.setState({
      monthSelected: month
    })
  }

  state = {
    monthSelected: '',
    setMonth: this.setMonth
  }

  componentDidMount = () => {
    this.setState({
      monthSelected: currentMonth
    });
  }

  render() {

    return (
        <div className="App">
          <header className="App-header">
          <AppContext.Provider value={this.state}>
            <Form />
            <Report monthSelected={this.state.monthSelected} />
          </AppContext.Provider>
          </header>
        </div>
    );
  }
}

export default App;
