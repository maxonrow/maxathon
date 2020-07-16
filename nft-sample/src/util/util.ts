import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class Util {

    public static loadNFT(nftProperties: token.NonFungibleTokenProperties, wallet: mxw.Wallet)
        : Promise<token.NonFungibleToken> {

        return token.NonFungibleToken.fromSymbol(
            nftProperties.symbol, wallet);
    }

    public static loadIssuerNFT(nftProperties: token.NonFungibleTokenProperties, issuer: mxw.Wallet)
        : Promise<token.NonFungibleToken> {
            
        return token.NonFungibleToken.fromSymbol(
            nftProperties.symbol, issuer);
    }

    // static performNonFungibleTokenStatus(symbol: string, perform: any, overrides?: any) {
    //     return perform(symbol, provider, overrides).then((transaction) => {
    //         return token.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
    //     }).then((transaction) => {

    //         return token.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then((receipt) => {

    //             if (overrides && overrides.notRefresh) {
    //                 return receipt;
    //             }
    //             return refresh(symbol).then(() => {
    //                 return receipt;
    //             });
    //         });
    //     });
    // }

    // static performNonFungibleTokenItemStatus(symbol: string, itemID: string, perform: any, overrides?: any) {
    //     return perform(symbol, itemID, provider, overrides).then((transaction) => {
    //         return token.NonFungibleToken.signNonFungibleTokenItemStatusTransaction(transaction, issuer);
    //     }).then((transaction) => {
    //         return token.NonFungibleToken.sendNonFungibleTokenItemStatusTransaction(transaction, middleware).then((receipt) => {

    //             if (overrides && overrides.notRefresh) {
    //                 return receipt;
    //             }
    //             return refresh(symbol).then(() => {
    //                 return receipt;
    //             });
    //         });
    //     });
    // }
}