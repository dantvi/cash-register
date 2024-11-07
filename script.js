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

// Initialize a 2D array for cash in drawer (cid)
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Function to display the current cash in the register
const showChangeInRegister = () => {
  changeInRegisterEl.innerHTML = "";
  cid.forEach(([unit, amount]) => {
    const unitEl = document.createElement('p');
    unitEl.innerText = `${unit}: $${amount.toFixed(2)}`;
    changeInRegisterEl.append(unitEl);
  });
}

// Function to calculate and display the change to be given to the customer
const calculateChange = (cashFromCustomer, total) => {
  const changeNeeded = cashFromCustomer - total;
  let remainingChange = changeNeeded;
  let changeGiven = [];
  let totalInDrawer = cid.reduce((sum, [unit, amount]) => sum + amount, 0);
  totalInDrawer = Math.round(totalInDrawer * 100) / 100; // Avoid precision errors

  // Check if the total cash in drawer is less than change needed
  if (totalInDrawer < changeNeeded) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // Check if total cash in drawer exactly matches change needed
  if (totalInDrawer === changeNeeded) {
    return { status: "CLOSED", change: cid };
  }

  // Calculate change to give from highest to lowest currency unit
  for (let i = cid.length - 1; i >= 0; i--) {
    const [unit, amountInDrawer] = cid[i];
    const unitValue = currencyValues[unit];
    let amountToGive = 0;

    // Calculate how many of this unit can be given as change
    while (remainingChange >= unitValue && amountInDrawer >= amountToGive + unitValue) {
      remainingChange -= unitValue;
      remainingChange = Math.round(remainingChange * 100) / 100; // Avoid precision errors
      amountToGive += unitValue;
    }

    if (amountToGive > 0) {
      changeGiven.push([unit, amountToGive]); // Add this unit to the change given
      cid[i][1] -= amountToGive; // Deduct from cid
    }
  }

  if (remainingChange > 0.01) { // Allow a small margin for rounding errors
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeGiven };
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
    const result = calculateChange(cashFromCustomer, total);

    if (result.status === "INSUFFICIENT_FUNDS") {
      changeDueEl.innerText = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "CLOSED") {
      let changeText = "Status: CLOSED";
      changeText += result.change.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`.join(" "));
      changeDueEl.innerText = changeText;
    } else if (result.status === "OPEN") {
      let changeText = "Status: OPEN ";
      changeText += result.change.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(" ");
      changeDueEl.innerText = changeText;
    }
  }
}

// Event listener for the button click
btnEl.addEventListener("click", checkCashFromCustomer);

// Initialize display of register contents on page load
showChangeInRegister();
