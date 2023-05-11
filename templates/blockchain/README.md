# Device Binding

## HIW

### 1. Set up environment

```bash
echo IOTEX_PRIVATE_KEY=<YOUR_PRIVATE_KEY> > .env
// e.g. echo IOTEX_PRIVATE_KEY=111111111111111111111111111111111111 > .env
```

### 2. Run tests

```bash
npm run test
```

### 3. Try deploy in hardhat environment

```bash
npm run deploy
```

### 4. Deploy to testnet

```bash
npm run deploy:testnet
```

### 5. Run tasks

```bash
npx hardhat add-erc20-minter --address <MINTER_ADDRESS> --network testnet
```

```bash
npx hardhat register-device --deviceid <DEVICE_ID> --network testnet
```

```bash 
npx hardhat bind-device --deviceid <DEVICE_ID> --userid <USER_ADDRESS> --network testnet
```

## Event hashes:

### DeviceRegistered(bytes32): 
0x543b01d8fc03bd0f400fb055a7c379dc964b3c478f922bb2e198fa9bccb8e714

### OwnershipAssigned(bytes32,address): 
0x79e9049c280370b9eda34d20f57456b7dcc94e83ac839777f71209901f780f48