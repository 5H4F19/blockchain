const ChainUtil = require("../chain-utils");
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  updateTnx(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`amount:${amount} senderOutput:${senderOutput.amount}`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const tnx = new this();
    tnx.outputs.push(...outputs);
    Transaction.signTransaction(tnx, senderWallet);
    return tnx;
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount :${amount} exceeds the balance`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey,
      },
      { amount, address: recipient },
    ]);
  }

  static rewardTnx(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      { amount: MINING_REWARD, address: minerWallet.publicKey },
    ]);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
    return transaction;
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
