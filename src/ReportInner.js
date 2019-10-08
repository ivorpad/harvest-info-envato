import React from "react";
import getDays from "./helpers";
import moment from "moment";


export default function ReportInner({ data, monthSelected }) {

  const firstDay = getDays(monthSelected).firstDay;
  const lastDay = getDays(monthSelected).lastDay;

  const workingDays = moment().isoWeekdayCalc({
    rangeStart: firstDay,
    rangeEnd: lastDay,
    weekdays: [1, 2, 3, 4, 5]
  });

  const restOfDays = getDays().restOfDays;

  const hoursWorkedCurrentMonth = data.time_entries.reduce(
    (acc, { hours }) => {
      return hours + acc;
    },
    0
  );

  return (
    <>
      {!data.isLoading ? (
        <>
          <p>
            The number of hours to work this month is <b>{workingDays * 8} hours</b> .
          </p>

          <p>
            The number of hours that you have worked this month is{" "}
            <b>
              {parseFloat(hoursWorkedCurrentMonth).toFixed(2)} hours.
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
                  <b>{parseFloat(workingDays * 8 - hoursWorkedCurrentMonth).toFixed(2)} hours</b> to finish this month
              </p>

                <p>
                  If you keep this pace you will need to work{" "}
                  <b> {parseFloat((workingDays * 8 - hoursWorkedCurrentMonth) / restOfDays).toFixed(2)} hours</b> daily to set your goal.
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
  );
}
