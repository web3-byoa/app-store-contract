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
  solidity: "0.8.6",
  networks: {
    /*
  	ropsten: {
  		url: `https://eth-ropsten.alchemyapi.io/v2/Uo717K-DDAxlSM5gXM-zgv678k0aMZH5`,
  		accounts: [``],
      gas: 4712388,
      gasPrice: 8000000000,
  	},
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
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "8523JTUFNSHVP2F6HIN7BS1DJSWU4XJHDM"
  }
};