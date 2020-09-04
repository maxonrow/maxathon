import { NonFungibleTokenActions } from 'mxw-sdk-js/dist/non-fungible-token';
import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';
import Util from '../util/util'

export default class Approver {

    private _symbol: String;
    private _provider: mxw.Wallet;
    private _issuer: mxw.Wallet;
    private _middleware: mxw.Wallet;

    public constructor(symbol: String, provider: mxw.Wallet,
        issuer: mxw.Wallet, middleware: mxw.Wallet) {
        this._symbol = symbol;
        this._provider = provider;
        this._issuer = issuer;
        this._middleware = middleware;
    }
    public get symbol(): String {
        return this._symbol;
    }
    public set symbol(value: String) {
        this._symbol = value;
    }
    public get issuer(): mxw.Wallet {
        return this._issuer;
    }
    public set issuer(value: mxw.Wallet) {
        this._issuer = value;
    }
    public get provider(): mxw.Wallet {
        return this._provider;
    }
    public set provider(value: mxw.Wallet) {
        this._provider = value;
    }
    public get middleware(): mxw.Wallet {
        return this._middleware;
    }
    public set middleware(value: mxw.Wallet) {
        this._middleware = value;
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
            pub: false,   // private
            endorserListLimit: 10
        };


        return await Util.performNonFungibleTokenStatus(this._symbol,
            token.NonFungibleToken.approveNonFungibleToken, this._provider,
            this._issuer, this._middleware, overrides);

    }



}

