import React, { useEffect, useState } from "react";
import { getInventarioStock } from "../services/inventarioService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InventarioAdmin() {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    getInventarioStock()
      .then(data => setInventario(data))
      .catch(err => console.error("Error al obtener inventario:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Inventario General</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={inventario}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombreProducto" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stockActual" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}