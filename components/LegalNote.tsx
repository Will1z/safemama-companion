import { AlertTriangle } from 'lucide-react';

export function LegalNote() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> SafeMama gives general information only. It is not a diagnosis. 
          In an emergency, go to the nearest clinic.
        </p>
      </div>
    </div>
  );
}
