import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: {
    
  	ropsten: {
  		url: `https://eth-ropsten.alchemyapi.io/v2/N9hhfuCL7V9y5dXCD5AOddGs-zVIyYc4`,
  		accounts: [``],
      gas: 4712388,
      gasPrice: 8000000000,
  	},/*
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/BOVIKDhtoiCIF42wVvj8LoaXF-Hictde',
      accounts: [``]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/Uo717K-DDAxlSM5gXM-zgv678k0aMZH5`,
  		accounts: [``],
      gas: 4712388,
      gasPrice: 100000000000,
    }
    */
   hardhat: {
     chainId: 1337
   },
   localhost: {
     chainId: 1337,
     mining: {
      auto: false,
      interval: [3000, 6000]
    }
   }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "8523JTUFNSHVP2F6HIN7BS1DJSWU4XJHDM"
  }
};

// Ropsten: 0xD3CFd6dDd98b8245C849D0f845ddC0b6Ce2E01e3

// Ryan: 0xEfC68770C656dD21c5DedDa68a0AE65403a0bdfc