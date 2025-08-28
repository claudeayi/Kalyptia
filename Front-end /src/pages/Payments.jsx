import { useState } from "react";
import { payWithStripe, payWithPayPal, payWithCinetPay } from "../api/payment";

export default function Payments() {
  const [form, setForm] = useState({ datasetId: "", amount: "", currency: "USD" });
  const [response, setResponse] = useState(null);

  const handleStripe = async () => {
    const res = await payWithStripe(form);
    setResponse(res.data);
  };

  const handlePayPal = async () => {
    const res = await payWithPayPal(form);
    setResponse(res.data);
  };

  const handleCinetPay = async () => {
    const res = await payWithCinetPay(form);
    setResponse(res.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💳 Paiements</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="ID Dataset"
          className="p-2 border rounded"
          value={form.datasetId}
          onChange={(e) => setForm({ ...form, datasetId: e.target.value })}
        />
        <input
          type="number"
          placeholder="Montant"
          className="p-2 border rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        >
          <option value="USD">USD</option>
          <option value="XAF">XAF</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button onClick={handleStripe} className="bg-blue-600 text-white px-4 py-2 rounded">
          Payer par Stripe
        </button>
        <button onClick={handlePayPal} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Payer par PayPal
        </button>
        <button onClick={handleCinetPay} className="bg-green-600 text-white px-4 py-2 rounded">
          Payer par CinetPay
        </button>
      </div>

      {response && (
        <pre className="mt-6 bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
