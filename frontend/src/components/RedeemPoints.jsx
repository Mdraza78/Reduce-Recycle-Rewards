import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "points", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PointsRedeemed",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
    "name": "getRedemption",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRedemptionsCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "uint256", "name": "_points", "type": "uint256" }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "redemptions",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "points", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99";

const RedeemPoints = () => {
  const location = useLocation();
  const { coinsEarned } = location.state || { coinsEarned: 0 };

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setConfirmation(null);

    const points = Math.floor(coinsEarned);

    if (!name.trim()) {
      setError("Please enter your name!");
      setIsLoading(false);
      return;
    }

    if (points <= 0) {
      setError("You need at least 1 point to redeem!");
      setIsLoading(false);
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.redeem(name.trim(), points);
      await tx.wait();

      setConfirmation({
        name: name.trim(),
        points,
        inrValue: points * 8.33, // Assuming 1 point = ₹8.33
        timestamp: new Date().toLocaleString(),
      });
      setOpenModal(true);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Transaction failed: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "2rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>🎁 Redeem Your Points</h1>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <label>Total Points:</label>
        <input
          type="number"
          value={coinsEarned}
          readOnly
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#f0f0f0" }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: isLoading ? "#ccc" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {isLoading && <CircularProgress size={20} color="inherit" />}
          {isLoading ? "Processing..." : "Redeem Points"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircleIcon color="success" fontSize="large" />
          <span>Redemption Successful</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            {confirmation && (
              <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "1rem" }}>
                <strong>Name:</strong>
                <span>{confirmation.name}</span>
                <strong>Points Redeemed:</strong>
                <span>{confirmation.points}</span>
                <strong>INR Value:</strong>
                <span>₹{confirmation.inrValue.toFixed(2)}</span>
                <strong>Time:</strong>
                <span>{confirmation.timestamp}</span>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" variant="contained" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RedeemPoints;