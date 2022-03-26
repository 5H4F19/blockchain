const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require("../chain-utils");
const Transaction = require("./transaction");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keypair = ChainUtil.genKeyPair();
    this.publicKey = this.keypair.getPublic().encode("hex");
  }

  toString() {
    return `Wallet-
                publicKey:${this.publicKey.toString()}
                balance: ${this.balance}`;
  }

  sign(dataHash) {
    return this.keypair.sign(dataHash);
  }

  createTransaction(recipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.log(
        `Amount:${amount} exceeds the current balance: ${this.balance}`
      );
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.updateTnx(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  static bcWallet() {
    const bcWallet = new this();
    bcWallet.address = "blockchain-wallet";
    return bcWallet;
  }
}

module.exports = Wallet;
