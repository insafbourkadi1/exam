//Create the account info query
const query = new ConsensusTopicInfoQuery()
.setTopicId(newTopicId);
//Submit the query to a Hedera network
const info = await query.execute(client);
//Print the account key to the console
console.log(info);
