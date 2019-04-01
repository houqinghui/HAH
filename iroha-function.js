/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
* @file, definition of the Fabric class, which implements the caliper's NBI for hyperledger fabric
*/


'use strict';

const util = require('../../../comm/util.js');
const logger = util.getLogger('factory.js');
import irohaCommands from 'iroha-helpers/lib/commands'
import irohaQueries from 'iroha-helpers/lib/queries'



const commands = function(txType, commandOption, args) {
    try{
        switch(txType.fn) {
        case 'addAssetQuantity':
            return irohaCommands.addAssetQuantity(commandOption, args);
        case 'addPeer':
            return irohaCommands.addPeer(commandOption,args);
        case 'addSignatory':
            return irohaCommands.addSignatory(commandOption,args);
        case 'appendRole':
            return irohaCommands.appendRole(commandOption,args);
        case 'createAccount': 
            return irohaCommands.createAccount(commandOption,args);
        case 'createAsset':
            return irohaCommands.createAsset(commandOption,args);
        case 'createDomain':
            return irohaCommands.createDomain(commandOption,args);
        case 'createRole':
            return irohaCommands.createRole(commandOption,args);
        case 'detachRole':
            return irohaCommands.detachRole(commandOption,args);
        case 'grantPermission':
            return irohaCommands.grantPermission(commandOption,args);
        case 'removeSignatory':
            return irohaCommands.removeSignatory(commandOption,args);
        case 'revokePermission':
            return irohaCommands.revokePermission(commandOption,args);
        case 'setAccountDetail':
            return irohaCommands.setAccountDetail(commandOption,args);
        case 'setAccountQuorum':
            return irohaCommands.setAccountQuorum(commandOption,args);
        case 'subtractAssetQuantity':
            return irohaCommands.subtractAssetQuantity(commandOption,args);
        default:
            throw new Error('Unknown function for iroha');
        }
    }
    catch(err){
        logger.error(err);
        return [];
    }
};

const queries = function(txType, queryOption, args) {
    try{
        switch(txType.fn) {
        case 'getAccount':
            return irohaQueries.getAccount(queryOption,args);
        case 'getSignatories':
            return irohaCommands.getSignatories(queryOption,args);
        case 'getAccountTransactions':
            return irohaQueries.getAccountTransactions(queryOption,args);
        case 'getAccountAssetTransactions':
            return irohaQueries.getAccountAssetTransactions(queryOption,args);
        case 'getTransactions':
            return irohaQueries.getTransactions(queryOption,args);
        case 'getAccountAssets':
            return irohaQueries.getAccountAssets(queryOption,args);
        case 'getAssetInfo':
            return irohaQueries.getAssetInfo(queryOption,args);
        case 'getRoles':
            return irohaQueries.getRoles(queryOption,args);
        case 'GetRolePermissions':
            return irohaQueries.GetRolePermissions(queryOption,args);
        default:
            throw new Error('Unknown function for iroha');
        }
    }
    catch(err){
        logger.error(err);
        return [];
    }
};


module.exports.irohaFunction = {
    commands : commands,
    queries : queries
};
