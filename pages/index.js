import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [contractAddressVisible, setContractAddressVisible] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [owner, setOwner] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }
    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const getOwnerAddress = async () => {
    if (atm) {
      setOwner(await atm.owner());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const showContractAddress = () => {
    setContractAddressVisible(true);
  };

  const transferAccount = async () => {
    try {
      if (atm) {
        let tx = await atm.transferAccount(newOwnerAddress);
        await tx.wait();
        // Refresh owner address and balance after transferring the account
        getOwnerAddress();
        getBalance();
      } else {
        console.error("Contract instance not initialized");
      }
    } catch (error) {
      console.error("Error transferring account:", error);
    }
  };

  const handleNewOwnerAddressChange = (event) => {
    setNewOwnerAddress(event.target.value);
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount} className="btn">
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    if (owner === "") {
      getOwnerAddress();
    }

    return (
      <div className="user-details">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <p>Contract Owner: {owner}</p>
        <div className="buttons">
          <button onClick={deposit} className="btn">Deposit 1 ETH</button>
          <button onClick={withdraw} className="btn">Withdraw 1 ETH</button>
        </div>
        <div>
          <input
            type="text"
            value={newOwnerAddress}
            onChange={handleNewOwnerAddressChange}
            placeholder="New Owner Address"
          />
          <button onClick={transferAccount} className="btn">Transfer Account</button>
        </div>
        <button onClick={showContractAddress} className="btn">
          Show Contract Address
        </button>
        {contractAddressVisible && <p>Contract Address: {contractAddress}</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <div className="main-container">
      <main className="container">
        <header><h1>WELCOME TO MY ATM!</h1></header>
        {initUser()}
      </main>
    </div>
  );
}
