## Caliper FAQ ##
### I. Environment, Platform, Version ##
**Q:** How to run caliper to test blockchain system?  
**A:** Currently caliper supports Fabric, Sawtooth, Iroha, composer and burrow. Follow the below steps to run caliper.  
a. Make sure following tools are installed.  

+ NodeJS 8.x  
+ Node-gyp 
+ Docker
+ Docker-compose  

b. Run `npm install` in caliper root folder to install dependencies locally.  
c.	Install blockchain SDK  

+  Fabric: run `npm run fabric-v1.0-deps`, `npm run fabric-v1.1-deps`, or `npm run fabric-v1.2-deps` in the root folder. There are three versions that calilper supports , you can choose one you prefer.
+  Sawtooth: run `npm run sawtooth-deps` in the root folder. If you want to test sawtooth with a specific version such as v1.0.5, you should install directly, run `npm install protocol-buffers sawtooth-sdk@1.0.5` in caliper’s root folder.
+  Iroha: run `npm run iroha-deps` in the root folder, if you want to test iroha with a specific version such as v0.1.7, you should install directly, run `npm install –no-save iroha-lib@0.1.7` in caliper’s root folder.
+  Composer: run `npm run composer-deps` in the root folder. If you want to test composer with a specific such as v0.19.0, you should install directly, run `npm install  --no-save composer-admin@0.19.0 composer-client@0.19.0 composer-common@0.19.0 fabric-ca-client@1.2.0 fabric-client@1.2.0` in caliepr’s root folder.  
+  Burrow: run `npm run burrow-deps` in the root folder.  

d.	Run the caliper. There are two ways to run the caliper：  

+ Run `node benchmark/simple/main.js  -c yourconfig.yaml`.
+ Run `npm run list` to list all available benchmarks, then use `npm test` to run a benchmark with specific configuration file. For example, run `npm test – simple –c ./benchmark/simple/config.yaml`.

　　When you run the caliper to test the blockchain, you maybe encounter some errors. If so, you should check the version of tools, SDK and module to make sure the veriosn is right first. You also can refer to the document web [https://hyperledger.github.io/caliper/docs/1_Getting_Started.html]() for more information.  
<font size="5">*********************************************************************</font><br /> 
### II.	Configuration files of caliper  
**Q:** How to understand the configuration file in caliper?  
**A:** There are two kind of configuration that are used in caliper, one is the benchmark configuration, which defines the arguments of the benchmark like the workload; another is the blockchain configuration file, which specifies necessary information to help interacting with the backend blockchain system.  

a. **Benchmark configuration file**: the benchmark configuration file is named after confi-xxx.yaml, which contains test and monitor properties. The test property defines the metadata of the test, as well as multiple test rounds with specified workload. The monitor property defines the type of resource monitor and monitored object, as well as the time interval for the monitoring. You can refer to https://hyperledger.github.io/caliper/docs/2_Architecture.html for detailed information.  

b. **Blockchain configuration file**: the blockchain configuration file is named after xxx-yyy.json, xxx is the blockchain type, for example fabric, sawtooth, burron or iroha, fabric-go.json is the specific example. The fabric-go.json file contains caliper, fabric and info properties.the Caliper property defines the blockchain type and the command which can start the docker container services of the blockchain nodes. The fabric property defines fabric network topology. The info propery provides supplementary information for the test case. You can refer to [https://hyperledger.github.io/caliper/docs/Fabric_Configuration.html]() for more information  

c. There are still two kind configuration files ralated to the blockchain network. One is docker compose configuration file which defines the detailed information about docker containers of the blockchain nodes, such as docker-compose.yaml. another is default.yaml at the ./config directory, which is used to set the different configuration options (command line and env).  
<font size="5">*********************************************************************</font><br />  

### III. How to test my own fabric network  
**Q:** How many networks does caliper supports currently?  
**A:** Now you can use caliper to test fabric, iroha, composer, sawtooth and burrow. The network topology of fabric contains 2org1peer, 2org2peer, 2org3peer, 3org1peer, 3org2peer, 3org3peer. 2org1peer means that the network has two organizations and every organization has one peer. You can choose any one, but make sure the configuration file is right.  
<font size="5">*********************************************************************</font><br />  

**Q:** How to change the network topology to test the blockchain that Caliper supports?  
**A:** Caliper supports Fabric, Sawtooth, Iroha, composer and burrow. In every blcokchain system, one or more network topologys are integrated in Caliper. Below we take fabric for example, and explain how to change network topology to test fabric.  

a.	Before the test, you should regenerate the artifacts based on the network topology, for example certificates and private key. 
 
b.	Modify the docker-compose.yaml according to your network topology, which can start the docker containers of the blockchain nodes.  

c.	Modify the fabric network configuration file according to your fabric network, furthermore you can define your own chaincode to test your network.  

d.	Run caliper to test your blockchain network.  
<font size="5">*********************************************************************</font><br />  

**Q:** How to test your own fabric network?  
**A:** The caliper is independent with the backend blockchain network. You can use the default user case to test the fabric network. Of course you can use caliper to test your own fabric network that has been deployed by you. If you want to test your own fabric network, please follow the below steps:  
 
a.	You should modify the fabric configuration file such as fabric-node.json according to your own network topology;  

b.	Remove the property command, which can start the docker containers of the blockchain nodes.  

c.	If you has installed the chaincode, you should modify the property deployed to true in the channel property.  
<font size="5">*********************************************************************</font><br />  

**Q:** How to test the blockchain system that caliper does not support currently？  
**A:** If you want to test blockchain system that Caliper does not support now, you should write your own blockchain adapter. Firstly let’s look inside and learn about how the whole framework interact with the backend blockchain system. When the benchmark engine is running, the master process of benchmark engine will call the user defined blockchain class to complete blockchain’s chaincode’s installion. Then, after the master process launches the corresponding clients, each client will do the test. During the test, the client will get current blockchain’s contest, run the test scripts, release the blockchain’s context in the end, and return the performance statistics. Hence, if users intend to test the blockchain system which Caliper does not support, the bellows are what the users world concern about.  

a.	Realize the blockchain NBI according to your own blockchain system, for example, you should implement the funcitons ‘init’, ‘prepareClients’, ‘installSmartContract’, ‘getContext’, ‘releaseContext’, ‘invokeSmartContract’, ‘queryState’. Then you should add the blockchain type in the class blockchain’s constructor.  

b.	Add your own blockchain type into the blockchain’s constructor function.  

c.	Add predefined network files into the network folder.  

d.	Add your own network configuration file into the corresponding network folder.  

e.	Add your command which will be executed before or after test, if you want.  

f.	Define your own smart contracts.  

g.	Define your test module.  

h.	Define the installation script.  
<font size="5">*********************************************************************</font><br />  

### IV.	Other questions related to caliper  
**Q:** How to calculate the throughput TPS?  
**A:** Caliper will record the submitting time and committing time (the time when the tx is committed on the ledger or when the failure occurred) for each tx.
So the send rate is calculated by (Succ+Fail) / (last submitting time - first submitting time).
The throughput is calculated by Succ/(last committing time - first submitting time), here only successful committed txs will be calculated.  
<font size="5">*********************************************************************</font><br />  

### V. Other questions related to backend blockchain system  

**Q:** How to test your own chaincode?  
**A:** Modify the chaincode property information in the blockchain network configuration file according to your own chaincode. You also can put the chaincode file into the ./src/contract directory.  
<font size="5">*********************************************************************</font><br />  

**Q:** How to test Kafka for fabric?  
**A:** Kafka is one of the consensus algorithms, please refer to [https://hyperledger-fabric.readthedocs.io/en/release-1.2/kafka.html]() for more information.  
<font size="5">*********************************************************************</font><br /> 

**Q:** How to test multip-hosts for fabric?  
**A:** The caliper is independent with the backend blockchain network. When you deploy the multiple hosts’ fabric network, you should modify the fabric configuration file according to your own network, then run the caliper to test the blockchain system.  
<font size="5">*********************************************************************</font><br />  

**Q:** How to use the TLS?  
**A:** Fabric supports for secure communication between nodes using TLS. TLS communication can use both one-way (server only) and two-way (server and client) authentication, please refer to [https://hyperledger-fabric.readthedocs.io/en/release-1.4/enable_tls.html]() for more information  
<font size="5">*********************************************************************</font><br />
