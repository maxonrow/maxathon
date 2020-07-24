import { NonFungibleTokenActions } from 'mxw-sdk-js/dist/non-fungible-token';
import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';
import Util from '../util/util'

export default class Approver {

    #symbol: String;
    #provider: mxw.Wallet;
    #issuer: mxw.Wallet;
    #middleware: mxw.Wallet;

    public constructor(symbol: String, provider: mxw.Wallet,
        issuer: mxw.Wallet, middleware: mxw.Wallet) {
        this.#symbol = symbol;
        this.#provider = provider;
        this.#issuer = issuer;
        this.#middleware = middleware;
    }
    public get symbol(): String {
        return this.#symbol;
    }
    public set symbol(value: String) {
        this.#symbol = value;
    }
    public get issuer(): mxw.Wallet {
        return this.#issuer;
    }
    public set issuer(value: mxw.Wallet) {
        this.#issuer = value;
    }
    public get provider(): mxw.Wallet {
        return this.#provider;
    }
    public set provider(value: mxw.Wallet) {
        this.#provider = value;
    }
    public get middleware(): mxw.Wallet {
        return this.#middleware;
    }
    public set middleware(value: mxw.Wallet) {
        this.#middleware = value;
    }


    public async approve() {

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


        return await Util.performNonFungibleTokenStatus(this.#symbol,
            token.NonFungibleToken.approveNonFungibleToken, this.#provider,
            this.#issuer, this.#middleware, overrides);

    }



}

