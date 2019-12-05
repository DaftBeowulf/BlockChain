import React, { useState, useEffect } from "react";
import axios from "axios";

const port = "http://localhost:5000";

const Account = ({ walletId }) => {
  const [userTxns, setUserTxns] = useState([]);
  const [currency, setCurrency] = useState(0);
  useEffect(() => {
    const url = port + "/chain";
    axios
      .get(url)
      .then(res => {
        const chain = res.data.chain;
        const temp_txns = [];
        let temp_currency = 0;
        chain.forEach(block => {
          block.transactions.forEach(txn => {
            if (txn.sender === walletId) {
              temp_currency -= txn.amount;
              temp_txns.push(txn);
            } else if (txn.recipient === walletId) {
              temp_currency += txn.amount;
              temp_txns.push(txn);
            }
          });
        });
        setCurrency(temp_currency);
        setUserTxns(temp_txns);
      })
      .catch(error => {
        console.log(error);
      });
  }, [walletId]);

  return (
    <div className="account">
      <h1>Current account balance: {currency} LambdaCoins</h1>
      {userTxns.length ? (
        <div>
          {userTxns.map(txn => (
            <div
              style={
                txn.recipient === walletId
                  ? { color: "green" }
                  : { color: "red" }
              }
            >
              Recipient: {txn.recipient} Sender: {txn.sender} Amount:{" "}
              {txn.amount}
            </div>
          ))}
        </div>
      ) : walletId ? (
        <div>No transactions under your ID yet, {walletId}</div>
      ) : (
        <div>Enter an ID above to see your transactions!</div>
      )}
    </div>
  );
};

export default Account;
