let countdownIntervalId = null;

function depositFunds() {
  const depositAmount = prompt("Enter amount to deposit (USD):");
  if (depositAmount && !isNaN(depositAmount) && depositAmount > 0) {
    alert(`✅ Deposit of $${parseFloat(depositAmount).toFixed(2)} successful!`);
  } else {
    alert("⚠️ Please enter a valid amount.");
  }
}

function calculateReturns() {
  if (countdownIntervalId) clearInterval(countdownIntervalId);

  const amount = parseFloat(document.getElementById("amount").value);
  const dateInput = document.getElementById("date").value;
  const resultDiv = document.getElementById("result");
  const countdownContainer = document.getElementById("countdownContainer");
  const countdownEl = document.getElementById("countdown");
  const withdrawEarnings = document.getElementById("withdrawEarnings");
  const withdrawCapital = document.getElementById("withdrawCapital");

  resultDiv.innerHTML = "";
  countdownContainer.style.display = "none";

  if (isNaN(amount) || amount <= 0 || !dateInput) {
    resultDiv.innerText = "⚠️ Please enter a valid amount and date.";
    return;
  }

  const investDate = new Date(dateInput + "T00:00:00");
  const today = new Date();
  if (investDate > today) {
    resultDiv.innerText = "⚠️ Investment date cannot be in the future.";
    return;
  }

  // Determine daily interest rate
  let rate = 0;
  if (amount <= 500) rate = 2.5;
  else if (amount <= 1000) rate = 3.0;
  else rate = 3.5;

  const dailyInterest = (amount * rate) / 100;
  const diffDays = Math.floor((today - investDate) / (1000 * 60 * 60 * 24));
  const totalEarned = diffDays * dailyInterest;
  const daysRemaining = Math.max(30 - diffDays, 0);

  resultDiv.innerHTML = `
    💵 Investment Amount: <strong>$${amount.toFixed(2)}</strong><br>
    📅 Investment Date: ${investDate.toDateString()}<br><br>
    💰 Daily Rate: <strong>${rate}%</strong><br>
    📈 Daily Earnings: <strong>$${dailyInterest.toFixed(2)}</strong><br>
    💵 Total Earned So Far: <strong>$${totalEarned.toFixed(2)}</strong><br>
    🔒 Days Remaining for Capital Withdrawal: <strong>${daysRemaining}</strong> day(s)
  `;

  countdownContainer.style.display = "block";
  const target = new Date(investDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Live countdown
  updateCountdown();
  countdownIntervalId = setInterval(updateCountdown, 1000);

  withdrawEarnings.onclick = function () {
    alert(`💸 You have withdrawn your current earnings of $${totalEarned.toFixed(2)}!`);
  };

  withdrawCapital.onclick = function () {
    if (!withdrawCapital.disabled) {
      alert(`💰 Capital of $${amount.toFixed(2)} successfully withdrawn after 30-day cycle.`);
    }
  };

  function updateCountdown() {
    const now = new Date();
    const diffMs = target - now;
    if (diffMs <= 0) {
      clearInterval(countdownIntervalId);
      countdownEl.innerText = "Cycle complete — capital can now be withdrawn!";
      withdrawCapital.disabled = false;
      withdrawCapital.classList.add("ready");
      return;
    }

    const totalSec = Math.floor(diffMs / 1000);
    const d = Math.floor(totalSec / (24 * 3600));
    const h = Math.floor((totalSec % (24 * 3600)) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    countdownEl.innerText = `Capital unlocks in: ${d}d ${h}h ${m}m ${s}s`;
  }
}
// existing code above

// ===============================
// STEP 2: USER DEPOSIT & WITHDRAW
// ===============================

function requestDeposit() {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  if (!amount || amount <= 0) {
    alert("Enter a valid deposit amount");
    return;
  }

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions.unshift({
    type: "Deposit",
    amount,
    status: "Pending",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  alert("Deposit request submitted for admin approval");
}

function requestWithdraw() {
  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  if (!amount || amount <= 0) {
    alert("Enter a valid withdrawal amount");
    return;
  }

  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  let locked = parseFloat(localStorage.getItem("lockedBalance")) || 0;
  const available = balance - locked;

  if (amount > available) {
    alert("Insufficient available balance");
    return;
  }

  locked += amount;
  localStorage.setItem("lockedBalance", locked.toFixed(2));

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.unshift({
    type: "Withdraw",
    amount,
    status: "Pending",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  alert("Withdrawal request submitted for admin approval");
}

