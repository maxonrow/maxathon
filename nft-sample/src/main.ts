import { nodeProvider } from './node/node';
import { mxw ,nonFungibleToken as token} from 'mxw-sdk-js/dist/index';
import NonFungibleToken from './nft/token';
import Creator from './nft/creator';
import Util from './util/util'
import Approver from './nft/approver';
import Minter from './nft/minter';

let silentRpc = nodeProvider.trace.silentRpc;
let providerConnection: mxw.providers.Provider;
let provider: mxw.Wallet;
let issuer: mxw.Wallet;
let middleware: mxw.Wallet;
let feeCollector: String;
let wallet: mxw.Wallet;
let nonFungibleToken: token.NonFungibleToken;
let issuerNonFungibleToken: token.NonFungibleToken;

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

provider = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.provider).connect(providerConnection);

issuer = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.issuer).connect(providerConnection);

middleware = mxw.Wallet.fromMnemonic(nodeProvider.nonFungibleToken.middleware).connect(providerConnection);

feeCollector =  nodeProvider.nonFungibleToken.feeCollector 

wallet = mxw.Wallet.fromMnemonic(nodeProvider.kyc.issuer).connect(providerConnection);


const run = async () => {
  console.log('Create, Approve, Mind, Transfer and Burn Token in progress.....');

  const nftProperties = new NonFungibleToken().nonFungibleTokenProperties;
  const symbol: string =  nftProperties.symbol;

  const creator = new Creator(nftProperties, issuer, wallet);
  issuerNonFungibleToken = await creator.create();
  nonFungibleToken = await Util.reload(symbol, wallet);
  issuerNonFungibleToken = await Util.reload(symbol, issuer);

  const receipt = await new Approver(symbol, provider, issuer, middleware).approve();
  nonFungibleToken = await Util.reload(symbol, wallet);
  issuerNonFungibleToken = await Util.reload(symbol, issuer);
  console.log('receipt', '-', receipt);

  const trxReceipt = await new Minter(symbol, wallet, issuer).mint();
    
  console.log('receipt', '-', trxReceipt);


  console.log('Wallet Address', '-', wallet.address);
  console.log('Wallet Mnemonic', '-', wallet.mnemonic);

  let result: String = "NFT Operation Successfully Completed!";

  console.log('\x1b[33m%s\x1b[0m', result);  //yellow

  process.exit();

}

run();
