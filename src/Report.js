import React, { Component } from 'react'
import { AppContext } from './App'
import moment from "moment";
import { isoWeekdayCalc } from "moment-weekday-calc";
const currentMonth = moment.months(moment().month()).toLowerCase();

const capitalize = (string = "") =>
  [...string]
    .map(
      //convert to array with each item is a char of string by using spread operator (...)
      (char, index) => (index ? char : char.toUpperCase()) // index true means not equal 0 , so (!index) is the first char which is capitalized by `toUpperCase()` method
    )
    .join("");

export class Report extends Component {

  state = {
    time_entries: [],
    isLoading: true
  };

  componentDidMount = () => {
    this.setState({
      monthSelected: currentMonth
    });
    this.fetchEntries(currentMonth);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.monthSelected !== this.props.monthSelected) {
      this.setState({
        isLoading: true
      });
      this.fetchEntries(this.props.monthSelected)
    }
  };

  fetchEntries = (current) => {
    const firstDayOfMonth = moment()
      .month(current)
      .startOf("month")
      .format("YYYY-MM-DD");
    const lastDayOfMonth = moment()
      .month(current)
      .endOf("month")
      .format("YYYY-MM-DD");

    fetch(
      `https://api.harvestapp.com/v2/time_entries?from=${firstDayOfMonth}&to=${lastDayOfMonth}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HARVEST_ACCESS_TOKEN}`,
          "User-Agent": "Harvest Envato",
          "Harvest-Account-ID": `${process.env.REACT_APP_HARVEST_ACCOUNT_ID}`
        }
      }
    )
      .then(r => r.json())
      .then(data => {
        const { time_entries } = data;
        this.setState({ time_entries, isLoading: false });
      });
  }

  render() {

    console.log(this.props)
    return (
      <AppContext.Consumer>
        {value => {

          const firstDay = moment()
            .month(value.monthSelected)
            .startOf("month")
            .format("YYYY-MM-DD");

          const lastDay = moment()
            .month(value.monthSelected)
            .endOf("month")
            .format("YYYY-MM-DD");

          const workingDays = moment().isoWeekdayCalc({
            rangeStart: firstDay,
            rangeEnd: lastDay,
            weekdays: [1, 2, 3, 4, 5]
          });

          const restOfDays = moment().isoWeekdayCalc({
            rangeStart: new Date(),
            rangeEnd: lastDay,
            weekdays: [1, 2, 3, 4, 5]
          });

          const hoursWorkedCurrentMonth = this.state.time_entries.reduce(
            (acc, { hours }) => {
              return hours + acc;
            },
            0
          );

          return(
            <>
              <h3>{capitalize(value.monthSelected)} Report</h3>
              {!this.state.isLoading ? (
                <>
                  <p>
                    The number of hours to work this month is {workingDays * 8} hrs.
              </p>

                  <p>
                    The number of hours that you have worked this month is{" "}
                    <b>
                      {hoursWorkedCurrentMonth === 0
                        ? "loading..."
                        : parseFloat(hoursWorkedCurrentMonth).toFixed(2)}{" "}
                      hrs.
                </b>
                  </p>

                  {hoursWorkedCurrentMonth > workingDays * 8 ? (
                    <h2>
                      Congratulations{" "}
                      <span role="img" aria-label="party">
                        🎉
                  </span>
                    </h2>
                  ) : (
                      <>
                        <p>
                          You need to work{" "}
                          {hoursWorkedCurrentMonth === 0
                            ? "loading..."
                            : parseFloat(
                              workingDays * 8 - hoursWorkedCurrentMonth
                            ).toFixed(2)}{" "}
                          hours to finish this month
                  </p>

                        <p>
                          If you keep this pace you will need to work {" "}
                          {hoursWorkedCurrentMonth === 0
                            ? "loading..."
                            : parseFloat(
                              (workingDays * 8 - hoursWorkedCurrentMonth) /
                              restOfDays
                            ).toFixed(2)}
                          hrs daily to set your goal.
                  </p>
                      </>
                    )}

                  <h2>
                    Earnings:{" "}
                    {hoursWorkedCurrentMonth === 0
                      ? "counting cash..."
                      : "$" + parseFloat(hoursWorkedCurrentMonth).toFixed(2) * 32}
                  </h2>
                </>
              ) : (
                  "Loading..."
                )}

            </>
          )
        }}
      </AppContext.Consumer>
    )
  }
}

export default Report
