import { hexlify, randomBytes, bigNumberify } from 'mxw-sdk-js/dist/utils'
import { nodeProvider } from "../node/node";
import { nonFungibleToken as token } from 'mxw-sdk-js/dist/index';

export default class NonFungibleToken {
    private _nonFungibleTokenProperties: token.NonFungibleTokenProperties;

    public constructor() {
        let symbol = "NFT" + hexlify(randomBytes(4)).substring(2);
        this._nonFungibleTokenProperties = {
            name: "MY" + symbol,
            symbol: symbol,
            fee: {
                to: nodeProvider.nonFungibleToken.feeCollector,
                value: bigNumberify("1")
            },
            metadata: "metadata",
            properties: "properties"
        };
    }

    public get nonFungibleTokenProperties(): token.NonFungibleTokenProperties {
        return this._nonFungibleTokenProperties;
    }
    public set nonFungibleTokenProperties(value: token.NonFungibleTokenProperties) {
        this._nonFungibleTokenProperties = value;
    }


}

