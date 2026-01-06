import React from "react";

export default function TableHeader({ heading }) {
  return (
    <React.Fragment>
      {heading.map((value) => (
        <h1 key={value} className="font-bold py-2 px-1 border w-full">
          {value}
        </h1>
      ))}
    </React.Fragment>
  );
}
