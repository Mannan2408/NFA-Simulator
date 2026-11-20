# NFA Simulator

A web-based **Nondeterministic Finite Automaton (NFA) Simulator** built
with Python and Flask. It allows users to define an NFA or an ε-NFA,
visualize its state-transition diagram, and test input strings to
determine whether they are accepted or rejected.

## Features

-   **NFA and ε-NFA support** --- choose between a standard NFA and an
    epsilon-NFA.
-   **Automaton builder** --- define states, input alphabet, start
    state, final states, and transitions.
-   **Multiple destinations** --- a transition can lead to more than one
    state.
-   **Epsilon transitions** --- enter either `ε` or capital `E` in the
    transition editor to represent an epsilon transition. Capital `E` is
    reserved for epsilon; use a different symbol if `e` is intended as
    an ordinary input symbol.
-   **Automatic state diagram** --- generate an SVG visualization
    showing the start state, final states, transitions, and transition
    labels.
-   **String simulation** --- submit an input string and see whether the
    automaton accepts or rejects it.
-   **Execution results** --- view the resulting state configuration and
    the simulation's state-set results.
-   **Input validation** --- checks state names, start/final states,
    transition endpoints, and input symbols.
-   **Browser-based interface** --- use the simulator through a local
    web browser.

## Tech Stack

-   **Python** --- automata and simulation logic
-   **Flask** --- web application and simulation API
-   **HTML** --- page structure
-   **CSS** --- interface styling
-   **JavaScript** --- transition editor, diagram rendering, and
    browser-side interactions
-   **SVG** --- state diagram rendering

## Project Structure

``` text
NFA-Simulator/
├── app.py                 # Flask application and simulation API
├── automata.py            # NFA and epsilon-NFA computation
├── requirements.txt       # Python dependencies
├── .gitignore             # Files excluded from Git
├── templates/
│   └── index.html         # Main web interface
└── static/
    ├── style.css          # UI styling
    └── script.js          # Builder, visualization, and frontend logic
```

A local virtual environment (for example, `venv/`) is used for Python
dependencies and should not be committed to the repository.

## Getting Started

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd NFA-Simulator
```

Replace `<YOUR_REPOSITORY_URL>` with the HTTPS or SSH URL of your GitHub
repository.

### 2. Create a virtual environment

**Windows (Command Prompt / PowerShell):**

``` bash
python -m venv venv
venv\\Scripts\\activate
```

**macOS / Linux:**

``` bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

``` bash
python -m pip install -r requirements.txt
```

If `requirements.txt` does not yet list Flask, add this line to it:

``` text
Flask
```

Then run the install command again.

### 4. Start the application

``` bash
python app.py
```

Open the local address shown in the terminal. With the default Flask
configuration, this is usually:

``` text
http://127.0.0.1:5000/
```

## How to Use

1.  Open the application in your browser.
2.  Select **Standard NFA** or **ε-NFA**.
3.  Enter the states, alphabet, start state, and one or more final
    states.
4.  Add transitions using the transition editor.
    -   Enter one source state.
    -   Enter an input symbol.
    -   Enter one or more destination states, separated by commas.
    -   For an ε-NFA transition, enter `ε` or capital `E`.
5.  Select **Generate Automaton** to validate the definition and render
    its state diagram.
6.  Enter a string in the String Simulator and run the simulation.
7.  Read the result to see whether the input is accepted or rejected.

### Example ε-NFA

Use the following definition to try a simple epsilon-NFA:

  Setting        Value
  -------------- --------------
  States         `q0, q1, q2`
  Alphabet       `a, b`
  Start state    `q0`
  Final states   `q2`

Transitions:

  From   Input   To
  ------ ------- ------
  `q0`   `E`     `q1`
  `q1`   `a`     `q1`
  `q1`   `b`     `q2`

The string `ab` should be accepted. The string `a` should be rejected.

## How the Simulation Works

### Standard NFA

For each input symbol, the simulator finds all possible destination
states from the current set of states. The next configuration is the
union of those destinations.

### Epsilon-NFA

An ε-NFA can move along epsilon transitions without consuming an input
symbol. The simulator therefore:

1.  Computes the epsilon closure of the start state.
2.  Processes each input symbol from the current set of states.
3.  Computes epsilon closure again after each symbol.
4.  Accepts the string if at least one state in the final configuration
    is a final state.

The epsilon closure includes the supplied state or states themselves, as
well as every state reachable through zero or more epsilon transitions.

## Current Scope

The current project focuses on automaton definition, validation,
state-diagram generation, and string acceptance testing for NFAs and
ε-NFAs.

The following are **not part of the current implementation scope** and
may be considered for a later version:

-   Step-by-step animated simulation
-   Interactive execution-trace playback
-   Animated highlighting of each transition as the input is processed
-   Further layout improvements for large or complex automata

## Troubleshooting

-   **`ModuleNotFoundError: No module named 'flask'`**: Activate the
    project's virtual environment and run
    `python -m pip install -r requirements.txt`. If Flask is not listed
    in `requirements.txt`, add `Flask` and install again.
-   **VS Code cannot resolve the Flask import**: Select the interpreter
    at `venv/Scripts/python.exe` on Windows or `venv/bin/python` on
    macOS/Linux.
-   **The page does not load**: Confirm that `python app.py` is running
    and open the local URL printed in the terminal.
-   **A transition is rejected**: Check that its source and destination
    states exist, and that its input symbol belongs to the declared
    alphabet. Use `E` or `ε` for epsilon transitions, and select ε-NFA
    mode.

## Contributing

Suggestions, bug reports, and improvements are welcome. If you are
collaborating with others, create a feature branch for your changes and
submit a pull request for review.

## License

No license has been specified yet. Unless a license is added to this
repository, the project remains under its default copyright; others
should not assume they have permission to reuse, modify, or distribute
it.
