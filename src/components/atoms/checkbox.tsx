import React, { useState } from "react";

interface CheckboxData {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckboxProps {
  data: CheckboxData[];
  onChange: (id: string, checked: boolean) => void;
}

function Checkbox({ data, onChange }: CheckboxProps) {
  const [checkedState, setCheckedState] = useState<{ [id: string]: boolean }>(
    data.reduce((acc, item) => ({ ...acc, [item.id]: item.checked }), {})
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedState((prevCheckedState) => ({
      ...prevCheckedState,
      [id]: !prevCheckedState[id],
    }));
    onChange(id, !checkedState[id]);
  };

  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <input
            id={item.id}
            type="checkbox"
            checked={checkedState[item.id]}
            onChange={() => handleCheckboxChange(item.id)}
            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
          />
          <label htmlFor={item.id} className="text-sm text-gray-700">
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Checkbox;
