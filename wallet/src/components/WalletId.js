import React, { useState } from "react";

const WalletId = () => {
  const [walletId, setWalletId] = useState("");
  const [idInput, setIdInput] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setWalletId(idInput);
    setIdInput("");
  };
  return (
    <>
      {walletId === "" ? (
        <h2>Looks like you haven't set a name yet!</h2>
      ) : (
        <h2>Hi {walletId}, welcome back!</h2>
      )}
      <form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          default="Name..."
          onChange={e => setIdInput(e.target.value)}
          value={idInput}
        ></input>
        <button type="submit">Submit Name</button>
      </form>
    </>
  );
};

export default WalletId;
