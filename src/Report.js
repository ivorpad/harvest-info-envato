import React, { Component } from "react";
import { AppContext } from "./App";
import ReportInner from './ReportInner'
import moment from "moment";
import { isoWeekdayCalc } from "moment-weekday-calc";
import getDays from "./helpers";
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
      this.fetchEntries(this.props.monthSelected);
    }
  };

  fetchEntries = current => {
    const firstDay = getDays(current).firstDay;
    const lastDay = getDays(current).lastDay;

    fetch(
      `https://api.harvestapp.com/v2/time_entries?from=${firstDay}&to=${lastDay}`,
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
  };

  render() {
    return (
      <AppContext.Consumer>
        {value => {
          return (
            <>
              <h3>{capitalize(value.monthSelected)} Report</h3>
              {!getDays().isFuture(value.monthSelected) ? <ReportInner
                data={this.state}
                monthSelected={value.monthSelected}
              /> : <h3>Hold on there, cowboy <span role="img" aria-label="cowboy">🤠</span>! You can't select a date in the future</h3>}
            </>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default Report;
