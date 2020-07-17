import { mxw } from "mxw-sdk-js";
import Logger from "./logger";

export default class Minter {
  public token: mxw.token.FungibleToken;
  public wallet: mxw.Wallet;
  public value: number;
  public constructor(
    token: mxw.token.FungibleToken,
    wallet: mxw.Wallet,
    value: number
  ) {
    this.token = token;
    this.wallet = wallet;
    this.value = value;
  }

  public mint() {
    console.log("\x1b[1m%s\x1b[0m","Minting...");
    return this.token.mint(this.wallet.address, this.value).then((receipt) => {
      if(receipt.status ==1){
        Logger.green("Sucessfully minted "+ this.value + " " + this.token.state.name);
      }
      else Logger.red("Failed to mint");
      return receipt;
    });
  }
}
