const { log, requireCommand, runScript } = require("./helpers");

const scriptCheckContracts = async () => {
  log("divider");
  log("info", "CHECKING CONTRACTS...");
  log("divider");

  requireCommand("forge");

  await runScript("cd contract && forge fmt --check", {
    start: "Checking contract formatting...",
    success: "Contract formatting is valid!"
  });

  log("divider");

  await runScript("cd contract && forge test", {
    start: "Running contract tests...",
    success: "Contract tests passed!"
  });

  log("divider");
  log("success", "CONTRACTS CHECKED SUCCESSFULLY!");
  log("divider");
};

scriptCheckContracts().catch(error => {
  log("error", error.message);
  process.exitCode = 1;
});
