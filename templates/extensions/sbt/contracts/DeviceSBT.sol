// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DeviceSBT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private _deviceUri = "";

    mapping(uint256 => address) public sbtApprovals;

    constructor(
        string memory uri_,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _deviceUri = uri_;
    }

    function setURI(string memory uri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _deviceUri = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        return _deviceUri;
    }

    function approveSBT(
        address to,
        uint256 tokenId
    ) public onlyRole(MINTER_ROLE) {
        sbtApprovals[tokenId] = to;
    }

    function mintSBT(uint256 tokenId) public {
        address to = sbtApprovals[tokenId];
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        bytes32 deviceId
    ) public onlyRole(MINTER_ROLE) {
        _safeMint(to, uint256(deviceId));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(from == address(0), "DeviceSBT: Only minting allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
