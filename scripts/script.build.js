const { execSync } = require("child_process");
const { log, runScript } = require("./helpers");

const hasCommand = command => {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const scriptBuild = async () => {
  log("divider");
  log("info", "BUILDING APP...");
  log("divider");

  await runScript("npm i", {
    start: "Installing general dependencies...",
    success: "General dependencies installed successfully!"
  });

  log("divider");

  await runScript("cd frontend && npm i", {
    start: "Installing frontend dependencies...",
    success: "Frontend dependencies installed successfully!"
  });

  log("divider");

  if (hasCommand("forge")) {
    await runScript("cd contract && forge build", {
      start: "Building contracts...",
      success: "Contracts built successfully!"
    });
  } else {
    log(
      "info",
      "Skipping contract build because Foundry forge is not installed. Install Foundry and run npm run check:contracts to verify contracts."
    );
  }

  log("divider");

  await runScript("cd frontend && npm run build", {
    start: "Building frontend...",
    success: "Frontend built successfully!"
  });

  log("divider");
  log("success", "APP BUILT SUCCESSFULLY!");
  log("divider");
};

scriptBuild();
