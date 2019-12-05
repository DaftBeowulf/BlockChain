import React, { useState } from "react";

const WalletId = ({ walletId, setWalletId }) => {
  const [idInput, setIdInput] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setWalletId(idInput);
    setIdInput("");
  };
  return (
    <div className="wallet-id">
      {walletId === "" ? (
        <h2>Looks like you haven't set a name yet!</h2>
      ) : (
        <h2>Hi {walletId}, welcome back!</h2>
      )}
      <form onSubmit={e => handleSubmit(e)}>
        <h3>{walletId === "" ? "Set name here" : "Edit name here:"}</h3>
        <input
          type="text"
          default="Name..."
          onChange={e => setIdInput(e.target.value)}
          value={idInput}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WalletId;
