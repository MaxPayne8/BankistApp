'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayRow = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (val, i) {
    const type = val > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${val}💲</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayRow(account1.movements);

const displayBalance = function (acc) {
  const bal = acc.movements.reduce((acc, ele) => (acc = acc + ele), 0);
  acc.balance = bal;
  labelBalance.textContent = `${bal}💲`;
};

// displayBalance(account1.movements);

const calcSummary = function (movements) {
  const summary = movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
  const out = movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${summary}💲`;
  labelSumOut.textContent = `${Math.abs(out)}💲`;
};

// calcSummary(account1.movements);

const interest = function (acc) {
  const int = acc.movements
    .filter(el => el > 0)
    .map(el => (el * acc.interestRate) / 100)
    .filter(val => val > 1)
    .reduce((acc, val) => acc + val, 0);

  labelSumInterest.textContent = `${int}💲`;
};

// interest(account1.movements);

const userName = function (accnts) {
  accnts.forEach(function (accn) {
    accn.username = accn.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
userName(accounts);

const update = function (acc) {
  displayBalance(acc);
  displayRow(acc.movements);
  calcSummary(acc.movements);
  interest(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    update(currentAccount);
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, transferAccount);
  console.log(accounts);
  if (
    transferAccount?.username !== currentAccount.username &&
    amount > 0 &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    transferAccount.movements.push(amount);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    update(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
    update(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayRow(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  console.log(
    Array.from(document.querySelectorAll('.movements__value'), el =>
      Number(el.textContent.replace('💲', ''))
    )
  );
});
/////////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) console.log(`Movement ${i} : ${mov} amount was deposited`);
//   else console.log(`Movement ${i} : ${Math.abs(mov)} amount was withdrew`);
// }

// console.log('//////////For Each//////////');

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) console.log(`Movement ${i} : ${mov} amount was deposited`);
//   else console.log(`Movement ${i} : ${Math.abs(mov)} amount was deposited`);
// });
// /////////////////////////////////////////////////
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (val, key, map) {
//   console.log(`${key} : ${val}`);
// });

// const uniqueCurrencies = new Set([
//   'USD',
//   'POUNDS',
//   'USD',
//   'RUPEE',
//   'YEN',
//   'POUNDS',
// ]);

// console.log(uniqueCurrencies);

// uniqueCurrencies.forEach(function (element, _, set) {
//   console.log(`${element} : ${_}`);
// });

// const newArr1 = account1.movements.map(val => val * 1.1);
// console.log(newArr1);

// const accnt = account1.movements.map((mov, i, arr) => {
//   return `Movement ${i} : ${mov} amount was ${
//     mov > 0 ? 'deposited' : 'withdrew'
//   }`;
// });
// console.log(accnt);
// let str = '';

// console.log(accounts);

// const move = account1.movements;

// const mov1 = move.filter(el => {
//   if (el > 0) return el;
// });
// console.log(mov1);
// const arr1 = [];
// const mov2 = move.forEach(el => {
//   if (el > 0) arr1.push(el);
// });

// console.log(arr1);
// const depo = [];
// for (const val of move) {
//   if (val > 0) depo.push(val);
// }
// console.log(depo);

// const depo1 = move.filter(val => val < 0);
// console.log(depo1);

// const largest = function (arr) {
//   const yo = arr.reduce((acc, ele, i, arr) => {
//     if (acc > ele) return acc;
//     else return ele;
//   }, arr[0]);

//   console.log(yo);
// };

// largest(account1.movements);

// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') console.log(acc);
// }

// const arr = [1, 2, 3, [4, 5], [6, 7, 8], 9];

// console.log(arr.flat());

// const mov = accounts.map(acc => acc.movements).flat();
// console.log(mov);

// console.log(accounts.flatMap(acc => acc.movements));

// console.log(new Array(1, 2, 3, 6));

// console.log(new Array(7).fill(1, 0, 1));

// const z = Array.from({ length: 9 }, (_, i) => i + 1);
// console.log(z);

// console.log(Array.from({ length: 8 }, () => 1));
