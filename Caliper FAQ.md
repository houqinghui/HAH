### I. Environment & Platform & Version ##
**Q:** How do i run caliper to test the blockchain system?  
**A:** Details for setting up Caliper to run benchmark tests on a blockchain system are provided in the [getting started](https://hyperledger.github.io/caliper/docs/1_Getting_Started.html) section of these documentation pages.  
When you run the caliper to test the blockchain, you maybe encounter some errors. If so, you should check the version of tools, SDK and module to make sure the veriosn is right firstly.  
<font size="5">*********************************************************************</font><br /> 
### II.	Configuration Files of Caliper  
**Q:** How can i understand the configuration files in caliper?  
**A:** There are two kinds of configuration files that are used in the caliper, one is the benchmark configuration file, which defines the arguments of the benchmark like workload and monitor type; another is the blockchain configuration file, which specifies the necessary information to help interact with the backend blockchain system.  

a. **Benchmark configuration file**: The benchmark configuration file is named after config-xxx.yaml, which contains test and monitor properties. You can refer to [https://hyperledger.github.io/caliper/docs/2_Architecture.html]() for details.  

b. **Blockchain configuration file**: The blockchain configuration file is named after xxx-yyy.json, "xxx" is the blockchain type, for example fabric, sawtooth, burron or iroha, "yyy" is the version of chaincode, fabric-go.json is the specific example. You can refer to [https://hyperledger.github.io/caliper/docs/Fabric_Configuration.html]() for more information  

c. There are still two kinds of configuration files ralated to the blockchain network. One is docker compose configuration file which defines the detailed information about docker containers of the blockchain nodes, such as docker-compose.yaml. another is default.yaml at the ./config directory, which is used to set the different configuration options (command line and env).  
<font size="5">*********************************************************************</font><br />  

### III. How to Test My Own Fabric Network  
**Q:** How many networks does caliper support currently?  
**A:** Now you can use caliper to test fabric, iroha, composer, sawtooth and burrow. The network topology of fabric contains 2org1peer, 2org2peer, 2org3peer, 3org1peer, 3org2peer, 3org3peer which you can choose to test, for example  2org1peer means that the blockchain network has two organizations and every organization has one peer. You can choose any one, but make sure the configuration files are right.  
<font size="5">*********************************************************************</font><br />  

**Q:** How should i change the network topology that Caliper supports?  
**A:** Caliper supports Fabric, Sawtooth, Iroha, composer and burrow. In every blcokchain system, one or more network topologys are integrated in the Caliper. Below we take the fabric for example, and explain how to change the network topology.  

a.	Before the test, you should regenerate the artifacts based on the network topology, for example certificates and private key. 
 
b.	Modify the docker-compose.yaml according to your network topology, which can start the docker containers of the blockchain nodes.  

c.	Modify the fabric network configuration file according to your fabric network, furthermore you can define your own chaincode to test your network.  

d.	Run caliper to test your blockchain network.  
<font size="5">*********************************************************************</font><br />  

**Q:** How can i test my own fabric network?  
**A:** The caliper is independent with the backend blockchain network. You can use the default use case to test the fabric network. Of course you can use caliper to test your own fabric network that has been deployed by you. If you want to test your own fabric network, please follow the below steps:  
 
a.	You should modify the fabric configuration file such as fabric-node.json according to your own network topology;  

b.	Remove the property `command`, which can start the docker containers of the blockchain nodes.  

c.	If you has installed the chaincode, you should modify the property `deployed` to `true` in the channel property.  
<font size="5">*********************************************************************</font><br />  

**Q:** How can i test the blockchain system that caliper does not support currently？  
**A:** If you want to test the blockchain system that Caliper does not support now, you should write your own blockchain adapter. Firstly let’s look inside and learn about how the whole framework interacts with the backend blockchain system. When the benchmark engine is running, the master process of benchmark engine will call the user defined blockchain class to complete blockchain’s chaincode’s installion. Then, after the master process launches the corresponding clients, each client will do the test. During the test, the client will get current blockchain’s context, run the test scripts, release the blockchain’s context in the end, and return the performance statistics. Hence, if users intend to test the blockchain system which Caliper does not support, the bellows are what the users would concern about.  

a.	Realize the blockchain NBI according to your own blockchain system, for example, you should implement the funcitons ‘init’, ‘prepareClients’, ‘installSmartContract’, ‘getContext’, ‘releaseContext’, ‘invokeSmartContract’, ‘queryState’. Then you should add the blockchain type in the class blockchain’s constructor.  

b.	Add your own blockchain type into the blockchain’s constructor function.  

c.	Add predefined network files into the network folder.  

d.	Add your own network configuration file into the corresponding network folder.  

e.	Add your command which will be executed before or after test, if you want.  

f.	Define your own smart contracts.  

g.	Define your test module.  

h.	Define the installation script.  
<font size="5">*********************************************************************</font><br />  

### IV.	Other Questions Related to Caliper  
**Q:** How can i calculate the throughput TPS?  
**A:** Caliper will record the submitting time and committing time (the time when the tx is committed on the ledger or when the failure occurred) for each tx.
So the send rate is calculated by (Succ+Fail) / (last submitting time - first submitting time).
The throughput is calculated by Succ/(last committing time - first submitting time), here only successful committed txs will be calculated.  
<font size="5">*********************************************************************</font><br />  

### V. Other Questions Related to Backend Blockchain System  

**Q:** How can i test my own chaincode?  
**A:** You can modify the chaincode property information in the blockchain network configuration file according to your own chaincode. You also can put the chaincode file into the ./src/contract directory.  
<font size="5">*********************************************************************</font><br />  

**Q:** How can i test Kafka for the fabric network?  
**A:** Kafka is one of the consensus algorithms. you can refer to [https://hyperledger-fabric.readthedocs.io/en/release-1.2/kafka.html]() for more information.  
<font size="5">*********************************************************************</font><br /> 

**Q:** How can i test multip-hosts for the fabric network?  
**A:** The caliper is independent with the backend blockchain network. When you deploy the multiple hosts’ fabric network, you should modify the fabric configuration file according to your own network, then run the caliper to test the blockchain system.  
<font size="5">*********************************************************************</font><br />  

**Q:** How can i use the TLS?  
**A:** Fabric supports for secure communication between nodes using TLS. TLS communication can use both one-way (server only) and two-way (server and client) authentication. You can refer to [https://hyperledger-fabric.readthedocs.io/en/release-1.4/enable_tls.html]() for more information  
<font size="5">*********************************************************************</font><br />  

**Q:** How can i monitor the remote docker?  
**A:** If you need to access the Docker daemon remotely, you need to enable the `tcp` Socket. Beware that the default setup provides un-encrypted and un-anthenticated direct access to the Docker daemon.You can listen on port `2375` on all network interfaces with `-H tcp://0.0.0.0:2375`, or on a particular networ interface using its IP address: `-H tcp://192.169.59.103:2375`. The belows are what you would concern about.

a. You can add `-H tcp://0.0.0.0:2375` to the `ExecStart` in the `/lib/systemd/systemd/docker.service` file, for example `ExecStart=/usr/bin/dockerd -H tcp：//0.0.0.0:2357 -H unix:///var/run/docker.sock`. 

b. Restart the daemon with `systemctl daemon-reload`.

c. Restart the service `sudo service docker restart`.

d. Check if the port is open. You can run `netstat -nptl`, if not, you can run `sudo ufw allow port` to open it.
<font size="5">*********************************************************************</font><br />
