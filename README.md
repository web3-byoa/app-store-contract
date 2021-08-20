# Installation
`yarn install`

# Prereq
You must have a local blockchain running using hardhat.
Check out the contract repo and run hardhat.
```
# Start node in background or separate thread from these commands (suggest separate tab/thread rather than background unless you pipe out the logs someplace)
npx hardhat node &

# Compile
npx hardhat compile

# Deploy the script
npx hardhat run --network localhost ./scripts/deploy.ts

# Set up dummy data
npx hardhat console --network localhost
```

## Within the Hardhat console
```
[owner, addr1, addr2] = await ethers.getSigners();
Token = await ethers.getContractFactory("Byoa");
let t = await Token.deploy();

# Set the following as the byoaContractAddress in App.tsx (see SPA app-store documentation)
console.log(await t.address)

# To create an app you must be a developer
await t.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);

# Run this as many times as desired and changing the app parameters each time
await t.connect(addr1).createApp("Uniswap Chart Enhancer", "This app provides an enhanced experience when using the uniswap.v3 application. You'll get access to additional charts and real time data while trying to make your trades. While it is meant for use with uniswap.v3, you can bring this app to any web3 byoa compatible web page.", 0, "ipfs://jdfiojiosdfjisdofjsfd");

# You'll want to set the token URI to an actual URI when developing the BYOA functionality. This can be changed at any time using the updateApp contract endpoint.

# Send your local metamask some ether
await addr1.sendTransaction({to: '0x<REPLACE_ME>', value: ethers.utils.parseUnits('5', 'ether').toHexString()})
```

## Running Tests
`npx hardhat test`