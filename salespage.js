// Function to load the ABI from the JSON file
async function loadABI() {
    const response = await fetch('contractABI.json');
    return await response.json();
}
        console.log("JavaScript loaded");
        /// loaded script
        document.addEventListener('DOMContentLoaded', async () => {
            console.log("DOM fully loaded and parsed");

            if (typeof window.ethereum !== 'undefined') {
                console.log("MetaMask is installed");

                // Request account access if needed
                await ethereum.request({ method: 'eth_requestAccounts' })
.then(() => console.log("eth request made"))
.catch((error) => console.error("Error during account request:", error));
const contractABI = await loadABI();
                // Create a Web3 instance using MetaMask's provider
                const web3 = new Web3(window.ethereum);
console.log("Web3 instance created");

  const contractAddress = '0x66b1ff225c5d37665bc5756b793ef981ec65413a'; // Replace with your contract address
       const tokenSaleContract = new web3.eth.Contract(contractABI, contractAddress);
 console.log("Contract instance created");

        // Handle form submission
        document.getElementById('buyForm').onsubmit = async (e) => {
            e.preventDefault();
            console.log("Form submitted");

            const amount = document.getElementById('amount').value;
            console.log("Amount entered:", amount);

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                document.getElementById('status').innerText = 'Please enter a valid amount.';
                return;
            }

            try {
                const accounts = await web3.eth.getAccounts();
                console.log("Accounts retrieved:", accounts);
                const from = accounts[0];

                // Convert the amount to Wei (since MATIC is an 18-decimal token)
                const value = web3.utils.toWei(amount, 'ether');
                console.log("Value to send (in Wei):", value);

                // Call the buyTokens function of the contract
                await tokenSaleContract.methods.buyTokens().send({
                    from: from,
                    value: value
                });

                document.getElementById('status').innerText = 'Transaction successful!';
            } catch (error) {
                console.error(error);
                document.getElementById('status').innerText = 'Transaction failed!';
            }
        };
    } else {
        alert('Please install MetaMask!');
    }
        });
