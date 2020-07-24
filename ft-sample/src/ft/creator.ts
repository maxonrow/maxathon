import { mxw, token } from "mxw-sdk-js";
import { nodeProvider } from "../node/node";

export default class Creator {
  public issuer: mxw.Wallet;
  public fungibleTokenProperties: token.FungibleTokenProperties;
  public constructor(
    issuer: mxw.Wallet,
    fungibleTokenProperties: token.FungibleTokenProperties
  ) {
    this.issuer = issuer;
    this.fungibleTokenProperties = fungibleTokenProperties;
  }

  public createFixFT() {
    console.log("\x1b[1m%s\x1b[0m","Creating fix fungible token...");
    return token.FungibleToken.create(
      this.fungibleTokenProperties,
      this.issuer
    ).then((token) => {
      console.log("\x1b[32m%s\x1b[0m","Token had been created");
      return token as token.FungibleToken;
    });
  }

  public createDynFT() {
    console.log("\x1b[1m%s\x1b[0m","Creating dynamic fungible token...");
    return token.FungibleToken.create(
      this.fungibleTokenProperties,
      this.issuer
    ).then((token) => {
      console.log("\x1b[32m%s\x1b[0m","Token had been created");
      return token as token.FungibleToken;
    });
  }
}
