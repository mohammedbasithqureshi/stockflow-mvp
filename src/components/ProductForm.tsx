"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/app/actions/auth";

type Initial = {
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: number | null;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
};

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-gray-900";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function ProductForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl"
    >
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {state.error}
        </p>
      )}

      <div>
        <label className={labelClass}>Name *</label>
        <input name="name" required defaultValue={initial?.name ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>SKU *</label>
        <input name="sku" required defaultValue={initial?.sku ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Quantity on hand</label>
          <input
            name="quantityOnHand"
            type="number"
            min={0}
            step={1}
            defaultValue={initial?.quantityOnHand ?? 0}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Low stock threshold</label>
          <input
            name="lowStockThreshold"
            type="number"
            min={0}
            step={1}
            placeholder="Uses default"
            defaultValue={initial?.lowStockThreshold ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cost price</label>
          <input
            name="costPrice"
            type="number"
            min={0}
            step="any"
            defaultValue={initial?.costPrice ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Selling price</label>
          <input
            name="sellingPrice"
            type="number"
            min={0}
            step="any"
            defaultValue={initial?.sellingPrice ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <Link
          href="/products"
          className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
