import React, { useState } from "react";
import visaLogo from "../../../assets/visa-logo.webp";
import mastercardLogo from "../../../assets/mastercard-logo.webp";
import pagoefectivoLogo from "../../../assets/pagoefectivo-logo.webp";
import qrImage from "../../../assets/QR.jpeg";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import "../../../styles/Pago.css";

const Pago = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const currentYear = new Date().getFullYear() % 100;

  // --- Cambiar método de pago ---
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
    setErrorMessage("");
  };

  // --- Formato número de tarjeta ---
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(" ") || value;
    }
    setCardNumber(value.slice(0, 19));
  };

  // --- Validación y formato de fecha de caducidad ---
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    const [month, year] = value.split("/");

    // Validar mes (solo si se ingresó algo)
    if (month && parseInt(month, 10) > 12) {
      return;
    }

    // Validar año (solo cuando hay 2 dígitos de año)
    if (year && year.length === 2 && parseInt(year, 10) < currentYear) {
      return;
    }

    setExpiry(value.slice(0, 5));
  };

  // --- CVV ---
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.slice(0, 4));
  };

  // --- Enviar formulario ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedPayment === "pagoefectivo") {
      alert("Gracias por su compra. Pague escaneando el código QR.");
      setSelectedPayment("");
      return;
    }

    // Validar campos
    if (
      (selectedPayment === "visa" || selectedPayment === "mastercard") &&
      (!cardNumber || !expiry || !cvv)
    ) {
      setErrorMessage("Por favor complete todos los campos obligatorios.");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16 || cvv.length < 3) {
      setErrorMessage("Los datos de la tarjeta no son válidos.");
      return;
    }

    // Éxito
    alert("¡Pago procesado con éxito! Gracias por su compra.");

    // Reiniciar formulario
    setSelectedPayment("");
    setCardNumber("");
    setCvv("");
    setExpiry("");
    setErrorMessage("");
  };

  return (
    <>
      <Header />
      <main className="checkout">
        <section className="checkout__section">
          {/* MÉTODOS DE PAGO */}
          <div className="payment-methods">
            <h1 className="payment-methods__title">Continuar con el pago</h1>
            <span className="payment-methods__subtitle">
              Seleccione el método de pago:
            </span>

            <form className="payment-methods__list">
              {[
                { value: "visa", name: "VISA", logo: visaLogo },
                {
                  value: "mastercard",
                  name: "MasterCard",
                  logo: mastercardLogo,
                },
                {
                  value: "pagoefectivo",
                  name: "PagoEfectivo",
                  logo: pagoefectivoLogo,
                },
              ].map((method) => (
                <label className="payment-option" key={method.value}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={selectedPayment === method.value}
                    onChange={handlePaymentChange}
                    className="payment-option__input"
                  />
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="payment-option__logo"
                  />
                  <span className="payment-option__name">{method.name}</span>
                  {selectedPayment === method.value && (
                    <span className="payment-option__check">✓</span>
                  )}
                </label>
              ))}
            </form>
          </div>

          {/* FORMULARIO DE PAGO */}
          {(selectedPayment === "visa" || selectedPayment === "mastercard") && (
            <form className="payment-form" onSubmit={handleSubmit}>
              <h2 className="payment-form__title">Información de pago</h2>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="form-group">
                <label className="form-group__label">Número de tarjeta</label>
                <input
                  type="text"
                  className="form-group__input"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-group__label">
                    Fecha de caducidad
                  </label>
                  <input
                    type="text"
                    className="form-group__input"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-group__label">Código CVV</label>
                  <input
                    type="text"
                    className="form-group__input"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="0000"
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="payment-form__actions">
                <button type="submit" className="submit-button">
                  Finalizar compra
                </button>
              </div>
            </form>
          )}

          {/* QR - PagoEfectivo */}
          {selectedPayment === "pagoefectivo" && (
            <div className="qr-payment">
              <h2 className="qr-payment__title">Pago con QR</h2>
              <p className="qr-payment__text">
                Escanea este código QR con tu aplicación bancaria para completar
                el pago.
              </p>
              <img
                src={qrImage}
                alt="Código QR"
                className="qr-payment__image"
              />
              <p className="qr-payment__instructions">
                Una vez completado el pago, recibirás un correo de confirmación.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Pago;
