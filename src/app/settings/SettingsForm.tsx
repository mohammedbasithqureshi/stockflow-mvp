"use client";

import { useActionState } from "react";
import { updateSettings } from "@/app/actions/settings";

export default function SettingsForm({ current }: { current: number }) {
  const [state, action, pending] = useActionState(updateSettings, undefined);

  return (
    <form action={action} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-md">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-700 bg-green-50 p-2 rounded">Settings saved.</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default low stock threshold
        </label>
        <input
          name="defaultLowStockThreshold"
          type="number"
          min={0}
          step={1}
          defaultValue={current}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used for products that have no threshold of their own.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
