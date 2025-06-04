import React from "react";
import clsx from "clsx";

interface PasswordStrengthMeterProps {
  password: string;
}

const getStrength = (password: string): { score: number; label: string } => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Weak";
  if (score >= 3) label = "Strong";
  else if (score === 2) label = "Medium";

  return { score, label };
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const { score, label } = getStrength(password);

  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
  const meterColor = strengthColors[Math.min(score - 1, 2)] || "bg-gray-300";

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={clsx("h-full transition-all duration-300", meterColor)}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
      <p className="text-sm mt-1 text-gray-600">Strength: {label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
