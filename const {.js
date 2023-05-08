const {
        Client,
        PrivateKey,
        AccountCreateTransaction,
        AccountBalanceQuery,
        Hbar,
     
   //initialisation  du client 
const client = Client.forTestnet();
  
client.setOperator(myAccountId, myPrivateKey);
//Create the transaction
const transaction = new TopicCreateTransaction();

//Sign with the client operator private key and submit the transaction to a Hedera network
const txResponse = await transaction.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Get the topic ID
const newTopicId = receipt.topicId;

console.log("The new topic ID is " + newTopicId);

//v2.0.0
