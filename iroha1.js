// for usage with grpc package use endpoint_grpc_pb file
import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from '../lib/proto/endpoint_grpc_pb'

import commands from '../lib/commands'
import queries from '../lib/queries'
import txHelper from '../lib/txHelper.js'
//import util from '../lib/util.js'
const util = require("../lib/util");

const IROHA_ADDRESS = 'localhost:50051'

let adminPriv =
  'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'
let publicKey = '313a07e6384776ed95447710d15e59148473ccfc052a681317a72a69f2a49910'

const commandService = new CommandService_v1Client(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

const queryService = new QueryService_v1Client(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

let tx = txHelper.addCommand(txHelper.emptyTransaction(), 'setAccountDetail', {
    accountId: 'admin@test',
    key: 'caliper',
    value: 'caliper'
  });

let txToSend = txHelper.addMeta(tx,{
    creatorAccountId: 'admin@test',
    quorum: 1
});

let txSend = util.signWithArrayOfKeys(txToSend,[adminPriv]);

//console.log('txSend ' + txSend);

let hash = txHelper.hash(txSend).toString('hex');

console.log('transaction hash: ' + hash)

Promise.all([
  commands.setAccountDetail({
    privateKeys: [adminPriv],
    creatorAccountId: 'admin@test',
    quorum: 1,
    commandService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test',
    key: 'caliper',
    value: 'caliper'
  }),
  queries.getAccount({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test'
  }),
  queries.getAccountDetail({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test'
  }),
  queries.getSignatories({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test'
  }),
  queries.getRoles({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }),
  queries.getAccount({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test'
  }),
  queries.getAccountTransactions({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    accountId: 'admin@test',
    pageSize: 5
  })
])
  .then(a => {
    // let transactionsList = a[a.length - 1].transactionsList
    // console.log(transactionsList[transactionsList.length - 1])
    console.log(a);
    return queries.getTransactions({
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  }, {
    txHashesList: [hash]
  });
  })
  .then(a => {
    console.log(a);
  })
  .catch(e => console.error(e))

  // queries.getAccountTransactions({
  //   privateKey: adminPriv,
  //   creatorAccountId: 'admin@test',
  //   queryService,
  //   timeoutLimit: 5000
  // }, {
  //   accountId: 'admin@test',
  //   pageSize: 5
  // }).then(a => {

  //  return queries.getTransaction(hash);

  //   console.log(a.transactionsList[0]);
  // }).then(a => {
  //   console.log('committed transaction' + a)
  // }).catch(e => {

  // })
