import { mxw, token } from "mxw-sdk-js";
import { FungibleTokenProperties } from "mxw-sdk-js/dist/token";

export default class Query {
  public fungibleTokenProperties: FungibleTokenProperties;
  public owner: mxw.Wallet;
  public issuer: mxw.Wallet;
  public constructor(FungibleTokenProperties: FungibleTokenProperties, issuer: mxw.Wallet, owner: mxw.Wallet) {
    this.fungibleTokenProperties = FungibleTokenProperties;
    this.owner = owner;
    this.issuer = issuer;
  }

  public QueryToken() {
    console.log("\x1b[1m%s\x1b[0m","Querying fungible token...");
    return token.FungibleToken.fromSymbol(this.fungibleTokenProperties.symbol, this.owner).then((token) => {
      let fungibleToken = token;
  }).then(() => {
      return token.FungibleToken.fromSymbol(this.fungibleTokenProperties.symbol, this.issuer).then((token) => {
          return token;
      });
  });
}

}
