import { nodeProvider } from './node/node';
import { mxw } from 'mxw-sdk-js/dist/index';
import KycData from './ft/creator';

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;

/**
  * initialization
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

issuer = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer);

middleware = mxw.Wallet.fromMnemonic(nodeProvider.kyc.middleware).connect(providerConnection);

let wallet = mxw.Wallet.createRandom().connect(providerConnection);



const run = async () => {
  
  console.log('Wallet Address', '-', wallet.address);
  console.log('Wallet Mnemonic', '-', wallet.mnemonic);

  let result: String = "Success !!!";

  console.log('\x1b[33m%s\x1b[0m', result);  //yellow

  process.exit();

}

run();
