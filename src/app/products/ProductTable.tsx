"use client";

import { useState } from "react";
import Link from "next/link";
import { adjustStock, deleteProduct } from "@/app/actions/products";

type Row = {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  sellingPrice: number | null;
  isLow: boolean;
};

export default function ProductTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    (r) => r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or SKU..."
        className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 mb-4 text-gray-900 bg-white"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Selling price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-gray-200">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.sku}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <form action={adjustStock}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="delta" value="-1" />
                      <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100">-</button>
                    </form>
                    <span className="w-8 text-center">{r.quantityOnHand}</span>
                    <form action={adjustStock}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="delta" value="1" />
                      <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100">+</button>
                    </form>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.isLow ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      Low stock
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.sellingPrice !== null ? r.sellingPrice.toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={"/products/" + r.id + "/edit"} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <form
                      action={deleteProduct}
                      onSubmit={(e) => {
                        if (!confirm("Delete " + r.name + "? This cannot be undone.")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={r.id} />
                      <button className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
