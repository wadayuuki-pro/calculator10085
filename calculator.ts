class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }
    return a / b;
  }
}

// 使用例
const calculator = new Calculator();

const num1 = 10;
const num2 = 5;

console.log(`加算: ${calculator.add(num1, num2)}`);
console.log(`減算: ${calculator.subtract(num1, num2)}`);
console.log(`乗算: ${calculator.multiply(num1, num2)}`);
console.log(`除算: ${calculator.divide(num1, num2)}`);
