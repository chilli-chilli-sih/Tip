// Check if Web3 is available (if Metamask is installed)
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('MetaMask is not installed. Please install it to use this app.');
}

// Web3.js setup
let web3;
let contract;
let accounts;
const contractAddress = '0x8fBe52ed6d6F577d408f20Ac0f3c041b06111BEb';  // Replace with your contract's address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "funder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ContractFunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TipSent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "fundContract",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "providerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tipAmount",
				"type": "uint256"
			}
		],
		"name": "tipProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

async function initWeb3() {
    // Initialize web3 with Metamask provider
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    accounts = await web3.eth.getAccounts();
    document.getElementById('walletAddress').innerText = `Wallet: ${accounts[0]}`;

    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Load initial contract balance
    loadContractBalance();
}

async function loadContractBalance() {
    const balance = await contract.methods.getContractBalance().call();
    document.getElementById('balance').innerText = `Contract Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
}

// Fund the contract
async function fundContract() {
    const amount = document.getElementById('fundAmount').value;
    if (amount <= 0) {
        alert('Please enter a valid amount to fund.');
        return;
    }

    const weiAmount = web3.utils.toWei(amount, 'ether');
    await contract.methods.fundContract().send({ from: accounts[0], value: weiAmount });

    loadContractBalance();  // Reload balance
}

// Send a tip
async function sendTip() {
    const providerAddress = document.getElementById('providerAddress').value;
    const tipAmount = document.getElementById('tipAmount').value;

    if (!web3.utils.isAddress(providerAddress)) {
        alert('Please enter a valid provider address.');
        return;
    }

    if (tipAmount <= 0) {
        alert('Please enter a valid tip amount.');
        return;
    }

    const weiAmount = web3.utils.toWei(tipAmount, 'ether');
    await contract.methods.tipProvider(providerAddress, weiAmount).send({ from: accounts[0] });

    loadContractBalance();  // Reload balance
}

// Connect wallet button handler
document.getElementById('connectWalletBtn').addEventListener('click', initWeb3);

// Fund contract button handler
document.getElementById('fundContractBtn').addEventListener('click', fundContract);

// Send tip button handler
document.getElementById('sendTipBtn').addEventListener('click', sendTip);

