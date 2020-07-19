import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class Creator {

    #nonFungibleTokenProperties: token.NonFungibleTokenProperties;
    #issuer: mxw.Wallet;
    #wallet: mxw.Wallet;

    public constructor(
        nonFungibleTokenProperties: token.NonFungibleTokenProperties,
        issuer: mxw.Wallet,
        wallet: mxw.Wallet) {
        this.#nonFungibleTokenProperties = nonFungibleTokenProperties;
        this.#issuer = issuer;
        this.#wallet = wallet;
    }

    public get nonFungibleTokenProperties(): token.NonFungibleTokenProperties {
        return this.#nonFungibleTokenProperties;
    }
    public set nonFungibleTokenProperties(value: token.NonFungibleTokenProperties) {
        this.#nonFungibleTokenProperties = value;
    }
    public get issuer(): mxw.Wallet {
        return this.#issuer;
    }
    public set issuer(value: mxw.Wallet) {
        this.#issuer = value;
    }
    public get wallet(): mxw.Wallet {
        return this.#wallet;
    }
    public set wallet(value: mxw.Wallet) {
        this.#wallet = value;
    }


    public create(): Promise<mxw.nonFungibleToken.NonFungibleToken> {
        const create = async (): Promise<mxw.nonFungibleToken.NonFungibleToken> =>
            await token.NonFungibleToken.create(this.nonFungibleTokenProperties, this.issuer).then((token) => {
                return token as token.NonFungibleToken;
            });

        return create();
    }

}



