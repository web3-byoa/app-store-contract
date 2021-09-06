// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Byoa");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      //expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("App Management", function () {
   it("Should grant a developer role", async () => {
    let hasRole = await hardhatToken.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address)
    expect(hasRole).to.equal(false);

    await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
    hasRole = await hardhatToken.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address)
    expect(hasRole).to.equal(true);
   });

   it("Should only allow developers to create an app", async () => {
    await expect(hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog")).to.be.revertedWith('Must be a developer to create an app');

    await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
    hasRole = await hardhatToken.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address)
    expect(hasRole).to.equal(true);

    await expect(hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog")).to.be.not.reverted;    
   });

   it("Should create a new app", async () => {
    await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
    hasRole = await hardhatToken.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
    expect(hasRole).to.equal(true);

    const appId = await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
    await appId.wait();
    const appId2 = await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await appId2.wait();
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog/2");
    
    let ids = await hardhatToken.getAppIds();
    expect(ids.length).to.be.eq(8);
   });

   it("Should update app details", async () => {
        await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
        await hardhatToken.connect(addr1).createApp("name 2", "desc 2", 0, "ipfs://dog2");
        
        await hardhatToken.connect(addr1).updateApp(2, "name 2 updated", "desc 2 updated", 0, "ipfs://dog/2");

        let details = await hardhatToken.connect(addr1).getAppDetailsById(2);
        expect(details.name).equals("name 2 updated");
        expect(details.description).equals("desc 2 updated");
        expect(details._tokenURI).equals("ipfs://dog/2");
   });

   it("Should only allow the creating developer to update", async () => {
        await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
        await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr2.address);
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
        await expect(hardhatToken.connect(addr2).updateApp(1, "name 1 updated", "desc 1 updated", 0, "ipfs://dog/1")).to.be.reverted;
        await expect(hardhatToken.connect(addr1).updateApp(1, "name 1 updated", "desc 1 updated", 0, "ipfs://dog/1")).to.be.not.reverted;
   });
  });

  describe("Minting Functionalities", () => {
    it("Should fail to mint with a bad appid", async () => {
        await expect(hardhatToken.connect(addr1).mint(1)).to.be.revertedWith('App ID must exist');
    });

    it("Should mint a byoa with a valid app id to a user", async () => {
        await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");

        await expect(hardhatToken.connect(addr1).mint(2)).to.be.not.reverted;
        await expect(hardhatToken.connect(addr2).mint(1)).to.be.not.reverted;

        let firstMint = await hardhatToken.getAppIdByTokenId(1);
        expect(firstMint).equals(2);

        let secondMint = await hardhatToken.getAppIdByTokenId(2);
        expect(secondMint).equals(1);
    });
  });

  describe("Token Preferences", () => {

    let appId;
    beforeEach( async () => {
      await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
      appId = await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
      appId.wait();
      await expect(hardhatToken.connect(addr1).mint(1)).to.not.be.reverted;
    });


    it("Should allow you to set token preferences", async () => {
      let keys = await hardhatToken.connect(addr1).getPreferencesKeys(1);
      expect(keys.length).to.be.equal(0);

      await hardhatToken.connect(addr1).updatePreferences(1, "symbol1", "ETH");
      await hardhatToken.connect(addr1).updatePreferences(1, "symbol2", "BTC");

      keys = await hardhatToken.connect(addr1).getPreferencesKeys(1);
      expect(keys.length).to.be.equal(2);

      let s1 = await hardhatToken.getPreferenceByKey(1, "symbol1");
      let s2 = await hardhatToken.getPreferenceByKey(1, "symbol2");
      expect(s1).to.equal("ETH");
      expect(s2).to.equal("BTC");

      let s3 = await hardhatToken.getPreferenceByKey(1, "symbol3");
      expect(s3).to.equal("");

      await hardhatToken.connect(addr1).updatePreferences(1, "symbol1", "DOG");
      let s4 = await hardhatToken.getPreferenceByKey(1, "symbol1");
      expect(s4).to.equal("DOG");
    });
  });

  describe("Transfers", () => {
      it("Should allow a user to transfer to another user", async () => {
        await hardhatToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEVELOPER_ROLE")), addr1.address);
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");
        await hardhatToken.connect(addr1).createApp("name 1", "desc 1", 0, "ipfs://dog");

        await expect(hardhatToken.connect(addr1).mint(2)).to.be.not.reverted;
        await expect(hardhatToken.connect(addr2).mint(1)).to.be.not.reverted;

        await hardhatToken.connect(addr1).transferFrom(addr1.address, addr2.address, 1);

        let res = await hardhatToken.walletOfOwner(addr2.address);
        expect(res.length).equals(2);

        let res2 = await hardhatToken.walletOfOwner(addr1.address);
        expect(res2.length).equals(0);
      });
  })
});