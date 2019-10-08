import React, { Component, createContext } from 'react'
import { AppContext } from './App'
export const FormContext = createContext()
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export class Form extends Component {

  render() {

    return (
      <AppContext.Consumer>

        {(value) => (
          <>
            <h2>Select month:</h2>
            <form>
              <select
                value={value.monthSelected}
                onChange={e => {
                  const selected = e.target.selectedOptions[0].value;
                  value.setMonth(selected)
                }}
                style={{ fontSize: "24px" }}
              >
                {months.map((month, index) => <option key={index} value={month.toLowerCase()}> {month} </option>)}
              </select>
            </form>
          </>
        )}
      </AppContext.Consumer>
    )
  }
}

export default Form
