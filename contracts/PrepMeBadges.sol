// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PrepMeBadges is ERC1155, Ownable {
    using Strings for uint256;

    uint256 private _currentBadgeTypeId;

    // Base URI for metadata JSON files
    string private _baseMetadataURI;

    // Mapping from badge ID to its metadata
    struct BadgeType {
        string name;
        string description;
        string metadataURI; // URI pointing to the JSON metadata file
        bool active;
    }

    mapping(uint256 => BadgeType) public badgeTypes;

    // Events
    event BadgeTypeCreated(
        uint256 indexed badgeTypeId,
        string name,
        string description
    );
    event BadgeMinted(
        address indexed to,
        uint256 indexed badgeTypeId,
        uint256 amount
    );
    event BadgeTypeDeactivated(uint256 indexed badgeTypeId);

    constructor(string memory baseURI) ERC1155("") Ownable(msg.sender) {
        _baseMetadataURI = baseURI;
    }

    // Create a new badge type
    function createBadgeType(
        string memory name,
        string memory description,
        string memory metadataURI
    ) external onlyOwner returns (uint256) {
        _currentBadgeTypeId++;

        badgeTypes[_currentBadgeTypeId] = BadgeType({
            name: name,
            description: description,
            metadataURI: metadataURI,
            active: true
        });

        emit BadgeTypeCreated(_currentBadgeTypeId, name, description);
        return _currentBadgeTypeId;
    }

    // Mint badge to user
    function mintBadge(
        address to,
        uint256 badgeTypeId,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        require(badgeTypes[badgeTypeId].active, "Badge type is not active");
        _mint(to, badgeTypeId, amount, data);
        emit BadgeMinted(to, badgeTypeId, amount);
    }

    // Batch mint badges to user
    function mintBatchBadges(
        address to,
        uint256[] memory badgeTypeIds,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        for (uint256 i = 0; i < badgeTypeIds.length; i++) {
            require(
                badgeTypes[badgeTypeIds[i]].active,
                "One of the badge types is not active"
            );
        }
        _mintBatch(to, badgeTypeIds, amounts, data);
    }

    // Deactivate a badge type
    function deactivateBadgeType(uint256 badgeTypeId) external onlyOwner {
        require(
            badgeTypes[badgeTypeId].active,
            "Badge type is already inactive"
        );
        badgeTypes[badgeTypeId].active = false;
        emit BadgeTypeDeactivated(badgeTypeId);
    }

    // Get all badges owned by an address
    function getBadgesByOwner(
        address owner
    )
        external
        view
        returns (
            uint256[] memory badgeIds,
            uint256[] memory amounts,
            BadgeType[] memory details
        )
    {
        uint256 count = 0;

        // First pass: count owned badges
        for (uint256 i = 1; i <= _currentBadgeTypeId; i++) {
            if (balanceOf(owner, i) > 0) {
                count++;
            }
        }

        // Initialize return arrays
        badgeIds = new uint256[](count);
        amounts = new uint256[](count);
        details = new BadgeType[](count);

        // Second pass: populate return arrays
        uint256 index = 0;
        for (uint256 i = 1; i <= _currentBadgeTypeId; i++) {
            uint256 balance = balanceOf(owner, i);
            if (balance > 0) {
                badgeIds[index] = i;
                amounts[index] = balance;
                details[index] = badgeTypes[i];
                index++;
            }
        }
    }

    // Override uri function to return full metadata URI for the token
    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(badgeTypes[tokenId].active, "Badge type does not exist");
        return
            string(
                abi.encodePacked(
                    _baseMetadataURI,
                    badgeTypes[tokenId].metadataURI
                )
            );
    }

    // Update base URI
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseMetadataURI = newBaseURI;
    }

    // Get the base metadata URI
    function baseMetadataURI() public view returns (string memory) {
        return _baseMetadataURI;
    }

    // Get total number of badge types
    function getTotalBadgeTypes() external view returns (uint256) {
        return _currentBadgeTypeId;
    }

    // Get badge type details
    function getBadgeTypeDetails(
        uint256 badgeTypeId
    ) external view returns (BadgeType memory) {
        require(
            badgeTypeId <= _currentBadgeTypeId,
            "Badge type does not exist"
        );
        return badgeTypes[badgeTypeId];
    }
}
