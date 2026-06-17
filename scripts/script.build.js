const { log, requireCommand, runScript } = require("./helpers");

const scriptBuild = async () => {
  log("divider");
  log("info", "BUILDING APP...");
  log("divider");

  requireCommand("forge");

  await runScript("cd contract && forge build", {
    start: "Building contracts...",
    success: "Contracts built successfully!"
  });

  log("divider");

  await runScript("npm --prefix frontend run build", {
    start: "Building frontend...",
    success: "Frontend built successfully!"
  });

  log("divider");
  log("success", "APP BUILT SUCCESSFULLY!");
  log("divider");
};

scriptBuild().catch(error => {
  log("error", error.message);
  process.exitCode = 1;
});
