import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';
import { NonFungibleToken } from 'mxw-sdk-js/dist/non-fungible-token';
import { TransactionReceipt } from 'mxw-sdk-js/dist/providers/abstract-provider';

export default class Minter {

    #symbol: string;
    #itemId: string;

    constructor(symbol: string, itemId: string) {
        this.#symbol = symbol;
        this.#itemId = itemId;

    }

    public get symbol(): string {
        return this.#symbol;
    }
    public set symbol(value: string) {
        this.#symbol = value;
    }

    public async mint(minter: mxw.Wallet, address: string) : Promise<TransactionReceipt> {
        let nftMinter: token.NonFungibleToken =
            new NonFungibleToken(this.#symbol, minter);

        const itemProp = {
            symbol: this.#symbol,
            itemID: this.#itemId,
            properties: "item properties",
            metadata: "item metadata"
        } as token.NonFungibleTokenItem;

        return nftMinter.mint(address, itemProp) as Promise<TransactionReceipt>;
    };

}