const Wallet = require("./index");
const TransactionPool = require("./tnx-pool");

describe("Wallet", () => {
  let wallet, tp;

  wallet = new Wallet();
  tp = new TransactionPool();

  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe("and doing the same Transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it("doubles the `sendAmount` subtracted from the wallet", () => {
        expect(
          transaction.outputs.find(
            (output) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });
    });
  });
});
