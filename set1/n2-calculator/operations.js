function add(left, right) {
  return left + right;
}

function subtract(left, right) {
  return left - right;
}

function multiply(left, right) {
  return left * right;
}

function divide(left, right) {
  if (right === 0) {
    throw new Error("Cannot divide by zero.");
  }

  return left / right;
}

function average(...numbers) {
  if (numbers.length === 0) {
    throw new Error("Average requires at least one number.");
  }

  return numbers.reduce((total, number) => total + number, 0) / numbers.length;
}

module.exports = { add, subtract, multiply, divide, average };
