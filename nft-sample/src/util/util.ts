import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class Util {

    public static reload(nftProperties: token.NonFungibleTokenProperties, wallet: mxw.Wallet)
        : Promise<token.NonFungibleToken> {

        return token.NonFungibleToken.fromSymbol(
            nftProperties.symbol, wallet);
    }


    public static performNonFungibleTokenStatus(
        symbol: String, perform: any, 
        provider: mxw.Wallet, issuer: mxw.Wallet, 
        middleware: mxw.Wallet, overrides?: any) {
            
        return perform(symbol, provider, overrides).then((transaction: mxw.nonFungibleToken.NonFungibleTokenStatusTransaction) => {
            return token.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
        }).then((transaction: mxw.nonFungibleToken.NonFungibleTokenStatusTransaction) => {
            return token.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then((receipt) => {

                if (overrides && overrides.notRefresh) {
                    return receipt;
                }
                else {
                    //TODO please do refresh
                    return receipt;
                }
            });
        });
    }


    public static performNonFungibleTokenItemStatus(
        symbol: string, itemID: string, perform: any, 
        provider: mxw.Wallet, issuer: mxw.Wallet, 
        middleware: mxw.Wallet, overrides?: any) {
        return perform(symbol, itemID, provider, overrides).then((transaction: mxw.nonFungibleToken.NonFungibleTokenItemStatusTransaction) => {
            return token.NonFungibleToken.signNonFungibleTokenItemStatusTransaction(transaction, issuer);
        }).then((transaction: mxw.nonFungibleToken.NonFungibleTokenItemStatusTransaction) => {
            return token.NonFungibleToken.sendNonFungibleTokenItemStatusTransaction(transaction, middleware).then((receipt) => {

                if (overrides && overrides.notRefresh) {
                    return receipt;
                }
                else {
                    //TODO please do refresh
                    return receipt;
                }
            });
        });
    }


}