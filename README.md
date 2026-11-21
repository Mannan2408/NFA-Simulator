# NFA Simulator

A Python-based web application for creating, visualizing, and simulating **Nondeterministic Finite Automata (NFA)**, including **Epsilon-NFA (ε-NFA)**.

The NFA Simulator provides an interactive interface where users can define states, transitions, input symbols, start states, and final states, generate automata diagrams, and test input strings to determine whether they are accepted or rejected.

---

## Overview

The NFA Simulator is designed as an educational tool to help students understand the working of Nondeterministic Finite Automata through interactive automaton generation, visualization, and string simulation.

It supports both standard NFA and ε-NFA, allowing transitions between states using input symbols as well as epsilon transitions.

## Features

### 1. Automaton Creation
- Define multiple states dynamically.
- Specify the start state.
- Select one or more final states.
- Add and remove transitions.
- Define multiple destinations for transitions.
- Support for standard NFA and ε-NFA.

### 2. Epsilon-NFA Support
- Supports epsilon (ε) transitions without consuming input symbols.
- Accepts the actual epsilon symbol (ε).
- Supports uppercase `E` as an alternative representation of epsilon.
- Implements epsilon closure handling during simulation.

### 3. State Diagram Visualization
- Automatically generates state diagrams.
- Visual distinction between start states and final states.
- Displays transition arrows and labels.
- Supports self-loops.
- Supports curved transitions for improved diagram readability.

### 4. Transition Table
- Automatically generates the transition table.
- Displays destination states for each input symbol.
- Uses the empty-set symbol (∅) when no transition exists.
- Highlights start and final states.

### 5. String Simulator
- Enter custom input strings to test the generated automaton.
- Determines whether an input string is accepted or rejected.
- Handles nondeterministic transitions.
- Supports epsilon transitions during string processing.
- Displays simulation results and execution details.

### 6. Interactive User Interface
- Modern dark-themed interface.
- Dynamic transition input fields.
- Load Example functionality.
- Clear All functionality.
- Responsive layout.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core application logic |
| Flask | Backend web framework |
| HTML5 | Application structure |
| CSS3 | Styling and UI design |
| JavaScript | Frontend interaction and visualization |
| SVG | State diagram rendering |

---

## Project Structure

```text
NFA-Simulator/
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── app.py
├── automata.py
├── requirements.txt
├── README.md
└── .gitignore
```

---

## Installation and Setup

Follow these steps to run the NFA Simulator locally.

### Prerequisites

- Python 3.x
- Visual Studio Code (recommended)
- Git (optional)

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd NFA-Simulator
```

### Step 2: Create a Virtual Environment

```bash
python -m venv venv
```

### Step 3: Activate the Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Run the Application

```bash
python app.py
```

### Step 6: Open in Browser

Open the following URL in your browser:

```text
http://127.0.0.1:5000/
```

The NFA Simulator is now ready to use!

---

## How It Works

The application follows a simple workflow:

1. **Define States:** Enter the states of the automaton.
2. **Configure Transitions:** Specify source states, input symbols, and destination states.
3. **Select States:** Choose the initial state and final states.
4. **Generate Automaton:** Generate the state diagram and transition table.
5. **Enter Input String:** Provide a string to test against the automaton.
6. **Run Simulation:** The application processes the input using NFA transition logic and epsilon closure where applicable.
7. **View Results:** Check whether the input string is accepted or rejected.

---

## Automata Theory

A Nondeterministic Finite Automaton (NFA) is formally represented as:

**NFA:**

M = (Q, Σ, δ, q₀, F)

Where:

- Q = Finite set of states
- Σ = Input alphabet
- δ = Transition function
- q₀ = Initial state
- F = Set of final states

For an NFA:

δ: Q × Σ → 2^Q

For an Epsilon-NFA:

δ: Q × (Σ ∪ {ε}) → 2^Q

An epsilon transition allows the automaton to move between states without consuming an input symbol.

---

## Future Enhancements

The following features may be considered for future development:

- Step-by-step simulation animation.
- Interactive execution trace visualization.
- Improved automatic state positioning and diagram layout.
- Export state diagrams as images.
- Download generated transition tables.

---

## Project Information

**Project Name:** NFA Simulator

**Domain:** Automata Theory and Computability

**Type:** Educational Web Application

**Backend:** Python and Flask

**Frontend:** HTML, CSS and JavaScript

---

## Author

**Mannan Bhatia**

GitHub: [Mannan2408](https://github.com/Mannan2408)

LinkedIn: [Mannan Bhatia](https://www.linkedin.com/in/mannan-bhatia-a42a462a7/)

---

*Built as an academic project to explore and understand Nondeterministic Finite Automata and Epsilon-NFA through interactive simulation and visualization.*