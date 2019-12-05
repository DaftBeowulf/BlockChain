import React, { useEffect } from "react";
import axios from "axios";

const port = "http://localhost:5000";

const Account = ({ walletId }) => {
  useEffect(() => {
    const url = port + "/chain";
    axios.get(url).then(res => {
      console.log(res.data.chain);
    });
  });

  return <div className="account">Yoooo</div>;
};

export default Account;
