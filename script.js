document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 2. Fan Registration Form (index.html)
  const fanForm = document.getElementById("fanForm");
  const registrationList = document.getElementById("registrationList");
  const registrationCount = document.getElementById("registrationCount");
  const formMessage = document.getElementById("formMessage");

  if (fanForm && registrationList) {
    const STORAGE_KEY = "boundary_line_fans";

    const loadFans = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const renderFans = () => {
      const fans = loadFans();
      registrationCount.textContent = `${fans.length} SAVED HERE`;
      registrationList.innerHTML = "";

      if (fans.length === 0) {
        registrationList.innerHTML = '<li class="empty-registration">No registrations yet.</li>';
        return;
      }

      fans.forEach((fan) => {
        const li = document.createElement("li");
        li.innerHTML = `<span><strong>${fan.name}</strong> (${fan.format})</span><small>${fan.email}</small>`;
        registrationList.appendChild(li);
      });
    };

    fanForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("fanName").value.trim();
      const email = document.getElementById("fanEmail").value.trim();
      const format = document.getElementById("fanFormat").value;

      if (name.length < 2) {
        formMessage.textContent = "Please enter your full name.";
        formMessage.style.color = "#ef4444";
        return;
      }
      if (!email.includes("@") || !email.includes(".")) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "#ef4444";
        return;
      }
      if (!format) {
        formMessage.textContent = "Please choose your favourite cricket format.";
        formMessage.style.color = "#ef4444";
        return;
      }

      const fans = loadFans();
      fans.unshift({ name, email, format });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fans));

      formMessage.textContent = `Welcome aboard, ${name}! Saved locally.`;
      formMessage.style.color = "#18c964";
      fanForm.reset();
      renderFans();
    });

    renderFans();
  }

  // 3. STUMPS-Style Live Cricket Scorer (matches.html)
  const runsDisplay = document.getElementById("runsDisplay");
  if (!runsDisplay) return; // Exit if not on matches.html

  let state = {
    battingTeam: "PAK",
    bowlingTeam: "IND",
    maxOvers: 20,
    target: null,
    runs: 0,
    wickets: 0,
    legalBalls: 0,
    wides: 0,
    noBalls: 0,
   striker: { name: "Batter 1", runs: 0, balls: 0 },
   nonStriker: { name: "Batter 2", runs: 0, balls: 0 },
   bowler: { name: "Bowler 1", balls: 0, runs: 0, wickets: 0 },
    nextBatterNum: 3,
    currentOverBalls: [],
    completedOvers: []
  };

  let historyStack = [];

  const saveHistory = () => {
    historyStack.push(JSON.parse(JSON.stringify(state)));
  };

  const swapStrike = () => {
    const temp = state.striker;
    state.striker = state.nonStriker;
    state.nonStriker = temp;
  };

  const isInningsOver = () => {
    const maxBalls = state.maxOvers * 6;
    if (state.wickets >= 10 || state.legalBalls >= maxBalls) return true;
    if (state.target && state.runs >= state.target) return true;
    return false;
  };

  const renderScorecard = () => {
    document.getElementById("matchTitleDisplay").textContent = `${state.battingTeam} vs ${state.bowlingTeam}`;
    document.getElementById("runsDisplay").textContent = state.runs;
    document.getElementById("wicketsDisplay").textContent = state.wickets;
    document.getElementById("maxOversDisplay").textContent = state.maxOvers;

    const completedOversNum = Math.floor(state.legalBalls / 6);
    const ballsInOver = state.legalBalls % 6;
    document.getElementById("oversDisplay").textContent = `${completedOversNum}.${ballsInOver}`;

    // CRR & RRR
    const oversDecimal = state.legalBalls / 6;
    const crr = oversDecimal > 0 ? (state.runs / oversDecimal).toFixed(2) : "0.00";
    document.getElementById("crrDisplay").textContent = crr;

    const rrrEl = document.getElementById("rrrDisplay");
    const eqEl = document.getElementById("equationDisplay");
    const statusTag = document.getElementById("matchStatusTag");

    if (state.target) {
      const runsNeeded = Math.max(0, state.target - state.runs);
      const ballsLeft = Math.max(0, state.maxOvers * 6 - state.legalBalls);
      const rrr = ballsLeft > 0 ? ((runsNeeded / ballsLeft) * 6).toFixed(2) : "0.00";
      rrrEl.textContent = `RRR: ${rrr}`;

      if (state.runs >= state.target) {
        eqEl.textContent = `${state.battingTeam} won by ${10 - state.wickets} wickets!`;
        statusTag.textContent = "MATCH COMPLETED";
      } else if (isInningsOver()) {
        eqEl.textContent = `${state.bowlingTeam} won by ${runsNeeded - 1} runs!`;
        statusTag.textContent = "MATCH COMPLETED";
      } else {
        eqEl.textContent = `Need ${runsNeeded} runs off ${ballsLeft} balls`;
        statusTag.textContent = "2ND INNINGS • CHASE";
      }
    } else {
      rrrEl.textContent = "RRR: —";
      if (isInningsOver()) {
        eqEl.textContent = `Innings complete • Target for ${state.bowlingTeam}: ${state.runs + 1}`;
        statusTag.textContent = "INNINGS BREAK";
      } else {
        eqEl.textContent = `${state.battingTeam} batting first`;
        statusTag.textContent = "1ST INNINGS • LIVE";
      }
    }

    // Batters & Extras
    // --- NAYI LINES ---
    const strikerInput = document.getElementById("strikerInput");
    const nonStrikerInput = document.getElementById("nonStrikerInput");

    if (document.activeElement !== strikerInput) {
      strikerInput.value = state.striker.name;
    }
    if (document.activeElement !== nonStrikerInput) {
      nonStrikerInput.value = state.nonStriker.name;
    }

    document.getElementById("strikerStats").textContent = `${state.striker.runs} (${state.striker.balls})`;
    document.getElementById("nonStrikerStats").textContent = `${state.nonStriker.runs} (${state.nonStriker.balls})`;
    document.getElementById("strikerStats").textContent = `${state.striker.runs} (${state.striker.balls})`;
    document.getElementById("nonStrikerStats").textContent = `${state.nonStriker.runs} (${state.nonStriker.balls})`;

    const bowlerInput = document.getElementById("bowlerInput");
    if (bowlerInput && document.activeElement !== bowlerInput) {
      bowlerInput.value = state.bowler.name;
    }

    const bowlerOvers = `${Math.floor(state.bowler.balls / 6)}.${state.bowler.balls % 6}`;
    const bowlerStatsEl = document.getElementById("bowlerStats");
    if (bowlerStatsEl) {
      bowlerStatsEl.textContent = `${bowlerOvers} Ov • ${state.bowler.runs}/${state.bowler.wickets}`;
    }

    const totalExtras = state.wides + state.noBalls;
    document.getElementById("extrasTotal").textContent = totalExtras;
    document.getElementById("extrasBreakdown").textContent = `WD ${state.wides} • NB ${state.noBalls}`;

    // Current Over Track
    const track = document.getElementById("currentOverTrack");
    track.innerHTML = "";
    if (state.currentOverBalls.length === 0) {
      track.innerHTML = '<span class="ball-placeholder">Ready for next delivery...</span>';
    } else {
      state.currentOverBalls.forEach((b) => {
        const pill = document.createElement("span");
        pill.className = `ball-pill ${b.type}`;
        pill.textContent = b.label;
        track.appendChild(pill);
      });
    }

    // Over-by-Over History
    const historyList = document.getElementById("overHistoryList");
    document.getElementById("completedOversCount").textContent = `${state.completedOvers.length} OVERS`;
    historyList.innerHTML = "";

    if (state.completedOvers.length === 0) {
      historyList.innerHTML = '<li class="empty-registration">No completed overs yet.</li>';
    } else {
      state.completedOvers.slice().reverse().forEach((ov) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Over ${ov.overNum}</strong><span>${ov.balls.join("  ")}</span><strong>${ov.runsInOver} runs</strong>`;
        historyList.appendChild(li);
      });
    }
  };

  const checkOverComplete = () => {
    if (state.legalBalls > 0 && state.legalBalls % 6 === 0) {
      const overNum = state.legalBalls / 6;
      const runsInOver = state.currentOverBalls.reduce((sum, b) => sum + b.runs, 0);
      state.completedOvers.push({
        overNum,
        balls: state.currentOverBalls.map((b) => b.label),
        runsInOver
      });
      state.currentOverBalls = [];
      swapStrike();
    }
  };

  // Run Buttons (0, 1, 2, 3, 4, 6)
  document.querySelectorAll(".key-btn[data-runs]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isInningsOver()) return;
      saveHistory();

      const runs = Number(btn.dataset.runs);
      state.runs += runs;
      state.legalBalls += 1;
      state.striker.runs += runs;
      state.striker.balls += 1;
      state.bowler.balls += 1;
      state.bowler.runs += runs;

      let type = "";
      if (runs === 4) type = "four";
      if (runs === 6) type = "six";

      state.currentOverBalls.push({ label: String(runs), runs, type });

      if (runs % 2 === 1) swapStrike();
      checkOverComplete();
      renderScorecard();
    });
  });

  // Extras Buttons (WD, NB)
  document.querySelectorAll(".key-btn[data-extra]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isInningsOver()) return;
      saveHistory();

      const extra = btn.dataset.extra;
      state.runs += 1;
      if (extra === "WD") state.wides += 1;
      if (extra === "NB") state.noBalls += 1;
      state.bowler.runs += 1;

      state.currentOverBalls.push({ label: extra, runs: 1, type: "extra" });
      renderScorecard();
    });
  });

  // Wicket Button
  document.getElementById("wicketBtn").addEventListener("click", () => {
    if (isInningsOver()) return;
    saveHistory();

    state.wickets += 1;
    state.legalBalls += 1;
    state.striker.balls += 1;
    state.currentOverBalls.push({ label: "W", runs: 0, type: "wicket" });

    // --- NAYI LINES ---
    if (state.wickets < 10) {
      const num = state.nextBatterNum++;
      state.striker = { num, name: `Batter ${num}`, runs: 0, balls: 0 };
    }

    checkOverComplete();
    renderScorecard();
  });

  // Undo Button
  document.getElementById("undoBtn").addEventListener("click", () => {
    if (historyStack.length === 0) return;
    state = historyStack.pop();
    renderScorecard();
  });

  // Manual Strike Swap
  document.getElementById("swapStrikeBtn").addEventListener("click", () => {
    saveHistory();
    swapStrike();
    renderScorecard();
  });

  // Apply Setup (Teams, Overs, Target)
  document.getElementById("applySetupBtn").addEventListener("click", () => {
    const bat = document.getElementById("battingTeamInput").value.trim().toUpperCase() || "TEAM A";
    const bowl = document.getElementById("bowlingTeamInput").value.trim().toUpperCase() || "TEAM B";
    const overs = Number(document.getElementById("oversLimitInput").value) || 20;
    const targetVal = Number(document.getElementById("targetInput").value);

    state.battingTeam = bat;
    state.bowlingTeam = bowl;
    state.maxOvers = overs;
    state.target = targetVal > 0 ? targetVal : null;
    renderScorecard();
  });

  // Reset Match
  document.getElementById("resetMatchBtn").addEventListener("click", () => {
    const bat = document.getElementById("battingTeamInput").value.trim().toUpperCase() || "PAK";
    const bowl = document.getElementById("bowlingTeamInput").value.trim().toUpperCase() || "IND";
    const overs = Number(document.getElementById("oversLimitInput").value) || 20;
    const targetVal = Number(document.getElementById("targetInput").value);

    state = {
      battingTeam: bat,
      bowlingTeam: bowl,
      maxOvers: overs,
      target: targetVal > 0 ? targetVal : null,
      runs: 0,
      wickets: 0,
      legalBalls: 0,
      wides: 0,
      noBalls: 0,
      striker: { num: 1, runs: 0, balls: 0 },
      nonStriker: { num: 2, runs: 0, balls: 0 },
      nextBatterNum: 3,
      currentOverBalls: [],
      completedOvers: []
    };
    historyStack = [];
    renderScorecard();
  });

  renderScorecard();
});