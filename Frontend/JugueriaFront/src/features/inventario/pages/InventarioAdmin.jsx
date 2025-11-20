import React, { useEffect, useState } from "react";
import {
  getStockPorInsumo,
  getValorTotalInventario,
  addInsumo,
  updateInsumo,
  deleteInsumo,
} from "../services/inventarioService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../../styles/InventarioAdmin.css";

export default function InventarioAdmin() {
  const [insumos, setInsumos] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [insumoActual, setInsumoActual] = useState({
    id: null,
    nombre: "",
    stock: 0,
    stockMin: 5,
    costo: 0,
  });

  // === Cargar datos ===
  const cargarDatos = async () => {
    try {
      const stockData = await getStockPorInsumo();

      const insumosNormalizados = stockData.map((item, index) => ({
        id: item.id ?? index,
        nombre: item.nombre ?? "Sin nombre",
        stock: Number(item.stock ?? 0),
        stockMin: Number(item.stockMin ?? 5),
        costo: Number(item.costo ?? 0),
      }));

      setInsumos(insumosNormalizados);

      const valor = await getValorTotalInventario();
      const total = valor?.valorTotalInventario ?? 0;
      setValorTotal(total);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // === Validaciones en tiempo real ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    // No permitir caracteres especiales ni espacios en nombre
    if (name === "nombre") {
      const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]+$/;
      if (!regex.test(value) && value !== "") return;
    }

    // No permitir valores negativos ni NaN en números
    if (["stock", "stockMin", "costo"].includes(name)) {
      const num = Number(value);
      if (isNaN(num) || num < 0) return;
    }

    setInsumoActual({ ...insumoActual, [name]: value });
  };

  // === Guardar con validaciones ===
  const handleGuardar = async () => {
    try {
      const { nombre, stock, stockMin, costo } = insumoActual;

      // Validaciones antes de guardar
      if (!nombre.trim()) {
        alert(
          "El nombre no puede estar vacío ni contener caracteres inválidos."
        );
        return;
      }
      if (stock < 0) {
        alert("El stock no puede ser negativo.");
        return;
      }
      if (stockMin < 5) {
        alert("El stock mínimo debe ser al menos 5 unidades.");
        return;
      }
      if (costo < 0) {
        alert("El costo no puede ser negativo.");
        return;
      }

      const payload = {
        nombre: nombre.trim(),
        stock: Number(stock),
        stockMin: Number(stockMin),
        costo: Number(costo),
      };

      if (modoEdicion && insumoActual.id) {
        await updateInsumo(insumoActual.id, payload);
      } else {
        await addInsumo(payload);
      }

      setShowModal(false);
      await cargarDatos();
    } catch (err) {
      console.error("Error al guardar insumo:", err);
      alert("Error al guardar el insumo. Revisa los datos o el servidor.");
    }
  };

  // === Editar ===
  const handleEditar = (insumo) => {
    setModoEdicion(true);
    setInsumoActual(insumo);
    setShowModal(true);
  };

  // === Eliminar ===
  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este insumo?")) {
      await deleteInsumo(id);
      await cargarDatos();
    }
  };

  // === Agregar ===
  const handleAgregar = () => {
    setModoEdicion(false);
    setInsumoActual({
      id: null,
      nombre: "",
      stock: 0,
      stockMin: 5,
      costo: 0,
    });
    setShowModal(true);
  };

  return (
    <div className="inventario-container">
      {/* === IZQUIERDA === */}
      <div className="inventario-izquierda">
        <h2 className="titulo">Inventario General</h2>
        <button className="btn-agregar" onClick={handleAgregar}>
          Agregar Insumo
        </button>

        <table className="tabla-inventario">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Costo (S/)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumos.length > 0 ? (
              insumos.map((insumo) => (
                <tr key={insumo.id}>
                  <td>{insumo.id}</td>
                  <td>{insumo.nombre}</td>
                  <td>{insumo.stock}</td>
                  <td>{insumo.stockMin}</td>
                  <td>S/. {Number(insumo.costo ?? 0).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(insumo)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(insumo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay insumos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === DERECHA === */}
      <div className="inventario-derecha">
        <div className="card-grafico">
          <h5 className="text-center">Stock por Insumo</h5>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={insumos}>
                <CartesianGrid strokeDasharray="3 1" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-valor">
          <h5>Valor Total del Inventario</h5>
          <h2>
            S/.{" "}
            {valorTotal.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{modoEdicion ? " Editar Insumo" : " Agregar Insumo"}</h4>

            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={insumoActual.nombre}
              onChange={handleChange}
              placeholder="Ej: Azúcar blanca"
            />

            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={insumoActual.stock}
              onChange={handleChange}
              min="0"
            />

            <label>Stock Mínimo (mín. 5):</label>
            <input
              type="number"
              name="stockMin"
              value={insumoActual.stockMin}
              onChange={handleChange}
              min="5"
            />

            <label>Costo (S/.):</label>
            <input
              type="number"
              name="costo"
              step="0.01"
              value={insumoActual.costo}
              onChange={handleChange}
              min="0"
            />

            <div className="modal-buttons">
              <button
                className="btn-cancelar"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-guardar" onClick={handleGuardar}>
                {modoEdicion ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
