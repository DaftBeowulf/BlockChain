import React, { useState } from "react";
import "./App.css";
import WalletId from "./components/WalletId";

function App() {
  const [walletId, setWalletId] = useState("");
  return (
    <div className="App">
      <WalletId walletId={walletId} setWalletId={setWalletId} />
    </div>
  );
}

export default App;
