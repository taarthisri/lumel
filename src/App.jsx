import { useState, useMemo, Fragment } from "react";

const initialData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      originalValue: 1500,
      children: [
        { id: "phones", label: "Phones", value: 800, originalValue: 800 },
        { id: "laptops", label: "Laptops", value: 700, originalValue: 700 },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      children: [
        { id: "tables", label: "Tables", value: 300, originalValue: 300 },
        { id: "chairs", label: "Chairs", value: 700, originalValue: 700 },
      ],
    },
  ],
};

export default function App() {
  const [data, setData] = useState(initialData);
  const [inputs, setInputs] = useState({});

  const calculateRows = (rows) =>
    rows.map((row) => {
      if (row.children) {
        const children = calculateRows(row.children);
        const total = children.reduce((sum, c) => sum + c.value, 0);
        const variance =
          ((total - row.originalValue) / row.originalValue) * 100;
        return { ...row, children, value: total, variance };
      }
      const variance =
        ((row.value - row.originalValue) / row.originalValue) * 100;
      return { ...row, variance };
    });

  const calculatedRows = useMemo(() => calculateRows(data.rows), [data]);

  const handleInput = (id, value) =>
    setInputs((prev) => ({ ...prev, [id]: value }));

  const updatePct = (id, rows = data.rows) => {
    const pct = Number(inputs[id]);
    if (isNaN(pct)) return rows;
    const updated = rows.map((row) => {
      if (row.id === id) {
        if (row.children) {
          const children = row.children.map((child) => ({
            ...child,
            value: child.value * (1 + pct / 100),
          }));
          const total = children.reduce((sum, c) => sum + c.value, 0);
          return { ...row, children, value: total };
        }
        return { ...row, value: row.value * (1 + pct / 100) };
      } else if (row.children) {
        return { ...row, children: updatePct(id, row.children) };
      }
      return row;
    });
    setData({ rows: updated });
    setInputs((prev) => ({ ...prev, [id]: "" }));
    return updated;
  };

  const updateVal = (id, rows = data.rows) => {
    const val = Number(inputs[id]);
    if (isNaN(val)) return rows;
    const updated = rows.map((row) => {
      if (row.id === id) {
        if (row.children) {
          const totalChildren = row.children.reduce(
            (sum, c) => sum + c.value,
            0,
          );
          const ratio = totalChildren ? val / totalChildren : 1;
          const children = row.children.map((child) => ({
            ...child,
            value: child.value * ratio,
          }));
          return { ...row, children, value: val };
        }
        return { ...row, value: val };
      } else if (row.children) {
        return { ...row, children: updateVal(id, row.children) };
      }
      return row;
    });
    setData({ rows: updated });
    setInputs((prev) => ({ ...prev, [id]: "" }));
    return updated;
  };

  const grandTotal = calculatedRows.reduce((sum, r) => sum + r.value, 0);

  const renderRows = (rows, level = 0) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr className={level === 0 ? "bg-gray-50 font-semibold" : ""}>
          <td
            className="border p-2 pl-4"
            style={{ paddingLeft: `${level * 20 + 8}px` }}
          >
            {level > 0 ? "-- " : ""}
            {row.label}
          </td>
          <td className="border p-2 text-right">{row.value.toFixed(2)}</td>
          <td className="border p-2 text-center">
            <input
              type="number"
              value={inputs[row.id] || ""}
              placeholder={level === 0 ? "%" : "val"}
              onChange={(e) => handleInput(row.id, e.target.value)}
              className="w-20 rounded border px-2 py-1 text-right"
            />
          </td>
          <td className="border p-2 text-right space-x-1">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => updatePct(row.id)}
            >
              %
            </button>
            <button
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => updateVal(row.id)}
            >
              val
            </button>
          </td>
          <td
            className="border p-2 text-right"
          >
            {row.variance.toFixed(2)}%
          </td>
        </tr>
        {row.children && renderRows(row.children, level + 1)}
      </Fragment>
    ));

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="p-6 bg-white shadow-lg rounded w-full max-w-4xl">
        <table className="w-full border border-gray-300 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Label</th>
              <th className="border p-2 text-right">Value</th>
              <th className="border p-2 text-center">Input</th>
              <th className="border p-2 text-right">Actions</th>
              <th className="border p-2 text-right">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(calculatedRows)}
            <tr className="bg-gray-200 font-bold">
              <td className="border p-2">Grand Total</td>
              <td className="border p-2 text-right">{grandTotal.toFixed(2)}</td>
              <td className="border p-2 text-center">—</td>
              <td className="border p-2 text-right">—</td>
              <td className="border p-2 text-right">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
