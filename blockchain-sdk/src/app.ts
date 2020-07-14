import { nodeProvider } from './env';
import { mxw, auth, utils } from 'mxw-sdk-js/dist/index';
import { sha256, toUtf8Bytes } from 'mxw-sdk-js/dist/utils'
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
console.log('provider', provider);

// mxw1ngx32epz5v5gyunepkarfh4lt0g6mqr79aq3ex
issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer);
console.log('issuer', issuer);

// mxw1mklypleqjhemrlt6z625rzqa0jl6namdmmqnx4
middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(providerConnection);
console.log('middleware', middleware);


let wallet = mxw.Wallet.createRandom().connect(providerConnection);
console.log('Wallet Address', '-', wallet.address);
console.log('Wallet Mnemonic', '-', wallet.mnemonic);



/**
  * Sign KYC address
  */
let kycDataPromise = auth.Kyc.create(wallet).then(async (kyc) => {
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
  console.log('KYC Data', JSON.stringify(data));
  console.log('KYC Address', JSON.stringify(kycAddress));
  return data;
})



/**
  * Provider Sign KYC Data
  */
auth.Kyc.create(provider).then(async (kyc) => {

  let kycData = await kycDataPromise.then(kycData => kycData);

  let kycTransaction = {
    payload: kycData,
    signatures: []
  };
  let transaction = await kyc.signTransaction(kycTransaction);
  console.log("KYC Transaction Signature Length", transaction.signatures);
  console.log("KYC Transaction Signature Payload", transaction.payload);


});


