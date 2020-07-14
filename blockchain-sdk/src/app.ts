import { nodeProvider } from './env';
import { mxw, auth, utils } from 'mxw-sdk-js/dist/index';
import { computeAddress, sha256, toUtf8Bytes } from 'mxw-sdk-js/dist/utils'
import { sortObject } from 'mxw-sdk-js/dist/utils/misc';

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;

/**
  * KYC initialization
  */
providerConnection = new mxw.providers.JsonRpcProvider(
  nodeProvider.connection,
  nodeProvider
)
  .on('rpc', function (args) {
    if ('response' == args.action) {
      if (!silentRpc) {
        console.log('request', JSON.stringify(args.request));
        console.log('response', JSON.stringify(args.response));
      }
    }
  })
  .on('responseLog', function (args) {
    if (!silentRpc) {
      console.log(
        'responseLog',
        JSON.stringify({ info: args.info, response: args.response })
      );
    }
  });

provider = mxw.Wallet.fromMnemonic(nodeProvider.kyc.provider).connect(providerConnection);

// mxw1ngx32epz5v5gyunepkarfh4lt0g6mqr79aq3ex
issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer);

// mxw1mklypleqjhemrlt6z625rzqa0jl6namdmmqnx4
middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(providerConnection);

let wallet = mxw.Wallet.createRandom().connect(providerConnection);
console.log('Wallet Address', '-', wallet.address);
console.log('Wallet Mnemonic', '-', wallet.mnemonic);



/**
  * Sign KYC address
  */
const kycDataPromise = async (): Promise<mxw.KycData> =>
  auth.Kyc.create(wallet).then(async (kyc) => {
    console.log('STEP 1', 'Sign KYC address Started');
    let seed = sha256(toUtf8Bytes(JSON.stringify(sortObject({
      juridical: ['', ''].sort(),
      seed: utils.getHash(utils.randomBytes(32))
    }))));

    let kycAddress = kyc.getKycAddress({
      country: 'MY',
      idType: 'NIC',
      id: wallet.address,
      idExpiry: 20200101,
      dob: 19800101,
      seed
    });

    const data = await kyc.sign(kycAddress);
    console.log('STEP 2', 'Done!!!');

    return data;
  })


/**
  * Provider Sign KYC Data
  */
const providerSignedTrxPromise = async (kycData: mxw.KycData): Promise<mxw.KycTransaction> =>
  auth.Kyc.create(provider).then(async (kyc) => {
    console.log('STEP 3', 'Provider Sign KYC Data Started');

    let nonSignedTransaction = {
      payload: kycData,
      signatures: []
    };
    let transaction = await kyc.signTransaction(nonSignedTransaction);
    console.log('STEP 4', 'Done!!!');
    return transaction;
  });


/**
* Issuer Sign KYC Data
*/
const issuerSignedTrxPromise = async (providerSignedTransaction: mxw.KycTransaction): Promise<mxw.KycTransaction> =>
  auth.Kyc.create(issuer).then(async (kyc) => {
    console.log('STEP 5', 'Issuer Sign KYC Data Started');

    let transaction = await kyc.signTransaction(providerSignedTransaction);
    console.log('STEP 6', 'Done!!!');

    return transaction;
  });


/**
* Verify Transaction Signature
*/
const isValidSignaturePromise = async (providerIssuerSignedTrx: mxw.KycTransaction): Promise<Boolean> => {
  console.log('STEP 7', 'Verify Transaction Signature Started');

  let isValid: Boolean = providerIssuerSignedTrx.signatures.every((signature): Boolean => {

    let payload = JSON.stringify(providerIssuerSignedTrx.payload);
    let address = computeAddress(signature.pub_key.value);
    return mxw.utils.verify(payload, signature.signature, address);
  });
  console.log('STEP 8', 'Done!!!');

  return isValid;

}

/**
  * Whitelist a Wallet Address
  */
const whitelistReceiptPromise = async (validTrx: mxw.KycTransaction): Promise<mxw.providers.TransactionReceipt> =>
  auth.Kyc.create(middleware).then(async (kyc) => {

    let signedTransaction = validTrx;
    return await kyc.whitelist(signedTransaction);
  });

const run = async () => {
  const kycData: mxw.KycData = await kycDataPromise();
  const providerSignedTrx: mxw.KycTransaction = await providerSignedTrxPromise(kycData);
  const providerIssuerSignedTrx: mxw.KycTransaction = await issuerSignedTrxPromise(providerSignedTrx);
  const isValidSignature: Boolean = await isValidSignaturePromise(providerIssuerSignedTrx);
  const whitelistReceipt: mxw.providers.TransactionReceipt = await whitelistReceiptPromise(providerIssuerSignedTrx);
  console.log('isValidSignature', isValidSignature);
  console.log('receiptHash', whitelistReceipt.hash);
  console.log('isWhitelisted', await wallet.isWhitelisted())

  //http://localhost:26657/is_whitelisted?address=%22mxw1xrqwfukpg8eehqyyza3lz0k6vlhq5r0ldk3zdx%22
  //http://localhost:26657/decoded_tx?hash=0xd9cbc37adef8950b045af5e5ec89fd2ebf4dc1286fc88ce5843819c47ed1786a
}

run();
