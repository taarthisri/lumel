import React, { useMemo, useState } from "react";
import TableContent from "../src/components/TableContent";
import "./App.css";
import TableHeader from "./components/TableHeader";

const initialData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500, //this value needs to be calculated from the children values (800+700)
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000, //this need to be calculated from the children values (300+700)
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
        },
      ],
    },
  ],
};

const heading = [
  "Label",
  "Value",
  "Input",
  "Allocation %",
  "Allocation val",
  "Variance",
];

function App() {
  const [data, setData] = useState(initialData);
  const [input, setInput] = useState({});

  const handleInput = (e, row) => {
    setInput({ id: e.target.name, value: e.target.value, row: row });
  };

  const handleCalculations = (e) => {
    const updatedData = data.rows.map((row) => {

      // calculates when the parent input is changed
      if (row.id === input.id) {
        return handleParentChange(e, row);
      }

      // returns the same for unchanged row
      if (!row.children.some((child) => child.id !== input.id)) return row;

      // calculates when the child input is changed
      return handleChildChange(e, row);
    });
    setData({ rows: updatedData });
    setInput({});
  };

  const handleParentChange = (e, row) => {
    const inputNumber = Number(input.value);
    const updatedRow = calculatePercentValue(e, row);
    const baseValue =
      e.target.name === "value" ? inputNumber : updatedRow.value;

    const updatedRowWithChildren = row.children.map((child) => {
      return {
        ...child,
        value: (child.value / row.value) * baseValue,
      };
    });
    return { ...updatedRow, children: updatedRowWithChildren };
  };

  const handleChildChange = (e, row) => {
    let parentTotal = 0;
    const updatedChild = row.children.map((child) => {
      let updateChild;
      if (child.id === input.row.id) {
        updateChild = calculatePercentValue(e, child);
      } else {
        updateChild = { ...child };
      }
      parentTotal += Number(updateChild.value);
      return updateChild;
    });

    const updatedRow = {
      ...row,
      value: parentTotal,
      children: updatedChild,
      variance: calculateVariance(row, parentTotal),
    };
    return updatedRow;
  };

  const calculatePercentValue = (e, row) => {
    const inputNumber = Number(input.value);
    let updatedValue, variance;
    if (e.target.name === "value") {
      updatedValue = inputNumber;
      calculateVariance(row, inputNumber);
    } else {
      updatedValue = row.value + (inputNumber / 100) * row.value;
      variance = inputNumber;
    }
    return { ...row, value: updatedValue.toFixed(2), variance: variance };
  };

  const calculateVariance = (row, inputNumber) => {
    return Number((((inputNumber - row.value) / row.value) * 100).toFixed(2));
  };

  const grandTotal = data.rows.reduce((accum, currentData) => {return accum += currentData.value}, 0)

  return (
    <div className="grid grid-cols-6 w-auto min-w-2xl items-center justify-items-center">
      <TableHeader heading={heading} />
      {data.rows.map((row) => {
        return (
          <React.Fragment key={row.id}>
            <TableContent
              row={row}
              handleInput={handleInput}
              handleCalculations={handleCalculations}
              input={input}
            />
            {row.children.map((subrow) => {
              return (
                <TableContent
                  key={subrow.id}
                  row={subrow}
                  child
                  handleInput={handleInput}
                  handleCalculations={handleCalculations}
                  input={input}
                />
              );
            })}
          </React.Fragment>
        );
      })}
      <p className="py-2 ">Grand Total</p>
      <p>{grandTotal}</p>
    </div>
  );
}

export default App;
