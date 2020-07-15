import { nodeProvider } from './node/node';
import { mxw } from 'mxw-sdk-js/dist/index';
import KycData from './kyc/data';
import kycProvider from './kyc/provider';
import KycIssuer from './kyc/issuer';
import KycValidator from './kyc/validator';
import KycWhitelistor from './kyc/whitelistor';

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
      if (silentRpc) {
        console.log('request', JSON.stringify(args.request));
        console.log('response', JSON.stringify(args.response));
      }
    }
  })
  .on('responseLog', function (args) {
    if (silentRpc) {
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



const run = async () => {
  /**
   * Sign KYC address
   */
  const kycData: mxw.KycData = await new KycData(wallet).signKycAddress();

  /**
   * Provider Sign KYC Data
   */
  const partialSignedTrx: mxw.KycTransaction = await new kycProvider(provider, kycData).signTransaction();

  /**
   *  Issuer Sign KYC Data
   */
  const allSignedTrx: mxw.KycTransaction = await new KycIssuer(issuer, partialSignedTrx).signTransaction();

  /**
   * Verify Transaction Signature
   */
  const isValidSignature: Boolean = await new KycValidator(allSignedTrx).isValidSignature();

  /**
   * Whitelist a Wallet Address
   */
  const whitelistReceipt: mxw.providers.TransactionReceipt = await new KycWhitelistor(middleware, allSignedTrx).whitelist();
  console.log('Wallet Address', '-', wallet.address);
  console.log('Wallet Mnemonic', '-', wallet.mnemonic);
  console.log('Receipt Hash', '-', whitelistReceipt.hash);

  let result: String = await (isValidSignature && wallet.isWhitelisted()) ? 'KYC Process Completed !!' : 'KYC Process Failed !!';

  console.log('\x1b[33m%s\x1b[0m', result);  //yellow

  process.exit();

  //http://localhost:26657/is_whitelisted?address=%22mxw1xrqwfukpg8eehqyyza3lz0k6vlhq5r0ldk3zdx%22
  //http://localhost:26657/decoded_tx?hash=0xd9cbc37adef8950b045af5e5ec89fd2ebf4dc1286fc88ce5843819c47ed1786a
}

run();
