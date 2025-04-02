import React, { useState }from "react"; 
import { saveCalculation } from "../firebase/calculations";
import { Calculator } from "../utils/calculator";

const calculator = new Calculator();

export default function CalculatorComponent() {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [result, setResult] = useState<number | null>(null);

    const handleAdd = () => {
      const calculatedResult = calculator.add(num1, num2);
      setResult(calculatedResult);
    
      if (calculatedResult !== null) {
        saveCalculation(`${num1} + ${num2}`, calculatedResult);
      }
    };
    



      function performCalculation() {
  const expression = "10 + 5";
  const result = 15;
  saveCalculation(expression, result);
}


