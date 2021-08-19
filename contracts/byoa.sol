// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



pragma solidity ^0.8.0;

contract Byoa is ERC721Enumerable, AccessControl, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _byoaAppIds;

    // Role for developers to be able to mint apps
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");

    uint256 private _defaultPrice = 4 * 10**16; // This is currently .04 eth

    // Need a type to hold multiple types of byoa
    struct App {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string tokenURI;
        address owner;
    }

    // Mapping AppIds to the App
    mapping (uint256 => App) apps;

    constructor() ERC721("Byoa V1", "BYOA_V1") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(uint256 _appId) public payable {
        require(apps[_appId].id != 0, "App ID must exist");

        uint256 totalSupply = totalSupply();
        
        // Mint and increase the tokenID
        uint256 _tokenId = totalSupply + 1;
        _safeMint(msg.sender, _tokenId);
        require(_exists(_tokenId));
        // Set the tokenURI to the URI specified by the App
        _setTokenURI(_tokenId, apps[_appId].tokenURI);
    }

    function createApp(string memory name, string memory description, uint256 price, string memory _tokenURI) public returns (uint256) {
        require(hasRole(DEVELOPER_ROLE, msg.sender), "Must be a developer to create an app");
        _byoaAppIds.increment();
        uint256 _appId = _byoaAppIds.current();

        apps[_appId] = App({
            id: _appId,
            name: name,
            description: description,
            price: price,
            tokenURI: _tokenURI,
            owner: msg.sender
        });

        return _appId;
    }

    function updateApp(uint256 appId, string memory name, string memory description, uint256 price, string memory _tokenURI) public returns (uint256) {
        require(hasRole(DEVELOPER_ROLE, msg.sender), "Must be a developer to create an app");
        require(apps[appId].id != 0, "App ID must exist");

        App memory app = apps[appId];
        require(app.owner == msg.sender, "You must be the owner of this app");

        apps[appId] = App({
            id: appId,
            name: name,
            description: description,
            price: price,
            tokenURI: _tokenURI,
            owner: msg.sender
        });

        return appId;
    }

    function getAppDetailsById(uint256 appId) public view returns (
        string memory name, 
        string memory description, 
        string memory _tokenURI, 
        address owner, 
        uint256 price
    ) {
        require(apps[appId].id != 0, "App ID must exist");

        App memory _app = apps[appId];
        return (_app.name, _app.description, _app.tokenURI, _app.owner, _app.price);
    }
   
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        }

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function getAppIds() public view returns (uint256[] memory) {
        uint256[] memory appIds = new uint256[](_byoaAppIds.current());
        for (uint256 i; i < _byoaAppIds.current(); i ++) {
            appIds[i] = i;
        }
        return appIds;
    }

    function withdrawAll() public payable {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must be an admin to withdraw");
        require(payable(msg.sender).send(address(this).balance));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}