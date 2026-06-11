import { defineConfig } from "hardhat/config";
import HardhatEthers from "@nomicfoundation/hardhat-ethers";
import HardhatEthersChaiMatchers from "@nomicfoundation/hardhat-ethers-chai-matchers";
import HardhatMocha from "@nomicfoundation/hardhat-mocha";
import HardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";
import HardhatTypechain from "@nomicfoundation/hardhat-typechain";

const optimizer = {
  enabled: true,
  // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
  runs: 200,
};

export default defineConfig({
  // Only the plugins the grader needs: compile + mocha + ethers + chai matchers + typechain.
  // (Avoids the toolbox's ignition/keystore/verify peers.)
  plugins: [
    HardhatMocha,
    HardhatEthers,
    HardhatEthersChaiMatchers,
    HardhatNetworkHelpers,
    HardhatTypechain,
  ],
  solidity: {
    // Challenge contracts pin different pragmas; Hardhat picks per-file by version.
    compilers: [
      { version: "0.8.20", settings: { viaIR: true, optimizer } },
      { version: "0.8.27", settings: { viaIR: true, optimizer } },
      { version: "0.8.30", settings: { viaIR: true, optimizer } },
    ],
    // HH3 only emits artifacts for project sources, not npm imports. The zk-voting
    // test deploys these libraries by name (getContractFactory("PoseidonT3"/"LeanIMT")),
    // so force their artifacts to be generated.
    npmFilesToBuild: [
      "poseidon-solidity/PoseidonT3.sol",
      "@zk-kit/lean-imt.sol/LeanIMT.sol",
    ],
  },
  networks: {
    // No-arg `network.create()` in the test files uses the "default" network,
    // so it must be edr-simulated and allow large (student) contracts.
    default: {
      type: "edr-simulated",
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      type: "edr-simulated",
      allowUnlimitedContractSize: true,
    },
  },
});
