import { nodeProvider } from './env';
import { mxw, auth, utils } from 'mxw-sdk-js/dist/index';
import { computeAddress, sha256, toUtf8Bytes } from 'mxw-sdk-js/dist/utils'
import { sortObject } from 'mxw-sdk-js/dist/utils/misc';

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;
let kycTransactionPromise: Promise<mxw.KycTransaction>;

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
 console.log('STEP 1','Sign KYC address');
let kycDataPromise = auth.Kyc.create(wallet).then(async (kyc) => {
  console.log('STEP 1','Started');
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
  console.log('STEP 1','Completed');

  return data;
})



/**
  * Provider Sign KYC Data
  */
 console.log('STEP 2','Provider Sign KYC Data');

kycTransactionPromise = auth.Kyc.create(provider).then(async (kyc) => {
  console.log('STEP 2','Started');

  let nonSignedTransaction = {
    payload: await kycDataPromise.then(kycData => kycData),
    signatures: []
  };
  let transaction = await kyc.signTransaction(nonSignedTransaction);
  console.log('STEP 2','Completed');
  return transaction;
});


/**
  * Issuer Sign KYC Data
  */
 console.log('STEP 3','Issuer Sign KYC Data');

kycTransactionPromise = auth.Kyc.create(issuer).then(async (kyc) => {
  console.log('STEP 3','Started');

  let providerSignedTransaction = await kycTransactionPromise
    .then(transaction => transaction)
    console.log('STEP 3','Completed');

  return await kyc.signTransaction(providerSignedTransaction);
});


/**
  * Verify Transaction Signature
  */
 console.log('STEP 4','Verify Transaction Signature');

const isValidSignature = async () => {
  console.log('STEP 4','Started');
  let issuerSignedTransaction = await kycTransactionPromise
    .then(transaction => transaction);

  issuerSignedTransaction.signatures.every(signature => {
    return mxw.utils.verify(JSON.stringify(
      issuerSignedTransaction.payload), signature.signature, computeAddress(signature.pub_key.value))
  })
  console.log('STEP 4','Completed');
}
isValidSignature().then(value => console.log('is Signature Valid?',value))


/**
  * Whitelist a Wallet Address
  */
 console.log('STEP 5','Whitelist a Wallet Address');

let whitelistReceipt = auth.Kyc.create(middleware).then(async (kyc) => {
  console.log('STEP 5','Started');

  let signedTransaction = await kycTransactionPromise
    .then(transaction => transaction);
    console.log('STEP 5','Completed');
  return await kyc.whitelist(signedTransaction);
});

whitelistReceipt.then(value => console.log('receipt status', value.status))