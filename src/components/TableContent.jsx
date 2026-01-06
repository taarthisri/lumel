export default function TableContent({
  row,
  child,
  handleInput,
  handleCalculations,
  input,
}) {
  const border = "border w-full h-full flex justify-center items-center";
  return (
    <>
      <p className={border}>{child ? `--${row.label}` : row.label}</p>
      <p className={border}>{row.value}</p>
      <div className={border}>
        <input
          type="number"
          value={input.id === row.id ? input.value : ""}
          className="border max-w-36 min-w-2"
          name={row.id}
          onChange={(e) => handleInput(e, row)}
        ></input>
      </div>
      <div className={border}>
        <button
          name="percent"
          className="bg-blue-400 border cursor-pointer w-14 m-2"
          onClick={(e) => handleCalculations(e)}
        >
          %
        </button>
      </div>
      <div className={border}>
        <button
          name="value"
          className=" bg-amber-300 border cursor-pointer w-14 m-2"
          onClick={(e) => handleCalculations(e)}
        >
          Value
        </button>
      </div>
      <p className={border}>{row?.variance ? row.variance : 0}%</p>
    </>
  );
}
