import { useState } from "react";
import { useTranslation } from "react-i18next";

type DynamicChecklistFieldProps = {
  label: string;
  placeholder?: string;
  values?: string[];
  onChange?: (items: string[]) => void;
};

const DynamicChecklistField = ({
  label,
  placeholder = "Enter item...",
  values = [],
  onChange,
}: DynamicChecklistFieldProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<string[]>(values);

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newItems = [...items, inputValue.trim()];
      setItems(newItems);
      setInputValue("");
      onChange?.(newItems);
    }
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="button"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          onClick={handleAdd}
        >
          {t("ADD")}
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${label}-${index}`}
              className="h-4 w-4 text-teal-600"
              checked
              readOnly
            />
            <label htmlFor={`${label}-${index}`} className="flex-1">
              {item}
            </label>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              {t("REMOVE")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicChecklistField;
