const cashFromCustomerEl = document.getElementById('cash');
const changeDueEl = document.getElementById('change-due');
const btnEl = document.getElementById('purchase-btn');
const changeInRegisterEl = document.getElementById('change-in-register');
const totalEl = document.getElementById('total');

const currencyValues = {
  "Pennies": 0.01,
  "Nickels": 0.05,
  "Dimes": 0.1,
  "Quarters": 0.25,
  "Ones": 1,
  "Fives": 5,
  "Tens": 10,
  "Twenties": 20,
  "Hundreds": 100
}

const register = {
  "Pennies": 0.97,
  "Nickels": 2.05,
  "Dimes": 2.9,
  "Quarters": 3.75,
  "Ones": 89,
  "Fives": 55,
  "Tens": 20,
  "Twenties": 60,
  "Hundreds": 100
};

// Function to display the current cash in the register
const showChangeInRegister = () => {
  changeInRegisterEl.innerHTML = "";
  for (let unit in register) {
    const unitEl = document.createElement('p');
    unitEl.innerText = `${unit}: $${register[unit].toFixed(2)}`;
    changeInRegisterEl.append(unitEl);
  }
}

// Function to calculate and display the change to be given to the customer
const calculateChange = (cashFromCustomer, total) => {
  const changeNeeded = cashFromCustomer - total;
  let changeGiven = {};
  let remainingChange = changeNeeded;

  // Iterate over each currency unit in descending order
  for (let unit in currencyValues) {
    const unitValue = currencyValues[unit];
    const amountInRegister = register[unit];

    // Calculate how many of this unit can be given as change
    const amountNeeded = Math.floor(remainingChange / unitValue);
    const amountAvailable = Math.floor(amountInRegister / unitValue);
    const amountToGive = Math.min(amountNeeded, amountAvailable);

    if (amountToGive > 0) {
      changeGiven[unit] = amountToGive * unitValue; // Add this unit to the change given
      remainingChange -= amountToGive * unitValue;
      register[unit] -= amountToGive * unitValue; // Deduct from the register
    }
  }

  if (remainingChange > 0.01) { // Allow a small margin for rounding errors
    return "Not enough change available";
  }

  // Update and display the change to be given
  let changeText = "";
  for (let unit in changeGiven) {
    changeText += `${unit}: $${changeGiven[unit].toFixed(2)}\n`;
  }
  changeDueEl.innerText = changeText;

  return changeGiven;
};

// Function to check if the customer has enough cash and calculate change if applicable
const checkCashFromCustomer = (e) => {
  e.preventDefault();
  const cashFromCustomer = parseFloat(cashFromCustomerEl.value);
  const total = parseFloat(totalEl.value);

  if (cashFromCustomer < total) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cashFromCustomer === total) {
    changeDueEl.innerText = "No change due - customer paid with exact cash";
  } else {
    const changeResult = calculateChange(cashFromCustomer, total);
    if (typeof changeResult === "string") {
      alert(changeResult); // Display "Not enough change available" if applicable
    } else {
      showChangeInRegister(); // Update register display only if change was given
    }
  }
}

btnEl.addEventListener("click", checkCashFromCustomer);

// Initialize display of register contents on page load
showChangeInRegister();
