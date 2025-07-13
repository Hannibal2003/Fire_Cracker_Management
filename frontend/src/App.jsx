import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 


const initialProduct = {
  product_name: "",
  rate: "",
  discount: "",
  packing: "",
  gst: "",
  purchase_rate: "",
  piece_weight: "",
  profit_percent: "",
};

function App() {
  const [form, setForm] = useState({
    q_date: "",
    supplier: "",
    products: [initialProduct],
  });

  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuotations = async () => {
    const res = await axios.get(`http://localhost:8000/quotations`, {
      params: { search },
    });
    setQuotations(res.data);
  };

  useEffect(() => {
    fetchQuotations();
  }, [search]);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const updatedProducts = [...form.products];
      updatedProducts[index][e.target.name] = e.target.value;
      setForm({ ...form, products: updatedProducts });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addProduct = () => {
    setForm({ ...form, products: [...form.products, initialProduct] });
  };

  const removeProduct = (index) => {
    const updatedProducts = [...form.products];
    updatedProducts.splice(index, 1);
    setForm({ ...form, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/quotations", form);
      setForm({ q_date: "", supplier: "", products: [initialProduct] });
      fetchQuotations();
    } catch (err) {
      alert("Validation Error");
    }
  };

  const downloadCSV = () => {
    window.open("http://localhost:8000/quotations/export", "_blank");
  };

 const downloadPDF = () => {
  const doc = new jsPDF();

  doc.text("Firecracker Quotations Report", 14, 10);

  const tableData = quotations.flatMap(q =>
    q.products.map(p => [
      q.id,
      q.q_date,
      q.supplier,
      p.product_name,
      p.rate,
      p.discount,
      p.packing,
      p.gst,
      p.purchase_rate,
      p.piece_weight,
      p.profit_percent
    ])
  );

  autoTable(doc, {
    head: [[
      "Quotation ID", "Date", "Supplier", "Product Name",
      "Rate", "Discount", "Packing", "GST",
      "Purchase Rate", "Weight", "Profit %"
    ]],
    body: tableData,
    startY: 20
  });

  doc.save("quotations.pdf");
};


  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔥 Firecracker Quotation Manager</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow mb-6">
        <div className="mb-2">
          <input name="q_date" value={form.q_date} onChange={handleChange} type="date" className="border p-2 mr-2" required />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier Name" className="border p-2" required />
        </div>

        {form.products.map((p, idx) => (
          <div key={idx} className="grid grid-cols-9 gap-2 mb-2">
            {Object.keys(initialProduct).map((key) => (
              <input
                key={key}
                name={key}
                value={p[key]}
                onChange={(e) => handleChange(e, idx)}
                placeholder={key.replace("_", " ")}
                className="border p-2 text-sm"
                type={key === "product_name" ? "text" : "number"}
                step="any"
              />
            ))}
            {form.products.length > 1 && (
              <button type="button" onClick={() => removeProduct(idx)} className="text-red-500 font-bold">X</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProduct} className="bg-yellow-500 text-white px-4 py-1 mb-4">+ Add Product</button>
        <br />
        <button className="bg-blue-600 text-white px-6 py-2 rounded">Save Quotation</button>
      </form>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by supplier or date"
          className="border px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded">Download CSV</button>
        <button onClick={downloadPDF} className="bg-red-600 text-white px-4 py-2 rounded">Download PDF</button>
      </div>

      <div className="overflow-x-auto bg-white p-4 shadow">
        
        {quotations.map((q) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">
              #{q.id} | {q.q_date} | {q.supplier}
            </h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1 text-xs">Product</th>
                  <th className="border p-1 text-xs">Rate</th>
                  <th className="border p-1 text-xs">Discount</th>
                  <th className="border p-1 text-xs">Packing</th>
                  <th className="border p-1 text-xs">GST</th>
                  <th className="border p-1 text-xs">Purchase Rate</th>
                  <th className="border p-1 text-xs">Weight</th>
                  <th className="border p-1 text-xs">Profit %</th>
                </tr>
              </thead>
              <tbody>
                {q.products.map((p, i) => (
                  <tr key={i}>
                    <td className="border p-1 text-xs">{p.product_name}</td>
                    <td className="border p-1 text-xs">{p.rate}</td>
                    <td className="border p-1 text-xs">{p.discount}</td>
                    <td className="border p-1 text-xs">{p.packing}</td>
                    <td className="border p-1 text-xs">{p.gst}</td>
                    <td className="border p-1 text-xs">{p.purchase_rate}</td>
                    <td className="border p-1 text-xs">{p.piece_weight}</td>
                    <td className="border p-1 text-xs">{p.profit_percent}</td>
                  </tr>
                ))}
                 <button
        onClick={async () => {
          if (window.confirm("Are you sure you want to delete this quotation?")) {
            await axios.delete(`http://localhost:8000/quotations/${q.id}`);
            fetchQuotations();
          }
        }}
        className="text-red-600 font-bold"
      >
        🗑 Delete
      </button>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}


export default App;
