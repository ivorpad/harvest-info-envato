import React, { Component } from 'react';
import './App.css';
import moment from 'moment'
import {isoWeekdayCalc} from 'moment-weekday-calc'
require("dotenv").config();

class App extends Component {
  state = {
    time_entries: [],
  };

  componentDidMount = () => {
    fetch(`https://api.harvestapp.com/v2/time_entries`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HARVEST_ACCESS_TOKEN}`,
        "User-Agent": "Harvest API Example",
        "Harvest-Account-ID": `${process.env.REACT_APP_HARVEST_ACCOUNT_ID}`
      }
    })
      .then(r => r.json())
      .then(data => {
        const { time_entries } = data;

        this.setState({ time_entries });
      });
  };

  render() {

    
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const currentMonthEntries = this.state.time_entries.filter((
      {
        spent_date 
      }) => {
        return moment(spent_date).isBetween(firstDay - 1, lastDay)
      })
      
    console.log(process.env);
    const workingDays = moment().isoWeekdayCalc({
      rangeStart: firstDay,
      rangeEnd: lastDay,
      weekdays: [1, 2, 3, 4, 5]
    });

    const restOfDays = moment().isoWeekdayCalc({
      rangeStart: date,
      rangeEnd: lastDay,
      weekdays: [1, 2, 3, 4, 5]
    });

    const hoursWorkedCurrentMonth = currentMonthEntries.reduce((acc, {hours}) => {
      return hours + acc;
    }, 0);

    return <div className="App">
        <header className="App-header">
          <h1>Current month: {moment(new Date()).format("MMMM")}</h1>
          <p>
            The number of hours to work this month is {workingDays * 8} hrs.
          </p>

          <p>
            The number of hours that you have worked this month is{" "}
            {hoursWorkedCurrentMonth === 0
              ? "loading..."
              : parseFloat(hoursWorkedCurrentMonth).toFixed(2)}
            {" "}hrs.
          </p>

          <p>
            
            You need to work{" "}
            {hoursWorkedCurrentMonth === 0
              ? "loading..."
              : parseFloat(
                  workingDays * 8 - hoursWorkedCurrentMonth
                ).toFixed(2)}
          {" "}hours to finish this month
          </p>

          <p>        
            If you keep this pace you will need to work {hoursWorkedCurrentMonth === 0 ? 'loading...' : parseFloat((workingDays * 8 - hoursWorkedCurrentMonth) / restOfDays).toFixed(2)}
            hrs daily to set your goal.
          </p>

        <h2>Earnings: {hoursWorkedCurrentMonth === 0
          ? "counting cash..."
          : '$' + parseFloat(hoursWorkedCurrentMonth).toFixed(2) * 32}</h2>
        </header>
      </div>;
  }
}

export default App;
