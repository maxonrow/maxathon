import { mxw } from "mxw-sdk-js";
import Logger from "./logger";

export default class Wallet{
    public owner: mxw.Wallet;
    public other: mxw.Wallet;
    public token: mxw.token.FungibleToken;
    public constructor(owner: mxw.Wallet, other: mxw.Wallet, token: mxw.token.FungibleToken) {
        this.owner = owner;
        this.other = other;
        this.token = token;
      }

    public transferAll(){
        return this.getBalance().then((balance)=>{
            return this.owner.provider.getTransactionFee("token","token-transferFungibleToken", {
                symbol: this.token.symbol,
                from: this.owner.address,
                to: this.other.address,
                value: balance,
                memo: "Transfer Fungible Token"
            }).then((fee)=>{
                return this.token.transfer(this.other.address, balance, {fee}).then((receipt)=>{
                    if(receipt.status == 1) Logger.green("Successfully transfered all " + this.token.state.name + " to " + this.other.address);
                    else Logger.red('Failed to transfer');
                    return receipt;
                })
                
            })
            
        })
    }
    
    public getBalance(){
        return this.token.getBalance().then((balance)=>{
            Logger.yellow("Total " + this.token.state.name +" Token Owned: " + mxw.utils.formatUnits(balance, this.token.state.decimals));
            return balance;
        })
    }

    public burnAll(){
        return this.getBalance().then((balance)=>{
            return this.token.burn(balance).then((receipt) => {
                if(receipt.status == 1) Logger.green("Successfully burned all " + this.token.state.name);
                    else Logger.red('Failed to burn');
                return receipt;
            });
        })
    }
}