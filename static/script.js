
"use strict";

// ==========================================
// NFA SIMULATOR - AUTOMATON BUILDER
// ==========================================

const $ = (id) => document.getElementById(id);

const transitionBody = $("transitionBody");

let generatedAutomaton = null;

// ------------------------------------------
// 1. HELPER FUNCTIONS
// ------------------------------------------

function splitValues(value) {
    return [...new Set(
        value.split(",").map(item => item.trim()).filter(Boolean)
    )];
}

function isEpsilonMode() {
    return document.querySelector(
        'input[name="machineType"]:checked'
    ).value === "epsilon";
}

function normalizeSymbol(symbol) {

    const value = symbol.trim();

    if (
        value === "ε" ||
        value === "E" ||
        ["epsilon", "eps"].includes(value.toLowerCase())
    ) {
        return "ε";
    }

    return value;
}

function showMessage(message, type = "error") {
    const element = $("message");

    element.textContent = message;
    element.className = "result-message " + type;
    element.style.display = "block";
}

function clearMessage() {
    $("message").textContent = "";
    $("message").style.display = "none";
}

// ------------------------------------------
// 2. TRANSITION EDITOR
// ------------------------------------------

function addTransition(from = "", symbol = "", to = "") {

    const row = document.createElement("tr");

    const fields = [
        { className: "from-state", value: from, placeholder: "q0" },
        { className: "input-symbol", value: symbol, placeholder: "0 / 1 / ε" },
        { className: "to-state", value: to, placeholder: "q1, q2" }
    ];

    fields.forEach(field => {

        const cell = document.createElement("td");
        const input = document.createElement("input");

        input.className = field.className;
        input.value = field.value;
        input.placeholder = field.placeholder;

        input.addEventListener("input", clearGeneratedOutput);

        cell.appendChild(input);
        row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");

    removeButton.className = "button secondary";
    removeButton.textContent = "Remove";
    removeButton.type = "button";

    removeButton.addEventListener("click", () => {
        row.remove();
        clearGeneratedOutput();
    });

    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    transitionBody.appendChild(row);
}

// ------------------------------------------
// 3. READ AUTOMATON INPUT
// ------------------------------------------

function readAutomaton() {

    const states = splitValues($("states").value);
    const alphabet = splitValues($("alphabet").value);
    const start = $("startState").value.trim();
    const finals = splitValues($("finalStates").value);

    const transitions = [];

    const rows = [...transitionBody.querySelectorAll("tr")];

    rows.forEach(row => {

        const from = row.querySelector(".from-state").value.trim();
        const rawSymbol = row.querySelector(".input-symbol").value.trim();
        const destinations = splitValues(
            row.querySelector(".to-state").value
        );

        if (!from && !rawSymbol && destinations.length === 0) {
            return;
        }

        transitions.push({
            from,
            symbol: normalizeSymbol(rawSymbol),
            destinations
        });
    });

    return {
        states,
        alphabet,
        start,
        finals,
        transitions,
        type: isEpsilonMode() ? "epsilon" : "nfa"
    };
}

// ------------------------------------------
// 4. VALIDATION
// ------------------------------------------

function validateAutomaton(machine) {

    if (machine.states.length === 0) {
        return "Please enter at least one state.";
    }

    if (machine.alphabet.length === 0) {
        return "Please enter at least one alphabet symbol.";
    }

    if (
    machine.alphabet.includes("ε") ||
    machine.alphabet.includes("E")
    ) {
        return "Do not include ε in the alphabet. It is reserved for epsilon transitions.";
    }

    if (!machine.start) {
        return "Please enter a start state.";
    }

    if (!machine.states.includes(machine.start)) {
        return "The start state must exist in your state list.";
    }

    if (machine.finals.length === 0) {
        return "Please enter at least one final state.";
    }

    for (const state of machine.finals) {
        if (!machine.states.includes(state)) {
            return `Final state "${state}" does not exist.`;
        }
    }

    if (machine.states.includes("")) {
        return "Invalid state configuration.";
    }

    for (const transition of machine.transitions) {

        if (!transition.from || !transition.symbol ||
            transition.destinations.length === 0) {
            return "Every transition must have a source, input symbol and destination.";
        }

        if (!machine.states.includes(transition.from)) {
            return `Source state "${transition.from}" does not exist.`;
        }

        const isEpsilon = transition.symbol === "ε";

        if (isEpsilon && machine.type !== "epsilon") {
            return "Epsilon transitions are only allowed in ε-NFA mode.";
        }

        if (!isEpsilon &&
            !machine.alphabet.includes(transition.symbol)) {
            return `Symbol "${transition.symbol}" is not in your alphabet.`;
        }

        for (const destination of transition.destinations) {
            if (!machine.states.includes(destination)) {
                return `Destination state "${destination}" does not exist.`;
            }
        }
    }

    return "";
}

// ------------------------------------------
// 5. GENERATE AUTOMATON
// ------------------------------------------

function generateAutomaton() {

    clearMessage();

    const machine = readAutomaton();
    const error = validateAutomaton(machine);

    if (error) {
        generatedAutomaton = null;
        showMessage(error, "error");
        return;
    }

    generatedAutomaton = machine;

    renderAutomaton(machine);

    showMessage(
        "Automaton generated successfully! You can now view its state diagram.",
        "success"
    );
}

// ------------------------------------------
// 6. SVG VISUALIZATION
// ------------------------------------------

function renderAutomaton(machine) {

    const container = $("visualization").querySelector(
        ".graph-placeholder"
    );

    container.innerHTML = "";

    const count = machine.states.length;

    const width = Math.max(650, count * 190 + 100);
    const height = 340;

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.display = "block";
    svg.style.maxWidth = "100%";
    svg.style.margin = "auto";

    // Arrow definitions

    const defs = document.createElementNS(svgNS, "defs");

    const marker = document.createElementNS(svgNS, "marker");

    marker.setAttribute("id", "nfa-arrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");

    const arrow = document.createElementNS(svgNS, "path");

    arrow.setAttribute("d", "M0,0 L0,6 L9,3 Z");
    arrow.setAttribute("fill", "#8299c7");

    marker.appendChild(arrow);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // State positions

    const positions = {};

    machine.states.forEach((state, index) => {

        positions[state] = {
            x: 75 + index * ((width - 150) / Math.max(count - 1, 1)),
            y: 175
        };

    });

    // Group transitions by source and destination

    const edgeGroups = {};

    machine.transitions.forEach(transition => {

        transition.destinations.forEach(destination => {

            const key = JSON.stringify([
                transition.from,
                destination
            ]);

            if (!edgeGroups[key]) {
                edgeGroups[key] = [];
            }

            edgeGroups[key].push(transition.symbol);

        });

    });

    // Draw transitions

    Object.entries(edgeGroups).forEach(([key, symbols]) => {

        const [from, to] = JSON.parse(key);

        const p1 = positions[from];
        const p2 = positions[to];

        const path = document.createElementNS(svgNS, "path");

        let d;
        let labelX;
        let labelY;

        if (from === to) {

            d = `M ${p1.x - 19} ${p1.y - 26}
                 C ${p1.x - 85} ${p1.y - 115},
                   ${p1.x + 85} ${p1.y - 115},
                   ${p1.x + 19} ${p1.y - 26}`;

            labelX = p1.x;
            labelY = p1.y - 90;

        } else {

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;

            const distance = Math.hypot(dx, dy) || 1;

            const ux = dx / distance;
            const uy = dy / distance;

            const sx = p1.x + ux * 36;
            const sy = p1.y + uy * 36;

            const ex = p2.x - ux * 36;
            const ey = p2.y - uy * 36;

            const direction = from.localeCompare(to) < 0 ? 1 : -1;
            const curve = direction * Math.min(45, distance * 0.12);

            const cx = (sx + ex) / 2 - uy * curve;
            const cy = (sy + ey) / 2 + ux * curve;

            d = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;

            labelX = (sx + 2 * cx + ex) / 4;
            labelY = (sy + 2 * cy + ey) / 4 - 10;

        }

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#8299c7");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("marker-end", "url(#nfa-arrow)");

        svg.appendChild(path);

        const label = document.createElementNS(svgNS, "text");

        label.setAttribute("x", labelX);
        label.setAttribute("y", labelY);
        label.setAttribute("fill", "#b8c9ed");
        label.setAttribute("font-size", "13");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("text-anchor", "middle");

        label.textContent = symbols.join(", ");

        svg.appendChild(label);

    });

    // Draw start arrow and state nodes

    machine.states.forEach(state => {

        const p = positions[state];

        if (state === machine.start) {

            const startLine = document.createElementNS(svgNS, "line");

            startLine.setAttribute("x1", p.x - 75);
            startLine.setAttribute("y1", p.y);
            startLine.setAttribute("x2", p.x - 38);
            startLine.setAttribute("y2", p.y);
            startLine.setAttribute("stroke", "#6d8cff");
            startLine.setAttribute("stroke-width", "2.5");
            startLine.setAttribute("marker-end", "url(#nfa-arrow)");

            svg.appendChild(startLine);

        }

        const isFinal = machine.finals.includes(state);

        const circle = document.createElementNS(svgNS, "circle");

        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
        circle.setAttribute("r", "34");
        circle.setAttribute("fill", "#192d50");
        circle.setAttribute("stroke", isFinal ? "#35cf91" : "#8299c7");
        circle.setAttribute("stroke-width", "2.5");

        svg.appendChild(circle);

        if (isFinal) {

            const inner = document.createElementNS(svgNS, "circle");

            inner.setAttribute("cx", p.x);
            inner.setAttribute("cy", p.y);
            inner.setAttribute("r", "28");
            inner.setAttribute("fill", "none");
            inner.setAttribute("stroke", "#35cf91");
            inner.setAttribute("stroke-width", "1.5");

            svg.appendChild(inner);

        }

        const text = document.createElementNS(svgNS, "text");

        text.setAttribute("x", p.x);
        text.setAttribute("y", p.y + 5);
        text.setAttribute("fill", "#ffffff");
        text.setAttribute("font-size", "14");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("text-anchor", "middle");

        text.textContent = state;

        svg.appendChild(text);

    });

    container.style.display = "block";
    container.style.minHeight = "300px";
    container.style.overflowX = "auto";
    container.appendChild(svg);

    const caption = document.createElement("p");

    caption.style.color = "#8795aa";
    caption.style.fontSize = "12px";
    caption.style.marginTop = "18px";
    caption.textContent =
        `${machine.type === "epsilon" ? "ε-NFA" : "Standard NFA"} · ` +
        `${count} states · ${machine.transitions.length} transition entries`;

    container.appendChild(caption);
}

// ------------------------------------------
// 7. CLEAR GENERATED OUTPUT
// ------------------------------------------

function clearGeneratedOutput() {

    generatedAutomaton = null;

    const container = $("visualization").querySelector(
        ".graph-placeholder"
    );

    container.innerHTML = `
        <div class="graph-icon">◎</div>
        <h3>No automaton generated</h3>
        <p>Configure your states and transitions, then click
        Generate Automaton.</p>
    `;

    $("simulationResult").innerHTML = "";

}

// ------------------------------------------
// 8. LOAD EXAMPLE
// ------------------------------------------

function loadExample() {

    $("states").value = "q0, q1, q2";
    $("alphabet").value = "0, 1";
    $("startState").value = "q0";
    $("finalStates").value = "q2";

    document.querySelector(
        'input[name="machineType"][value="nfa"]'
    ).checked = true;

    updateMachineSelection();

    transitionBody.innerHTML = "";

    addTransition("q0", "0", "q0, q1");
    addTransition("q0", "1", "q0");
    addTransition("q1", "1", "q2");
    addTransition("q2", "0", "q2");
    addTransition("q2", "1", "q2");

    clearGeneratedOutput();
    clearMessage();

}

// ------------------------------------------
// 9. CLEAR ALL
// ------------------------------------------

function clearAll() {

    $("states").value = "";
    $("alphabet").value = "";
    $("startState").value = "";
    $("finalStates").value = "";

    transitionBody.innerHTML = "";

    clearGeneratedOutput();
    clearMessage();

}

// ------------------------------------------
// 10. MACHINE TYPE SELECTION
// ------------------------------------------

function updateMachineSelection() {

    document.querySelectorAll(".machine-option").forEach(option => {

        const radio = option.querySelector("input");

        option.classList.toggle("selected", radio.checked);

    });

    const symbolInputs = document.querySelectorAll(".input-symbol");

    symbolInputs.forEach(input => {

        input.placeholder = isEpsilonMode()
            ? "0 / 1 / ε"
            : "0 / 1";

    });

    clearGeneratedOutput();
    clearMessage();

}

// ------------------------------------------
// 11. EVENT LISTENERS
// ------------------------------------------

$("addTransition").addEventListener("click", () => {
    addTransition();
});

$("generateBtn").addEventListener("click", generateAutomaton);

$("exampleBtn").addEventListener("click", loadExample);

$("clearBtn").addEventListener("click", clearAll);

document.querySelectorAll(
    'input[name="machineType"]'
).forEach(radio => {

    radio.addEventListener("change", updateMachineSelection);

});

[
    "states",
    "alphabet",
    "startState",
    "finalStates"
].forEach(id => {

    $(id).addEventListener("input", clearGeneratedOutput);

});

// ------------------------------------------
// INITIALIZE
// ------------------------------------------

addTransition();
updateMachineSelection();

console.log("NFA Simulator builder initialized successfully.");


// ==========================================
// 12. PYTHON SIMULATION CONNECTION
// ==========================================

async function testString() {

    const resultContainer = $("simulationResult");

    // Check if automaton has been generated

    if (!generatedAutomaton) {

        resultContainer.innerHTML = `
            <div class="result-message error">
                Please generate an automaton first.
            </div>
        `;

        return;
    }

    const inputString = $("testString").value;

    resultContainer.innerHTML = `
        <div class="result-message">
            Processing input string...
        </div>
    `;

    try {

        // Send data to Python backend

        const response = await fetch("/api/simulate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                machine: generatedAutomaton,

                input: inputString

            })

        });

        const result = await response.json();

        if (!response.ok || !result.valid) {

            resultContainer.innerHTML = `
                <div class="result-message error">
                    ${escapeResult(result.error || "Simulation failed.")}
                </div>
            `;

            return;
        }

        displaySimulationResult(result);

    } catch (error) {

        resultContainer.innerHTML = `
            <div class="result-message error">
                Unable to connect to the Python simulation engine.
                Please check your Flask server.
            </div>
        `;

        console.error(error);

    }

}

// ------------------------------------------
// SAFE HTML TEXT
// ------------------------------------------

function escapeResult(value) {

    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;

}

// ------------------------------------------
// DISPLAY SIMULATION RESULT
// ------------------------------------------

function displaySimulationResult(result) {

    const container = $("simulationResult");

    const accepted = result.accepted;

    const statusClass = accepted ? "success" : "error";

    const statusText = accepted
        ? "STRING ACCEPTED ✓"
        : "STRING REJECTED ✗";

    let html = `

        <div class="simulation-card">

            <div class="simulation-status ${statusClass}">
                ${statusText}
            </div>

            <div class="simulation-summary">

                <div class="simulation-stat">
                    <span>Automaton</span>
                    <strong>
                        ${result.machine_type === "epsilon"
                            ? "ε-NFA"
                            : "Standard NFA"}
                    </strong>
                </div>

                <div class="simulation-stat">
                    <span>Input String</span>
                    <strong>
                        ${escapeResult(result.input || "ε")}
                    </strong>
                </div>

                <div class="simulation-stat">
                    <span>Input Symbols</span>
                    <strong>${result.total_steps}</strong>
                </div>

            </div>

            <h3>Execution Trace</h3>

            <p class="trace-description">
                Follow how the automaton processes each input symbol.
            </p>

            <div class="trace-list">
    `;

    result.steps.forEach(step => {

        const states = step.states.length
            ? step.states.map(escapeResult).join(", ")
            : "∅";

        html += `

            <div class="trace-step">

                <div class="trace-number">
                    ${step.step}
                </div>

                <div class="trace-content">

                    <span class="trace-symbol">
                        ${escapeResult(step.symbol)}
                    </span>

                    <strong>
                        { ${states} }
                    </strong>

                    <small>
                        ${escapeResult(step.description)}
                    </small>

                </div>

            </div>

        `;

    });

    html += `

            </div>

            <div class="final-configuration">

                <span>Final State Configuration</span>

                <strong>
                    { ${
                        result.final_states_reached.length
                            ? result.final_states_reached
                                .map(escapeResult).join(", ")
                            : "∅"
                    } }
                </strong>

                <span>Accepting States Reached</span>

                <strong>
                    ${
                        result.accepting_states.length
                            ? result.accepting_states
                                .map(escapeResult).join(", ")
                            : "None"
                    }
                </strong>

            </div>

        </div>

    `;

    container.innerHTML = html;

}

// ------------------------------------------
// STRING SIMULATOR EVENTS
// ------------------------------------------

$("testBtn").addEventListener("click", testString);

$("testString").addEventListener("keydown", event => {

    if (event.key === "Enter") {
        testString();
    }

});
