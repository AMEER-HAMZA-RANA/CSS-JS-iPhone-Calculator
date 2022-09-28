// Start writing JavaScript here!
const {log:l} = console;

const calculator = document.querySelector(".calculator");
const calculatorButtonsDiv = calculator.querySelector(".calculator__keys");
const display = calculator.querySelector(".calculator__display");

calculatorButtonsDiv.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return;

  const button = event.target;
  const { buttonType, key } = button.dataset;
  const result = display.textContent;

  const { previousButtonType } = calculator.dataset;

  // Remove is-pressed class from all operator keys
  const operatorKeys = [...calculatorButtonsDiv.children].filter(
    (button) => button.dataset.buttonType === "operator"
  );
  operatorKeys.forEach((button) => button.classList.remove("is-pressed"));

  if (buttonType === "number") {
    if (result === "0" || previousButtonType === "operator") {
      display.textContent = key;
    } else {
      display.textContent = result + key;
    }

    if (previousButtonType === "equal") {
      resetCalculator();
      display.textContent = key;
      // delete calculator.dataset.firstValue;
      // delete calculator.dataset.operator;
    }
  }

  if (buttonType === "operator") {
    button.classList.add("is-pressed");
    const firstValue = Number(calculator.dataset.firstValue);
    const operator = calculator.dataset.operator;
    const secondValue = Number(result);
    if (previousButtonType !== "operator" && previousButtonType !== "equal" && typeof firstValue === 'number' && operator) {
      let newResult;
        if (operator === "plus") newResult = firstValue + secondValue;
        if (operator === "minus") newResult = firstValue - secondValue;
        if (operator === "times") newResult = firstValue * secondValue;
        if (operator === "divide") newResult = firstValue / secondValue;
        display.textContent = newResult;
      // If there's a calculation, we change firstValue
      calculator.dataset.firstValue = newResult;
      } else {
        calculator.dataset.firstValue = result;
      }
    // calculator.dataset.firstValue = result;
    calculator.dataset.operator = key;
  }

  if (buttonType !== "clear") {
    const clearButton = calculator.querySelector('[data-key="clear"]');
    clearButton.textContent = "CE";
  }

  if (buttonType === "clear") {
    if (button.textContent === "AC") {
      delete calculator.dataset.firstValue;
      delete calculator.dataset.operator;
      delete calculator.dataset.modifierValue;
    }
    display.textContent = "0";
    button.textContent = "AC";
  }

  if (buttonType === "decimal") {
    if (!result.includes(".")) {
      display.textContent = result + ".";
    }
    if (previousButtonType === "equal") {
      resetCalculator();
      display.textContent = "0.";
    }
    if (previousButtonType === "operator") {
      display.textContent = "0.";
    }
  }

  if (buttonType === "equal") {
    const firstValue = parseFloat(calculator.dataset.firstValue);
    const operator = calculator.dataset.operator;
      // Finds modifier value
    // Use modifier value as secondValue (if possible)
    const modifierValue = parseFloat(calculator.dataset.modifierValue);
    const secondValue = modifierValue || parseFloat(result);

    if (typeof firstValue === 'number' && operator) {
      let newResult;
      if (operator === "plus") newResult = firstValue + secondValue;
      if (operator === "minus") newResult = firstValue - secondValue;
      if (operator === "times") newResult = firstValue * secondValue;
      if (operator === "divide") newResult = firstValue / secondValue;
      display.textContent = newResult;

      calculator.dataset.firstValue = newResult;
       // Stores secondValue as modifier for followup calculations.
        calculator.dataset.modifierValue = secondValue;
      // l(firstValue, operator, secondValue, '=', newResult);
    } else {
      display.textContent = parseFloat(result) * 1;
    }
  }

  calculator.dataset.previousButtonType = buttonType;
});

// Testing Calculator

const button2 = calculator.querySelector('[data-key = "2"]');
button2.click();
const result = calculator.querySelector(".calculator__display").textContent;
console.assert(result === "2", "Number Key");

const clearKey = calculator.querySelector('[data-key="clear"]');
clearKey.click();
clearKey.click();
const resultAfterClear = calculator.querySelector(".calculator__display").textContent;
console.assert(resultAfterClear === "0", "Clear Key");

console.assert(!calculator.dataset.firstValue, "No First Value");
console.assert(!calculator.dataset.operator, "No operator value");

//click a button
const pressKey = (key) => {
  calculator.querySelector(`[data-key="${key}"]`).click();
  // calculator.querySelector(`[data-key="${key}"]`).click()
};

// get displayed result
const getDisplayValue = (_) => {
  return calculator.querySelector(".calculator__display").textContent;
};

const resetCalculator = () => {
  pressKey("clear");
  pressKey("clear");

  console.assert(getDisplayValue() === "0", "calculator cleared");
  console.assert(!calculator.dataset.firstValue, "No First Value");
  console.assert(!calculator.dataset.operator, "No operator value");
  console.assert(!calculator.dataset.modifierValue, "No modifier Value");
};

pressKey("2");
console.assert(getDisplayValue() === "2", "Number key");
resetCalculator();

pressKey("3");
pressKey("5");
console.assert(getDisplayValue() === "35", "Number Number");
resetCalculator();

pressKey("4");
pressKey("decimal");
console.assert(getDisplayValue() === "4.", "Number Decimal");
resetCalculator();

// There is different btw pressKey(takes separate arguments) and pressKeys(based on rest operator)

const pressKeys = (...keys) => {
  // keys.forEach(key => pressKey(key));
  //simplifying above line
  keys.forEach(pressKey);
};

pressKeys("4", "decimal", "5");
console.assert(getDisplayValue() === "4.5", "Number Decimal Number");
resetCalculator();

const runTest = (test) => {
  pressKeys(...test.keys);
  console.assert(getDisplayValue() === test.result, test.message);
  resetCalculator();
};

const tests = [
  //Initial Expressions
  {
    message: "Number key",
    keys: ["2"],
    result: "2",
  },
  {
    message: "Number Number",
    keys: ["3", "5"],
    result: "35",
  },
  {
    message: "Number Decimal",
    keys: ["4", "decimal"],
    result: "4.",
  },
  {
    message: "Number Decimal Number",
    keys: ["4", "decimal", "5"],
    result: "4.5",
  },
  //Calculations
  {
    message: "Addition",
    keys: ["2", "plus", "5", "equal"],
    result: "7",
  },
  {
    message: "Subtraction",
    keys: ["5", "minus", "9", "equal"],
    result: "-4",
  },
  {
    message: "Multiplication",
    keys: ["4", "times", "8", "equal"],
    result: "32",
  },
  {
    message: "Division",
    keys: ["5", "divide", "1", "0", "equal"],
    result: "0.5",
  },
  {
    message: "Number Equal",
    keys: ["5", "equal"],
    result: "5",
  },
  {
    message: "Number Decimal Equal",
    keys: ["2", "decimal", "4", "5", "equal"],
    result: "2.45",
  },
  {
    message: "Decimal key",
    keys: ["decimal"],
    result: "0.",
  },
  {
    message: "Decimal Decimal",
    keys: ["2", "decimal", "decimal"],
    result: "2.",
  },
  {
    message: "Decimal Number Decimal",
    keys: ["2", "decimal", "5", "decimal", "5"],
    result: "2.55",
  },
  {
    message: "Decimal Equal",
    keys: ["2", "decimal", "equal"],
    result: "2",
  },
  {
    message: "Equal",
    keys: ["equal"],
    result: "0",
  },
  {
    message: "Equal Number",
    keys: ["equal", "3"],
    result: "3",
  },
  {
    message: "Number Equal Number",
    keys: ["5", "equal", "3"],
    result: "3",
  },
  {
    message: "Equal Decimal",
    keys: ["equal", "decimal"],
    result: "0.",
  },
  {
    message: "Number Equal Decimal",
    keys: ["5", "equal", "decimal"],
    result: "0.",
  },
  {
    message: "Calculation + Operator",
    keys: ["1", "plus", "1", "equal", "plus", "1", "equal"],
    result: "3",
  },
  {
    message: "Operator Decimal",
    keys: ["times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Decimal",
    keys: ["5", "times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Equal",
    keys: ["7", "divide", "equal"],
    result: "1",
  },
  {
    message: "Operator calculation",
    keys: ["9", "minus", "5", "minus"],
    result: "4",
  },
  {
    message: "Number Operator Operator",
    keys: ["9", "times", "divide"],
    result: "9",
  },
  {
    message: 'Number Operator Equal Equal',
    keys: ['9', 'minus', 'equal', 'equal'],
    result: '-9'
  },
  {
    message: 'Number Operator Number Equal Equal',
    keys: ['8', 'minus', '5', 'equal', 'equal'],
    result: '-2'
  },,
  {
    message: 'Operator follow-up calculation',
    keys: ['1', 'plus', '2', 'plus', '3', 'plus', '4', 'plus', '5', 'plus'],
    result: '15'
  }
];

//Run tests
tests.forEach(runTest);

const testClearKey = (_) => {
  //Before calculation
  pressKeys("5", "clear");
  console.assert(getDisplayValue() === "0", "Clear before calculation");
  const clearKeyText =
    calculator.querySelector('[data-key="clear"]').textContent;
  console.assert(clearKeyText === "AC", "Clear once, should now AC");
  resetCalculator();
  //After calculation
  pressKeys("5", "times", "9", "equal", "clear");
  const { firstValue, operator } = calculator.dataset;
  console.assert(firstValue, "Clear once;  should have first value");
  console.assert(operator, "Clear once;  should have operator value");
  resetCalculator();
};

testClearKey();
