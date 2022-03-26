const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
class Miner {
  constructor(blockchain, transacntionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transacntionPool = transacntionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transacntionPool.validTransactions();
    //      include a reward for the miner
    validTransaction.push(
      Transaction.rewardTnx(this.wallet, Wallet.bcWallet())
    );
    //      create a block consisting of the valid transactions
    const block = this.blockchain.addBlock(validTransaction);
    //      synchronize the chains in the peer-to-peer server
    this.p2pServer.syncChains();
    //      clear the transaction pool
    this.transacntionPool.clear();
    //      broadcast to every miner to clear their transaction pools
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
