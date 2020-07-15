import { mxw, auth } from 'mxw-sdk-js/dist/index';

export default class KycProvider {
    public provider: mxw.Wallet;
    public kycData: mxw.KycData;
    constructor(provider: mxw.Wallet, kycData: mxw.KycData,) {
        this.provider = provider;
        this.kycData = kycData;
    }

    public signTransaction() {

        const providerSignedTrxPromise = async (kycData: mxw.KycData): Promise<mxw.KycTransaction> =>
            auth.Kyc.create(this.provider).then(async (kyc) => {
                console.log('STEP 3', 'Provider Sign KYC Data Started');

                let nonSignedTransaction = {
                    payload: kycData,
                    signatures: []
                };
                let transaction = await kyc.signTransaction(nonSignedTransaction);
                console.log('STEP 4', 'Done!!!');
                return transaction;
            });

        return providerSignedTrxPromise(this.kycData);
    }
}