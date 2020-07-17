import { mxw } from "mxw-sdk-js";

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

  public Mint() {
    console.log("\x1b[1m%s\x1b[0m","Minting...");
    return this.token.mint(this.wallet.address, this.value).then((receipt) => {
      // console.log(receipt.status);
      return receipt;
    });
  }
}
