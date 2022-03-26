const TransactionPool = require("./tnx-pool");
const Wallet = require("./index");
const express = require("express");

describe("TransactionPool", () => {
  let tp, wallet, tnx;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    tnx = wallet.createTransaction("sfsdgsgfgf", 30, tp);
  });

  it("adds a tnx a to the pool", () => {
    expect(tp.transactions.find((t) => t.id === tnx.id)).toEqual(tnx);
  });

  it("updates a transactions in the pool", () => {
    const oldTransaction = JSON.stringify(tnx);
    const newTransaction = tnx.updateTnx(wallet, "dfdfd", 50);
    console.log(newTransaction);
    tp.updateOrAddTransaction(newTransaction);
    console.log("tp", newTransaction);

    expect(
      JSON.stringify(tp.transactions.find((t) => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });

  it("clears transactions", () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe("mixing valid and corrupt tnx", () => {
    let validTnx;

    beforeEach(() => {
      validTnx = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        tnx = wallet.createTransaction("asasasa", 30, tp);
        if (i % 2 == 0) {
          tnx.input.amount = 99999;
        } else {
          validTnx.push(tnx);
        }
      }
    });

    it("shows a difference between vaild and corrupt transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTnx)
      );
    });

    it("grabs a valid transaction", () => {
      expect(tp.validTransactions()).toEqual(validTnx);
    });
  });
});
