// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DevicesRegistry is Ownable {
    event DeviceRegistered(bytes32 indexed _deviceId);
    event DeviceDeleted(bytes32 indexed _deviceId);
    event DeviceSuspended(bytes32 indexed _deviceId);
    event DeviceActivated(bytes32 indexed _deviceId);

    struct Device {
        bool isRegistered;
        bool isActive;
    }

    mapping(bytes32 => Device) public devices;

    constructor() {}

    modifier onlyRegisteredDevice(bytes32 _deviceId) {
        require(
            devices[_deviceId].isRegistered,
            "Data Source is not registered"
        );
        _;
    }

    modifier onlyUnregisteredDevice(bytes32 _deviceId) {
        require(
            !devices[_deviceId].isRegistered,
            "Data Source already registered"
        );
        _;
    }

    modifier onlyActiveDevice(bytes32 _deviceId) {
        require(devices[_deviceId].isActive, "Data Source is suspended");
        _;
    }

    modifier onlySuspendedDevice(bytes32 _deviceId) {
        require(!devices[_deviceId].isActive, "Data Source is active");
        _;
    }

    function registerDevice(
        bytes32 _deviceId
    ) public onlyOwner onlyUnregisteredDevice(_deviceId) {
        devices[_deviceId] = Device(true, true);
        emit DeviceRegistered(_deviceId);
    }

    function removeDevice(
        bytes32 _deviceId
    ) public onlyOwner onlyRegisteredDevice(_deviceId) {
        delete devices[_deviceId];
        emit DeviceDeleted(_deviceId);
    }

    function suspendDevice(
        bytes32 _deviceId
    )
        public
        onlyOwner
        onlyRegisteredDevice(_deviceId)
        onlyActiveDevice(_deviceId)
    {
        devices[_deviceId].isActive = false;
        emit DeviceSuspended(_deviceId);
    }

    function activateDevice(
        bytes32 _deviceId
    )
        public
        onlyOwner
        onlyRegisteredDevice(_deviceId)
        onlySuspendedDevice(_deviceId)
    {
        devices[_deviceId].isActive = true;
        emit DeviceActivated(_deviceId);
    }

    function isAuthorizedDevice(
        bytes32 _deviceId
    )
        public
        view
        onlyRegisteredDevice(_deviceId)
        onlyActiveDevice(_deviceId)
        returns (bool)
    {
        return true;
    }
}
