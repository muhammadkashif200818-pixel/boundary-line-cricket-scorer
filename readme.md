# Boundary Line — Cricket Scorer & Hub

**Boundary Line** is an interactive, browser-based cricket scoring application and cricket hub inspired by the workflow of **STUMPS – The Cricket Scorer**, created for the **CSC102 — Application of ICT** course.

## Key Features

- **Ball-by-Ball Live Scorer (`matches.html`)**:
  - Real-time scoring buttons for `0`, `1`, `2`, `3`, `4`, `6`, **Wides (`WD`)**, **No-Balls (`NB`)**, and **Wickets (`OUT`)**.
  - Automatic over completion after 6 legal deliveries with a live completed-overs log.
  - Automatic strike rotation on odd runs (`1`, `3`) and at the end of each over, plus a manual **Swap Strike** control.
  - Direct in-card editing for **Striker**, **Non-Striker**, and **Bowler** names.
  - Real-time **Bowler** tracking for overs bowled, runs conceded, and wickets taken.
  - Live **Current Run Rate (CRR)** and **Required Run Rate (RRR)** / chase equation when a target is set.
  - **Undo** support to revert the last delivery.
- **Cricket Hub & Fan Registration (`index.html`)**:
  - Scorecard preview, feature highlights, and visual gallery.
  - Form validation and browser `localStorage` persistence for fan registrations.
- **About & Developers (`about.html`)**:
  - Technical overview of HTML5, CSS Grid/Flexbox, and JavaScript architecture along with project developer profiles.
- **Responsive Dark-Stadium UI (`style.css`)**:
  - Designed with CSS variables and responsive grid/flexbox layouts for desktop and mobile screens.

## Project Structure

```text
boundary-line/
├── index.html              # Landing page, scorecard preview & fan registration
├── matches.html            # Live ball-by-ball cricket scorer & points table
├── about.html              # Project details & developer profiles
├── style.css               # Theme styling & responsive breakpoints
├── script.js               # Scoring engine, undo stack & localStorage handling
├── Saifullah.jpeg          # Developer photo
├── Muhammad Umar.jpeg      # Developer photo
├── Muhammad Kashif.png     # Developer photo
├── cricket-dusk-art.png    # Gallery image
├── cricket-stadium-art.png # Gallery image
└── README.md               # Project documentation
```

## Running Locally

1. Clone or download the repository to your computer.
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
3. No external server or build step is required.

## Project Developers

| Name | SAP ID |
| --- | --- |
| Saifullah | `5000020370` |
| Muhammad Umar | `5000020660` |
| Muhammad Kashif | `5000020657` |

## Course Details

- **Course**: CSC102 — Application of ICT
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Browser `localStorage`