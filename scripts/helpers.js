const { exec, execSync, spawn } = require("child_process");
const os = require("os");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const appendPath = directory => {
  const delimiter = process.platform === "win32" ? ";" : ":";
  const pathVariableName = process.platform === "win32" ? "Path" : "PATH";
  const currentPath = process.env[pathVariableName] || "";
  const pathParts = currentPath.split(delimiter).filter(Boolean);

  if (!pathParts.includes(directory)) {
    process.env[pathVariableName] = [directory, ...pathParts].join(delimiter);
  }
};

appendPath(path.join(os.homedir(), ".foundry", "bin"));

// Helper function for console logging
const log = (type, message) => {
  const prefix = {
    info: "[INFO]",
    success: "[SUCCESS]",
    error: "[ERROR]"
  }[type];

  if (type === "divider") {
    console.log("-".repeat(60));
    console.log(" ");
  } else {
    console.log(`${prefix} - ${message}`);
    console.log(" ");
  }
};

const requireCommand = command => {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
  } catch {
    throw new Error(`${command} is required for this project. Install Foundry and run the command again.`);
  }
};

// Helper function to run shell scripts
const runScript = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    if (options.start) {
      log("info", options.start);
    }

    // Handle persistent processes
    if (options.persistent) {
      const process = spawn(command, { shell: true, ...options });
      let isReady = false;

      // Listen for standard output data
      process.stdout.on("data", data => {
        const output = data.toString();
        console.log(output);

        // Check if the output contains the "isReadyWhen" mark provided in options
        if (options.isReadyWhen && output.includes(options.isReadyWhen)) {
          if (!isReady) {
            isReady = true;
            if (options.success) {
              log("success", options.success);
            }
            resolve();
          }
        }
      });

      // Listen for error output data
      process.stderr.on("data", data => {
        console.error(data.toString());
      });

      // Handle process errors
      process.on("error", err => {
        reject(err);
      });
    } else {
      // Handle regular  processes
      const process = exec(command, { shell: true, ...options });

      // Listen for standard output data
      process.stdout.on("data", data => {
        console.log(data.toString());
      });

      // Listen for error output data
      process.stderr.on("data", data => {
        console.error(data.toString());
      });

      // Handle process completion
      process.on("close", code => {
        if (code === 0) {
          if (options.success) {
            log("success", options.success);
          }
          resolve();
        } else {
          reject(new Error(`Command failed: ${command} (Exit Code: ${code})`));
        }
      });

      // Handle process errors
      process.on("error", err => {
        reject(err);
      });
    }
  });
};

module.exports = { log, requireCommand, runScript };
