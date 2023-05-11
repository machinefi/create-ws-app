// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./DevicesRegistry.sol";

contract DeviceBinding is Ownable {
    using Counters for Counters.Counter;

    DevicesRegistry public devicesRegistry;
    Counters.Counter private totalDevices;

    mapping(bytes32 => address) public deviceToOwner;
    mapping(address => bytes32[]) public ownerToDevices;

    event OwnershipAssigned(
        bytes32 indexed _deviceId,
        address indexed _ownerAddress
    );
    event OwnershipRenounced(bytes32 indexed _deviceId);

    modifier onlyAuthorizedDevice(bytes32 _deviceId) {
        require(
            devicesRegistry.isAuthorizedDevice(_deviceId),
            "device is not authorized"
        );
        _;
    }

    modifier onlyNotBoundDevice(bytes32 _deviceId) {
        require(
            deviceToOwner[_deviceId] == address(0),
            "device has already been bound"
        );
        _;
    }

    modifier onlyBoundDevice(bytes32 _deviceId) {
        require(deviceToOwner[_deviceId] != address(0), "device is not bound");
        _;
    }

    modifier onlyDeviceOwnerOrAdmin(bytes32 _deviceId) {
        require(
            (deviceToOwner[_deviceId] == msg.sender) ||
                (msg.sender == this.owner()),
            "not the device owner or admin"
        );
        _;
    }

    constructor(address _devicesRegistryAddress) {
        devicesRegistry = DevicesRegistry(_devicesRegistryAddress);
    }

    function bindDevice(
        bytes32 _deviceId,
        address _ownerAddress
    )
        public
        onlyOwner
        onlyNotBoundDevice(_deviceId)
        onlyAuthorizedDevice(_deviceId)
        returns (bool)
    {
        _bindDevice(_deviceId, _ownerAddress);

        emit OwnershipAssigned(_deviceId, _ownerAddress);
        return true;
    }

    function unbindDevice(
        bytes32 _deviceId
    )
        public
        onlyBoundDevice(_deviceId)
        onlyDeviceOwnerOrAdmin(_deviceId)
        returns (bool)
    {
        _unbindDevice(_deviceId);

        emit OwnershipRenounced(_deviceId);
        return true;
    }

    function getDevicesCount() public view returns (uint) {
        return totalDevices.current();
    }

    function getDeviceOwner(bytes32 _deviceId) public view returns (address) {
        return deviceToOwner[_deviceId];
    }

    function getOwnedDevices(
        address _ownerAddress
    ) public view returns (bytes32[] memory) {
        return ownerToDevices[_ownerAddress];
    }

    function _bindDevice(bytes32 _deviceId, address _ownerAddress) private {
        deviceToOwner[_deviceId] = _ownerAddress;
        totalDevices.increment();
        ownerToDevices[_ownerAddress].push(_deviceId);
    }

    function _unbindDevice(bytes32 _deviceId) private {
        address ownerAddress = deviceToOwner[_deviceId];
        delete deviceToOwner[_deviceId];
        totalDevices.decrement();
        _removeDeviceFromOwner(ownerAddress, _deviceId);
    }

    function _removeDeviceFromOwner(
        address _ownerAddress,
        bytes32 _deviceId
    ) private {
        bytes32[] storage ownedDevices = ownerToDevices[_ownerAddress];
        uint deviceIndex;
        for (uint i = 0; i < ownedDevices.length; i++) {
            if (ownedDevices[i] == _deviceId) {
                deviceIndex = i;
                break;
            }
        }
        ownedDevices[deviceIndex] = ownedDevices[ownedDevices.length - 1];
        ownedDevices.pop();
    }
}
