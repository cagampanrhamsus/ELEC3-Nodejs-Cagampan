const fs = require("node:fs");
const path = require("node:path");

const filesDirectory = path.join(__dirname, "files");
fs.mkdirSync(filesDirectory, { recursive: true });

function getFilePath(fileName) {
  if (
    typeof fileName !== "string" ||
    fileName.trim() === "" ||
    fileName === "." ||
    fileName === ".." ||
    path.basename(fileName) !== fileName
  ) {
    throw new Error("Use a file name only; folder paths are not allowed.");
  }

  return path.join(filesDirectory, fileName);
}

function requireArguments(command, args, expectedCount) {
  if (args.length !== expectedCount) {
    const usage = command === "list" ? "" : expectedCount === 2 ? " <file> <text>" : " <file>";
    throw new Error(`Usage: node index.js ${command}${usage}`);
  }
}

function run() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "create": {
      requireArguments(command, args, 2);
      const filePath = getFilePath(args[0]);
      fs.writeFileSync(filePath, args[1], { encoding: "utf8", flag: "wx" });
      console.log(`Created ${filePath}`);
      break;
    }
    case "read": {
      requireArguments(command, args, 1);
      const filePath = getFilePath(args[0]);
      console.log(fs.readFileSync(filePath, "utf8"));
      break;
    }
    case "update": {
      requireArguments(command, args, 2);
      const filePath = getFilePath(args[0]);
      fs.appendFileSync(filePath, args[1], "utf8");
      console.log(`Updated ${filePath}`);
      break;
    }
    case "delete": {
      requireArguments(command, args, 1);
      const filePath = getFilePath(args[0]);
      fs.unlinkSync(filePath);
      console.log(`Deleted ${filePath}`);
      break;
    }
    case "list": {
      requireArguments(command, args, 0);
      const fileNames = fs.readdirSync(filesDirectory);

      if (fileNames.length === 0) {
        console.log("The files folder is empty.");
        break;
      }

      for (const fileName of fileNames) {
        const filePath = path.join(filesDirectory, fileName);
        if (!fs.statSync(filePath).isFile()) {
          continue;
        }

        console.log(`Full path: ${filePath}`);
        console.log(`File name: ${path.basename(filePath)}`);
        console.log(`Extension: ${path.extname(filePath)}`);
        console.log(`Contents: ${fs.readFileSync(filePath, "utf8")}`);
        console.log("---");
      }
      break;
    }
    default:
      throw new Error(
        "Unknown command. Use create, read, update, delete, or list.",
      );
  }
}

try {
  run();
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("Error: that file does not exist.");
  } else if (error.code === "EEXIST") {
    console.error("Error: that file already exists.");
  } else {
    console.error(`Error: ${error.message}`);
  }

  process.exitCode = 1;
}
