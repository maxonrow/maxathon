import { mxw, token } from "mxw-sdk-js";
import {
  FungibleTokenProperties,
  FungibleTokenActions,
} from "mxw-sdk-js/dist/token";
import Query from "./query";

export default class Approver {
  public fungibleTokenProperties: FungibleTokenProperties;
  public perform: any;
  public issuer: mxw.Wallet;
  public provider: mxw.Wallet;
  public middleware: mxw.Wallet;
  public constructor(
    fungibleTokenProperties: FungibleTokenProperties,
    perform: any,
    issuer: mxw.Wallet,
    provider: mxw.Wallet,
    middleware: mxw.Wallet
  ) {
    this.fungibleTokenProperties = fungibleTokenProperties;
    this.perform = perform;
    this.issuer = issuer;
    this.provider = provider;
    this.middleware = middleware;
  }

  public Approve() {
    console.log("\x1b[33m%s\x1b[0m","Authorizing  action...");
    let burnable = true;
    let overrides = {
      tokenFees: [
        { action: FungibleTokenActions.transfer, feeName: "default" },
        { action: FungibleTokenActions.transferOwnership, feeName: "default" },
        { action: FungibleTokenActions.acceptOwnership, feeName: "default" },
      ],
      burnable,
    };
    if (burnable) {
      overrides.tokenFees.push({
        action: FungibleTokenActions.burn,
        feeName: "transfer",
      });
    }
    return this.perform(
      this.fungibleTokenProperties.symbol,
      this.provider,
      overrides
    )
      .then((transaction: any) => {
        return token.FungibleToken.signFungibleTokenStatusTransaction(
          transaction,
          this.issuer
        );
      })
      .then((transaction: any) => {
        console.log("\x1b[34m%s\x1b[0m","Issuer Signed");
        return token.FungibleToken.sendFungibleTokenStatusTransaction(
          transaction,
          this.middleware
        ).then((receipt) => {
          console.log("\x1b[34m%s\x1b[0m","Middleware Signed");
            return receipt;
        });
      });
  }
}
