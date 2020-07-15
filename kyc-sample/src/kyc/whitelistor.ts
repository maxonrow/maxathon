import { mxw, auth } from 'mxw-sdk-js/dist/index';

export default class KycWhitelistor {

    public middleware: mxw.Wallet;
    public transaction: mxw.KycTransaction;
    constructor(middleware: mxw.Wallet, transaction: mxw.KycTransaction) {
        this.middleware = middleware;
        this.transaction = transaction;
    }


    public whitelist() {
        const whitelistReceiptPromise = async (signedTransaction: mxw.KycTransaction): Promise<mxw.providers.TransactionReceipt> =>
            auth.Kyc.create(this.middleware).then(async (kyc) => {
                console.log('STEP 9', 'Whitelist Wallet Address');
                let receipt: mxw.providers.TransactionReceipt = await kyc.whitelist(signedTransaction);
                console.log('STEP 9', 'Done !!!');
                return receipt;

            });



        return whitelistReceiptPromise(this.transaction);

    }


}