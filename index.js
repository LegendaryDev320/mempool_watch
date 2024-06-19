const { ethers } = require('ethers');
require("dotenv").config();

// Initialize WebSocket provider from Infura
const provider = new ethers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`);
const UNISWAP_V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
// Subscribe to pending transactions
provider.on('pending', async (txHash) => {
  try {
    const transaction = await provider.getTransaction(txHash);
    if (transaction) {
      const toAddress = transaction.to.toLowerCase();
      const input = transaction.data.toLowerCase();

      // Check if the transaction is related to a Uniswap V2 pair creation or swap
      if (toAddress === UNISWAP_V2_FACTORY_ADDRESS.toLowerCase() ||
          input.includes(UNISWAP_V2_FACTORY_ADDRESS.toLowerCase().replace('0x', ''))) {
        console.log('Uniswap V2 transaction:', txHash);
        console.log('Transaction details:', transaction);
      }
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
  // You can fetch more details about the transaction using provider.getTransaction(txHash)
});

// Handle errors
provider.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});