class Calculator {
  constructor(prevOperandTextElement, currOperandTextElement) {
    this.prevOperandTextElement = prevOperandTextElement;
    this.currOperandTextElement = currOperandTextElement;
    this.clear();
  }

  clear() {
    this.currOperand = "";
    this.prevOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
  }

  checkInput() {
    if (!this.currOperand && this.prevOperand) {
      const value = this.prevOperand.split(" ")[1];
      this.currOperand = value;
      this.prevOperand = "";
    }
  }

  checkZero() {
    if (this.currOperand.length > 1 && this.currOperand[0] === "0") {
      this.currOperand = this.currOperand.slice(1);
    }
  }

  analyzeBtnClick(clickedBtn) {
    const btns = document.querySelectorAll("button");

    for (let i = 0; i < btns.length; i++) {
      if (btns[i].textContent === clickedBtn) {
        return btns[i].getAttribute("data-type");
      }
    }
  }

  activateBtn(type) {
    const btnType = type.getAttribute("data-type");

    if (btnType === "equals") {
      type.classList.add(`clicked-${btnType}`);
    } else if (btnType === "operation") {
      type.classList.add(`clicked-${btnType}`);
    } else if (btnType === "erase") {
      type.classList.add(`clicked-${btnType}`);
    } else if (btnType === "number") {
      type.classList.add(`clicked-${btnType}`);
    }
    this.disableTransition(btnType);
  }

  disableTransition(element) {
    function removeTransition(e) {
      if (e.propertyName !== "transform") return;
      e.target.classList.remove(`clicked-${element}`);
    }

    const actionBtns = document.querySelectorAll("button");
    actionBtns.forEach((btn) =>
      btn.addEventListener("transitionend", removeTransition)
    );
  }

  appendNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    this.currOperand = this.currOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = "";
  }

  compute() {
    let computedResult;
    let prevValue = parseFloat(this.prevOperand);
    let currValue = parseFloat(this.currOperand);
    if (isNaN(prevValue) || isNaN(currValue)) return;
    switch (this.operation) {
      case "+":
        computedResult = prevValue + currValue;
        break;
      case "-":
        computedResult = prevValue - currValue;
        break;
      case "x":
      case "*":
        computedResult = prevValue * currValue;
        break;
      case "÷":
      case "/":
        computedResult = prevValue / currValue;
        break;
      case "%":
        computedResult = prevValue % currValue;
        break;
      default:
        return;
    }
    this.currOperand = computedResult;
    this.operation = undefined;
    this.prevOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currOperandTextElement.innerText = this.getDisplayNumber(
      this.currOperand
    );

    if (this.operation != null) {
      this.prevOperandTextElement.innerText = `${this.getDisplayNumber(
        this.prevOperand
      )} ${this.operation}`;
    } else {
      this.prevOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[number]");
const operationButtons = document.querySelectorAll("[operation]");
const equalsButton = document.querySelector("[equals]");
const allClearButton = document.querySelector("[all-clear]");
const deleteButton = document.querySelector("[delete]");
const prevOperandTextElement = document.querySelector("[prev-operand]");
const currOperandTextElement = document.querySelector("[curr-operand]");

const calc = new Calculator(prevOperandTextElement, currOperandTextElement);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calc.appendNumber(button.innerText);
    calc.updateDisplay();
    calc.activateBtn(button);
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calc.chooseOperation(button.innerText);
    calc.updateDisplay();
    calc.activateBtn(button);
  });
});

equalsButton.addEventListener("click", (button) => {
  calc.compute();
  calc.updateDisplay();
  calc.activateBtn(button.target);
});

allClearButton.addEventListener("click", (button) => {
  calc.clear();
  calc.updateDisplay();
  calc.activateBtn(button.target);
});

deleteButton.addEventListener("click", (button) => {
  calc.delete();
  calc.updateDisplay();
  calc.activateBtn(button.target);
});

window.addEventListener("keydown", (e) => {
  let keyValue = e.key;

  if ((keyValue > -1 && keyValue < 10) || keyValue === ".") {
    console.log(e);
    calc.appendNumber(keyValue);
    calc.updateDisplay();
    calc.analyzeBtnClick(keyValue);
  } else if (keyValue === "Enter" || keyValue === "=") {
    calc.compute();
    calc.updateDisplay();
    calc.analyzeBtnClick("=");
  } else if (keyValue === "Backspace" || keyValue === "Delete") {
    calc.delete();
    calc.updateDisplay();
    calc.analyzeBtnClick("DEL");
  } else if (keyValue === "c" || keyValue === "C") {
    calc.clear();
    calc.updateDisplay();
    calc.analyzeBtnClick("AC");
  } else if (
    keyValue === "+" ||
    keyValue === "-" ||
    keyValue === "*" ||
    keyValue === "%" ||
    keyValue === "/"
  ) {
    calc.chooseOperation(keyValue);
    calc.updateDisplay();
    if (keyValue === "*") {
      keyValue = "x";
    }
    if (keyValue === "/") {
      keyValue = "÷";
    }
    calc.analyzeBtnClick(keyValue);
  } else {
    return;
  }
});
