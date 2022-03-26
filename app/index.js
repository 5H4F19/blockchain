const express = require("express");
const Blockchain = require("../blockchain");
const bodyParser = require("body-parser");
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/tnx-pool");
const Miner = require("./miner");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect("/blocks");
});

app.get("/tnx", (req, res) => {
  res.json(tp.transactions);
});

app.post("/tnx", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/tnx");
});

app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  res.redirect("/blocks");
});

app.get("/publicKey", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening at port ${HTTP_PORT}`);
});
p2pServer.listen();
