/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
* @file, definition of the Iroha class, which implements the Caliper's NBI for Hyperledger Iroha.
*/


'use strict';

const fs = require('fs');
const grpc = require('grpc');

import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'

import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'

import generateKeypair from 'iroha-helpers/lib/crytoHelper.js'

const util = require('../comm/util.js');
const logger = util.getLogger('iroha.js');
const BlockchainInterface = require('../../comm/blockchain-interface.js');
const irohaType = require('./type.js');
const TxStatus = require('../../comm/transaction');
const {
    command,
    query
} = require('./iroha-function.js');

let contexts = {};

/**
 * Convert between Iroha's Blob type and Uint8Array.
 * @param {iroha.Blob} blob The object with blob data.
 * @return {Uint8Array} The output JS byte array.
 */
function blob2array(blob) {
    let bytearray = new Uint8Array(blob.size());
    for (let i = 0 ; i < blob.size() ; ++i) {
        bytearray[i] = blob.get(i);
    }
    return bytearray;
}

/**
 * Create Iroha transaction and send it to a node.
 * @param {CommandService_v1Client} commandService - GRPC endpoint
 * @param {string} account - creator account id
 * @param {number} time - time of creation
 * @param {iroha.Keypair} keys - keypair to sign
 * @param {Array} commands - transaction commands
 * @returns {Promise} promise with sended transaction
 */
function irohaCommand(commandService, accountId, time, privateKey, commands, quorum) {
    try {

        let commandOptions = {
            privateKeys: [privateKey],
            creatorAccountId: account,
            quorum: quorum,
            commandService,
            timeoutLimit: 5000
        };
        var promises = [];
        for (var i = 0; i < commands.length; i++) {
            let p = command(commandOptions,args);
            promises.push(p);
        }

        Promises.all(promises)
            .then(() => {
                logger.info('Finished create accounts, save key pairs for later use')
                return Promise.resolve();
            }).catch(() => {
                return Promise.reject(new Error('Could not create accounts for Iroha clients'));
            });
    }
    catch(err) {
        logger.error(err);
        return Promise.reject('Failed to submit Iroha transaction');
    }
}

/**
 * Create Iroha query and send it to a node.
 * @param {endpointGrpc.QueryServiceClient} client - GRPC endpoint
 * @param {string} account - creator account id
 * @param {number} time - time of creation
 * @param {number} counter - query counter
 * @param {iroha.Keypair} keys - keypair to sign
 * @param {Array} commands - query commands
 * @param {Function} callback - callback with query response
 * @returns {undefined}
 */
function irohaQuery(queryService, accountId, time,  privateKey, commands, quorum,callback) {
    try {
       let queryOptions = {
        privateKey: privateKey,
        creatorAccountId: accountId,
        queryService,
        timeoutLimit: 5000
       }

       let promises = [];
       for(let i = 0; i < commands.length; i++){
        let p = query(queryOptions,args);
        promises.push(p);
       }

       Promises.all(promises)
            .then(() => {
                logger.info('Finished create accounts, save key pairs for later use')
                return Promise.resolve();
            }).catch(() => {
                return Promise.reject(new Error('Could not create accounts for Iroha clients'));
            })
    }
    catch(err) {
        logger.error(err);
        return Promise.reject('Failed to submit iroha query');
    }
}

/* eslint-disable require-jsdoc */
/**
 * Implements {BlockchainInterface} for a Iroha backend.
 */
class Iroha extends BlockchainInterface {
    constructor(config_path) {
        super(config_path);
        this.statusInterval = null;
    }
    

    init() {
        // TODO: How to judge Iroha service's status elegantly?
        return util.sleep(10000); // Wait for Iroha network to start up
    }

    installSmartContract() {
        // Now Iroha doesn't support smart contract,
        // using internal transactions to construct contracts
        return Promise.resolve();
    }

    prepareClients(number) {
        try{
            logger.info('Creating new account for test clients......');

            // get admin info
            let config = require(this.configPath);
            let admin        = config.iroha.admin;
            let domain       = admin.domain;
            let adminAccount = admin.account + '@' + admin.domain;
            let privPath     = util.resolvePath(admin['key-priv']); //命名规范；
            let pubPath      = util.resolvePath(admin['key-pub']);
            let adminPriv    = fs.readFileSync(privPath).toString();
            let adminPub     = fs.readFileSync(pubPath).toString();

            logger.info(`adminkeys : ${adminkeys}`); // adminKeys 是json结构的数据；

            // test
            logger.info(`Admin's private key: ${adminPriv}`);
            logger.info(`Admin's public key: ${adminPub}`);

            // create account for each client
            let result = [];
            let promises = [];
            let node = this._findNode(); //随机找到一个node节点；
            const commandService = new QueryService_v1Client(
                node.torii,
                grpc.credentials.createInsecure()
            )

            // generate random name, [a-z]
            let seed = 'abcdefghijklmnopqrstuvwxyz';
            let accountNames = [];

            const generateName = function() { //生成不同的name，相同的话就继续执行；
                let name = '';
                for(let i = 0 ; i < 5 ; i++) {
                    name += seed.charAt(Math.floor(Math.random() * seed.length));
                }
                if(accountNames.indexOf(name) < 0) {
                    return name;
                }
                else {
                    return generateName();
                }
            };

            var flagNum = 0;
            for(let i = 0 ; i < number ; i++) {   
                let name = generateName();
                let id   = name + '@' + domain;
                accountNames.push(name);

                keypairs = generateKeypair.generateKeypair();
                result.push({
                    name:    name,
                    domain:  domain,
                    id:      id,
                    pubKey:  keypairs.publicKey, // 可以直接生成key吗？
                    privKey: keypairs.privateKey
                });
                // build create account transaction
                logger.info('Create account for ' + id);
                let commandOptions = {
                    privateKeys: [privateKey],
                    creatorAccountId: account,
                    quorum: quorum,
                    commandService,
                    timeoutLimit: 5000
                  };

                Promise.all({
                    commands.createAccount(commandOptions,{
                            accountName: name
                            domainId: domain
                            publicKey: keypairs.publicKey
                        }
                    ),
                    commands.appendRole(commandOptions,{
                        accountId: id,
                        roleName: 'admin'
                    }),
                    commands.appendRole(commandOptions,{
                        accountId: id,
                        roleName: 'moneyad'
                    })
                })
                .then(a => { //如果三个命令都执行成功了，那么创建账号成功了；
                    logger.info('create account for ${name}')；
                    flagNum += 1;
                    //return Promise.resolve(result);
                }) 
                .catch(e => {
                    logger.info(e)；
                    //return Promise.reject(new Error('Failed to create account for ${name}'));
                })
            } //生成number个account；

            //根据flagNum返回promise对象；
            if (flagNum == number){
                logger.info('create account for 5 clients successfully');
                return Promise.resolve(result);
            }else{
                logger.info('failed to create 5 clients');
                return Promise.reject(new Error('Failed to create account for ${name}'))
            }
    }
    catch(err){
        logger.error(err);
        return Promise.reject(new Error('Failed when prepareClients'));
    }
}

    /**
     * Return the Fabric context associated with the given callback module name.
     * @param {string} name The name of the callback module as defined in the configuration files.
     * @param {object} args Unused.
     * @param {Integer} clientIdx The client index.
     * @param {Object} txFile the file information for reading or writing.
     * @return {object} The assembled Fabric context.
     * @async
     */
    getContext(name, args, clientIdx, txFile) {  // args是prepareClients的返回值。 最后还是invokesmartcontract()函数使用context；
        try {
            if(!args.hasOwnProperty('name') || !args.hasOwnProperty('domain') || !args.hasOwnProperty('id') || !args.hasOwnProperty('pubKey') || !args.hasOwnProperty('privKey')) {
                throw new Error('Invalid Iroha::getContext arguments');
            }
            if(!contexts.hasOwnProperty(args.id)) {
                // save context for later use
                // since iroha requires sequential counter for messages from same account, the counter must be save if getContext are invoked multiple times for the same account
                contexts[args.id] = {
                    name:         args.name,
                    domain:       args.domain,
                    id:           args.id,
                    pubKey:       args.pubKey,
                    privKey:      args.privKey，
                    txCounter:    1,
                    queryCounter: 1
                };


                let config = require(this.configPath);

                // find callbacks for simulated smart contract
                let fc = config.iroha.fakecontract;

                let fakeContracts = {};
                for(let i = 0 ; i < fc.length ; i++) {
                    let contract = fc[i];
                    let facPath  = util.resolvePath(contract.factory);
                    let factory  = require(facPath);
                    for(let j = 0 ; j < contract.id.length ; j++) {
                        let id = contract.id[j];
                        if(!factory.contracts.hasOwnProperty(id)) {
                            throw new Error('Could not get function "' + id + '" in ' + facPath);
                        }
                        else {
                            if(fakeContracts.hasOwnProperty(id)) {
                                logger.warn('WARNING: multiple callbacks for ' + id + ' have been found');
                            }
                            else {
                                fakeContracts[id] = factory.contracts[id];
                            }
                        }
                    }
                }

                let node = this._findNode();
                contexts[args.id].torii = node.torii;
                contexts[args.id].contract = fakeContracts;
            }

            //创建请求
            this.grpcCommandClient = new QueryService_v1Client(
                node.torii,
                grpc.credentials.createInsecure()
            )
            this.grpcQueryClient   = new QueryService_v1Client(
                node.torii,
                grpc.credentials.createInsecure()
            )

            // this.statusWaiting = {};
            // let self = this;

            // return the context
            return Promise.resolve(contexts[args.id]);
        }
        catch (err) {
            logger.error(err);
            return Promise.reject(new Error('Failed when finding access point or user key'));
        }
    }

    releaseContext(context) {
        //if(this.statusInterval) {
            //clearInterval(this.statusInterval);
            //this.statusInterval = null;
       // }
        return Promise.resolve();
    }

        /**
     * Return the Fabric context associated with the given callback module name.
     * @param {json} context: the blockchain context.
     * @param {int} contractID: the number of comtract.
     * @param {string} contractVer the contract language version.
     * @param {json} args workload.
     * @return {int} timeout.
     * @async
     */
    invokeSmartContract(context, contractID, contractVer, args, timeout) {
        let promises = [];
        args.forEach((item, index)=>{
            promises.push(this._invokeSmartContract(context, contractID, contractVer, item, timeout));
        });

        return Promise.all(promises);
    }

    _invokeSmartContract(context, contractID, contractVer, args, timeout) {
        try {
            if(!context.contract.hasOwnProperty(contractID)) {
                throw new Error('Could not find contract named ' + contractID);
            }

            let commands = context.contract[contractID](contractVer, context, args); //factory.js里面simple函数
            if(commands.length === 0) {
                throw new Error('Empty output of contract ' + contractID);  //得到command
            }

            let p;
            let status = new TxStatus(null);
            status.Set('timeout', timeout*1000);

            if(context.engine) {
                context.engine.submitCallback(1);
            } //Submit the transaction.

            let key;
            if(irohaType.commandOrQuery(commands[0].tx) === 0) {  //command 
                p = new Promise((resolve, reject)=>{
                    let counter = context.txCounter;
                    key = context.id+'_command_'+counter;
                    context.txCounter++;
                    irohaCommand(this.grpcCommandClient, context.id, Date.now(), context.privKey, commands)
                        .then(()=>{
                            //status.SetID(txid);
                            //this.statusWaiting[key] = {status:status, resolve:resolve, reject:reject, isquery: false};
                        });
                });
            }
            else {  //query
                p = new Promise((resolve, reject)=>{
                    let counter = context.queryCounter;
                    context.queryCounter++;
                    irohaQuery(this.grpcQueryClient, context.id, Date.now(), counter, context.privKey, commands,
                        (response) => {
                            status.SetStatusSuccess();
                            resolve(status);  // TODO: should check the response?? 为什么不是交易创建时间呢？
                        }
                    )
                        .catch((err)=>{
                            logger.error(err);
                            status.SetStatusFail();
                            resolve(status);
                        });
                });
            }

            return p;
        }
        catch(err) {
            logger.error(err);
            return Promise.reject();
        }
    }

     /**
     * Return the Fabric context associated with the given callback module name.
     * @param {json} context: the blockchain context.
     * @param {int} contractID: the number of comtract.
     * @param {string} contractVer the contract language version.
     * @param {json} args workload.
     * @return {int} timeout.
     * @async
     */
    queryState(context, contractID, contractVer, key, fcn = 'query') {
        try {
            if(!context.contract.hasOwnProperty(contractID)) {
                throw new Error('Could not find contract named ' + contractID);
            }

            let commands = context.contract[contractID](contractVer, context, {verb: fcn, key: key});
            if(commands.length === 0) {
                throw new Error('Empty output of contract ' + contractID);
            }
            let status = new TxStatus(null);
            if(context.engine) {
                context.engine.submitCallback(1);
            }
            return new Promise((resolve, reject)=>{
                let counter = context.queryCounter;
                context.queryCounter++;
                irohaQuery(this.grpcQueryClient, context.id, Date.now(), counter, context.keys, commands,
                    (response) => {
                        status.SetStatusSuccess();
                        resolve(status);  // TODO: should check the response??
                    }
                )
                    .catch((err)=>{
                        logger.error(err);
                        status.SetStatusFail();
                        resolve(status);
                    });
            });
        }
        catch(err) {
            logger.error(err);
            return Promise.reject();
        }
    }





    _findNode() {
        let nodes  = [];
        let config = require(this.configPath);
        for(let i in config.iroha.network) { //i是config.iroha.network中的key；
            if(config.iroha.network[i].hasOwnProperty('torii')) {
                nodes.push(config.iroha.network[i]); //变换成一个数组；
            }
        }
        if(nodes.length === 0) {
            throw new Error('Could not find valid access points');
        }
        return nodes[Math.floor(Math.random()*(nodes.length))];  //Math.random()随机生成一个随机数0.0~1.0之间的；
    }

}
module.exports = Iroha;
/* eslint-enable require-jsdoc */
