import { NonFungibleTokenActions } from 'mxw-sdk-js/dist/non-fungible-token';
import { nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class Approver {

    #symbol: String;

    public constructor(symbol: String) {
        this.#symbol = symbol;
    }
    public get symbol() {
        return this.#symbol;
    }
    public set symbol(value) {
        this.#symbol = value;
    }

    public approve() {
        let overrides = {
            tokenFees: [
                { action: NonFungibleTokenActions.transfer, feeName: "default" },
                { action: NonFungibleTokenActions.transferOwnership, feeName: "default" },
                { action: NonFungibleTokenActions.acceptOwnership, feeName: "default" }
            ],
            endorserList: [],
            mintLimit: 1,
            transferLimit: 1,
            burnable: true,
            transferable: true,
            modifiable: true,
            pub: false   // private

        };
    }

    public performNonFungibleTokenStatus(symbol: string, perform: any, overrides?: any) {

        return perform(symbol, token.NonFungibleToken.approveNonFungibleToken, overrides).then((transaction: token.NonFungibleTokenStatusTransaction) => {
            return token.NonFungibleToken.signNonFungibleTokenStatusTransaction(transaction, issuer);
        }).then((transaction: token.NonFungibleTokenStatusTransaction) => {

            return token.NonFungibleToken.sendNonFungibleTokenStatusTransaction(transaction, middleware).then((receipt) => {

                if (overrides && overrides.notRefresh) {
                    return receipt;
                }
                // return refresh(symbol).then(() => {
                //     return receipt;
                // });
            });
        });
    }

}

