import { mxw } from "mxw-sdk-js";
import { FungibleTokenProperties } from "mxw-sdk-js/dist/token";
import { BigNumber, bigNumberify } from "mxw-sdk-js/dist/utils";

export default class Wallet{
    public owner: mxw.Wallet;
    public other: mxw.Wallet;
    public token: mxw.token.FungibleToken;
    public constructor(owner: mxw.Wallet, other: mxw.Wallet, token: mxw.token.FungibleToken) {
        this.owner = owner;
        this.other = other;
        this.token = token;
      }

    public TransferAll(){
        return this.GetBalance().then((balance)=>{
            return this.owner.provider.getTransactionFee("token","token-transferFungibleToken", {
                symbol: this.token.symbol,
                from: this.owner.address,
                to: this.other.address,
                value: balance,
                memo: "Transfer Fungible Token"
            }).then((fee)=>{
                return this.token.transfer(this.other.address, balance, {fee}).then((receipt)=>{
                    return receipt;
                })
                
            })
            
        })
    }
    
    public GetBalance(){
        return this.token.getBalance().then((balance)=>{
            console.log("Total Fungible Token Owned: ",mxw.utils.formatUnits(balance, this.token.state.decimals));
            return balance;
        })
    }

    public BurnAll(){
        return this.GetBalance().then((balance)=>{
            return this.token.burn(balance).then((receipt) => {
                return receipt;
            });
        })
    }
}