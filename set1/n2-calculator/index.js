const os = require("node:os");
const operations = require("./operations");
const formatResult = require("./formatter");

const [, , operation, ...rawNumbers] = process.argv;
const supportedOperations = ["add", "subtract", "multiply", "divide", "average"];

function showUsage() {
  console.error(
    "Usage: node index.js <add|subtract|multiply|divide|average> <number> [number ...]",
  );
}

if (!supportedOperations.includes(operation)) {
  console.error(`Unknown operation: ${operation || "(missing)"}`);
  showUsage();
  process.exitCode = 1;
} else {
  const numbers = rawNumbers.map(Number);
  const needsTwoNumbers = operation !== "average";

  if (
    numbers.some((number, index) => rawNumbers[index].trim() === "" || !Number.isFinite(number)) ||
    (needsTwoNumbers && numbers.length !== 2) ||
    (!needsTwoNumbers && numbers.length < 1)
  ) {
    console.error(
      needsTwoNumbers
        ? `${operation} requires exactly two valid numbers.`
        : "average requires at least one valid number.",
    );
    showUsage();
    process.exitCode = 1;
  } else {
    try {
      const result = operations[operation](...numbers);
      console.log(formatResult(operation, numbers, result));
      console.log(`Operating system: ${os.platform()}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
