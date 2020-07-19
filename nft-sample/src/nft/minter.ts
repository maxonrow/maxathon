import { mxw, nonFungibleToken as token } from 'mxw-sdk-js/dist/index';
import * as crypto from "crypto";
import { NonFungibleToken } from 'mxw-sdk-js/dist/non-fungible-token';
import { TransactionReceipt } from 'mxw-sdk-js/dist/providers/abstract-provider';

export default class Minter {

    #symbol: string;
    #wallet: mxw.Wallet;
    #issuer: mxw.Wallet;

    constructor(symbol: string, wallet: mxw.Wallet, issuer: mxw.Wallet) {
        this.#symbol = symbol;
        this.#wallet = wallet;
        this.#issuer = issuer;
    }

    public get wallet(): mxw.Wallet {
        return this.#wallet;
    }
    public set wallet(value: mxw.Wallet) {
        this.#wallet = value;
    }
    public get symbol(): string {
        return this.#symbol;
    }
    public set symbol(value: string) {
        this.#symbol = value;
    }
    public get issuer(): mxw.Wallet {
        return this.#issuer;
    }
    public set issuer(value: mxw.Wallet) {
        this.#issuer = value;
    }


    public async mint() : Promise<TransactionReceipt> {
        let nftMinter: token.NonFungibleToken =
            new NonFungibleToken(this.#symbol, this.#wallet);

        
        const itemProp = {
            symbol: this.#symbol,
            itemID: crypto.randomBytes(16).toString('hex'),
            properties: "item properties",
            metadata: "item metadata"
        } as token.NonFungibleTokenItem;

        return nftMinter.mint(this.#issuer.address, itemProp) as Promise<TransactionReceipt>;
    };

}