1) // SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

import "./HederaResponseCodes.sol";
import "./IHederaTokenService.sol";
import "./HederaTokenService.sol";
import "./ExpiryHelper.sol";
import "./KeyHelper.sol";

contract NFTCreator is ExpiryHelper, KeyHelper, HederaTokenService {

    function createNft(
            string memory name, 
            string memory symbol, 
            string memory memo, 
            int64 maxSupply,  
            int64 autoRenewPeriod
        ) external payable returns (address){

        IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](1);
        // Set this contract as supply for the token
        keys[0] = getSingleKey(KeyType.SUPPLY, KeyValueType.CONTRACT_ID, address(this));

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = memo;
        token.treasury = address(this);
        token.tokenSupplyType = true; // set supply to FINITE
        token.maxSupply = maxSupply;
        token.tokenKeys = keys;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod); // Contract auto-renews the token

        (int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(token);

        if(responseCode != HederaResponseCodes.SUCCESS){
            revert("Failed to create non-fungible token");
        }
        return createdToken;
    }

    function mintNft(
        address token,
        bytes[] memory metadata
    ) external returns(int64){

        (int response, , int64[] memory serial) = HederaTokenService.mintToken(token, 0, metadata);

        if(response != HederaResponseCodes.SUCCESS){
            revert("Failed to mint non-fungible token");
        }

        return serial[0];
    }

    function transferNft(
        address token,
        address receiver, 
        int64 serial
    ) external returns(int){

        HederaTokenService.associateToken(receiver, token);
        int response = HederaTokenService.transferNFT(token, address(this), receiver, serial);

        if(response != HederaResponseCodes.SUCCESS){
            revert("Failed to transfer non-fungible token");
        }

        return response;
    }

}
// Create NFT from precompile
const createToken = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(4000000) // Increase if revert
    .setPayableAmount(50) // Increase if revert
    .setFunction("createNft",
        new ContractFunctionParameters()
        .addString("Fall Collection") // NFT name
        .addString("LEAF") // NFT symbol
        .addString("Just a memo") // NFT memo
        .addInt64(250) // NFT max supply
        .addUint32(7000000) // Expiration: Needs to be between 6999999 and 8000001
        );
const createTokenTx = await createToken.execute(client);
const createTokenRx = await createTokenTx.getRecord(client);
const tokenIdSolidityAddr = createTokenRx.contractFunctionResult.getAddress(0);
const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);

console.log(`Token created with ID: ${tokenId} \n`);
