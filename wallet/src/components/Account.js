import React, { useState, useEffect } from "react";
import axios from "axios";

const port = "http://localhost:5000";

const Account = ({ walletId }) => {
  const [userTxns, setUserTxns] = useState([]);
  const [currency, setCurrency] = useState(0);

  const [page, setPage] = useState(1);

  const paginate = next => {
    // if next page would be 0, or greater than the last possible sliced priest,
    // or if nothing is passed to paginate(), the page will not change and just return
    // the same slice of txns
    if (
      page + next < 1 ||
      page + next >= userTxns.length * page ||
      next === undefined
    ) {
      next = 0;
    } else {
      setPage(page + next);
    }

    return userTxns.slice(page * 10 - 10, page * 10);
  };

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
        <div
          style={{
            width: "350px",
            margin: "0 auto",
            padding: "0 0 0 100px",
            textAlign: "left"
          }}
        >
          {paginate().map((txn, id) => (
            <div
              style={
                txn.recipient === walletId
                  ? { color: "green" }
                  : { color: "red" }
              }
              key={id}
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

      <div className="paginate-buttons">
        <button disabled={page === 1} onClick={() => paginate(-1)}>
          Previous page
        </button>
        <div>{page}</div>
        <button disabled={page >= userTxns / 10} onClick={() => paginate(1)}>
          Next page
        </button>
      </div>
    </div>
  );
};

export default Account;
