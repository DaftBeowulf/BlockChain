import React, { useState } from "react";
import "./App.css";
import WalletId from "./components/WalletId";
import Account from "./components/Account";

function App() {
  const [walletId, setWalletId] = useState("");
  return (
    <div className="App">
      <WalletId walletId={walletId} setWalletId={setWalletId} />
      <Account walletId={walletId} />
    </div>
  );
}

export default App;
