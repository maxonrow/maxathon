import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class Creator {

    private _nonFungibleTokenProperties: token.NonFungibleTokenProperties;
    private _issuer: mxw.Wallet;
    private _wallet: mxw.Wallet;

    public constructor(
        nonFungibleTokenProperties: token.NonFungibleTokenProperties,
        issuer: mxw.Wallet,
        wallet: mxw.Wallet) {
        this._nonFungibleTokenProperties = nonFungibleTokenProperties;
        this._issuer = issuer;
        this._wallet = wallet;
    }

    public get nonFungibleTokenProperties(): token.NonFungibleTokenProperties {
        return this._nonFungibleTokenProperties;
    }
    public set nonFungibleTokenProperties(value: token.NonFungibleTokenProperties) {
        this._nonFungibleTokenProperties = value;
    }
    public get issuer(): mxw.Wallet {
        return this._issuer;
    }
    public set issuer(value: mxw.Wallet) {
        this._issuer = value;
    }
    public get wallet(): mxw.Wallet {
        return this._wallet;
    }
    public set wallet(value: mxw.Wallet) {
        this._wallet = value;
    }


    public create(): Promise<mxw.nonFungibleToken.NonFungibleToken> {
        const create = async (): Promise<mxw.nonFungibleToken.NonFungibleToken> =>
            await token.NonFungibleToken.create(this.nonFungibleTokenProperties, this.wallet).then((token) => {
                return token as token.NonFungibleToken;
            });

        return create();
    }

}



