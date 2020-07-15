import { mxw, auth } from 'mxw-sdk-js/dist/index';

export default class KycIssuer {
    public issuer: mxw.Wallet;
    public transaction: mxw.KycTransaction;
    constructor(issuer: mxw.Wallet, transaction: mxw.KycTransaction,) {
        this.issuer = issuer;
        this.transaction = transaction;
    }

    public signTransaction() {

        const issuerSignedTrxPromise = async (providerSignedTransaction: mxw.KycTransaction): Promise<mxw.KycTransaction> =>
            auth.Kyc.create(this.issuer).then(async (kyc) => {
                console.log('STEP 5', 'Issuer Sign KYC Data Started');

                let transaction = await kyc.signTransaction(providerSignedTransaction);
                console.log('STEP 6', 'Done!!!');

                return transaction;
            });

        return issuerSignedTrxPromise(this.transaction);
    }
}