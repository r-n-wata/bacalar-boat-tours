// components/ProgressBar.tsx
export default function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Tour Selected", "Enter Details", "Confirmation"];

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, i) => (
        <div key={step} className="flex-1 flex flex-col items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
              i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </div>
          <p className="text-sm mt-2 text-center">{step}</p>
          {i < steps.length - 1 && (
            <div className="h-1 bg-gray-300 w-full mt-2 mb-4">
              <div
                className={`h-full ${
                  i + 1 < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
