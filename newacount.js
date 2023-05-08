const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  const newAccountId ="0.0.4578685" ;
  async function main() {
    // Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = "0.0.4579917";
    const myPrivateKey = "302e020100300506032b65700422042033202a205d2090734f2b4efefb508d323a1bab3bcdf1d05efca9d38344b0ffe3";
  
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error(
        "Environment variables myAccountId and myPrivateKey must be present"
      );
    }
  
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
  
    client.setOperator(myAccountId, myPrivateKey);
      // Create the transfer transaction
  const sendHbar = await new TransferTransaction()
  .addHbarTransfer(myAccountId, Hbar.fromTinybars(-500000))
  .addHbarTransfer(newAccountId, Hbar.fromTinybars(500000))
  .execute(client);

  

// Verify the transaction reached consensus
const transactionReceipt = await sendHbar.getReceipt(client);
console.log(
  "The transfer transaction from my account to the new account was: " +
    transactionReceipt.status.toString()
);

// Request the cost of the query
const queryCost = await new AccountBalanceQuery()
  .setAccountId(newAccountId)
  .getCost(client);

console.log("The cost of query is: " + queryCost);

// Check the new account's balance
const getNewBalance = await new AccountBalanceQuery()
  .setAccountId(newAccountId)
  .execute(client);

console.log(
  "The account balance after the transfer is: " +
    getNewBalance.hbars.toTinybars() +
    " tinybars."
);
console.log(myAccountId);
}
// Call the async main function
main();