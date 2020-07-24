import { mxw } from "mxw-sdk-js";
import { NonFungibleTokenItem } from "mxw-sdk-js/dist/non-fungible-token-item";

export default class Transferer {

    public symbol: string;
    public itemId: string;
    public issuer: mxw.Wallet;

    constructor(symbol: string, itemId: string, issuer: mxw.Wallet) {
        this.symbol = symbol;
        this.itemId = itemId;
        this.issuer = issuer;
    }

    public async transfer(address: string){
        let mintedNFTItem: NonFungibleTokenItem = 
        await NonFungibleTokenItem.fromSymbol(this.symbol, this.itemId, this.issuer);
        return await mintedNFTItem.transfer(address);
    }

}