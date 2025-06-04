import React from "react";

interface LabelProps {
  name: string;
  forInput: string;
}

function Label({ name, forInput }: LabelProps) {
  return (
    <label
      htmlFor={forInput}
      className="block mb-1 text-sm font-medium text-gray-700"
    >
      {name}
    </label>
  );
}

export default Label;
