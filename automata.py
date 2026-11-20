
# ==========================================
# NFA SIMULATOR - AUTOMATA ENGINE
# Standard NFA and Epsilon NFA
# ==========================================

class AutomatonEngine:

    def __init__(self, machine):

        self.states = machine["states"]
        self.alphabet = machine["alphabet"]
        self.start = machine["start"]
        self.finals = machine["finals"]
        self.transitions = machine["transitions"]
        self.machine_type = machine["type"]

        # Create transition dictionary
        self.transition_map = {}

        for transition in self.transitions:

            from_state = transition["from"]
            symbol = transition["symbol"].strip()

            if symbol == "E":
                symbol = "ε"

            key = (from_state, symbol)

            if key not in self.transition_map:
                self.transition_map[key] = set()

            self.transition_map[key].update(
                transition["destinations"]
            )

    # --------------------------------------
    # 1. GET DESTINATION STATES
    # --------------------------------------

    def move(self, current_states, symbol):

        result = set()

        for state in current_states:

            destinations = self.transition_map.get(
                (state, symbol), set()
            )

            result.update(destinations)

        return result

    # --------------------------------------
    # 2. EPSILON CLOSURE
    # --------------------------------------

    def epsilon_closure(self, states):

        closure = set(states)

        stack = list(states)

        while stack:

            current = stack.pop()

            epsilon_states = self.transition_map.get(
                (current, "ε"), set()
            )

            for state in epsilon_states:

                if state not in closure:

                    closure.add(state)
                    stack.append(state)

        return closure

    # --------------------------------------
    # 3. TOKENIZE INPUT
    # --------------------------------------

    def tokenize(self, input_string):

        input_string = input_string.strip()

        if input_string == "":
            return []

        # Single-character alphabets:
        # Example: 0101 -> ['0', '1', '0', '1']

        if all(len(symbol) == 1 for symbol in self.alphabet):

            return list(input_string)

        # Multi-character alphabets:
        # Example: id plus minus -> ['id', 'plus', 'minus']

        return input_string.split()

    # --------------------------------------
    # 4. SIMULATE NFA / EPSILON NFA
    # --------------------------------------

    def simulate(self, input_string):

        tokens = self.tokenize(input_string)

        # Validate input symbols

        invalid_symbols = [
            symbol for symbol in tokens
            if symbol not in self.alphabet
        ]

        if invalid_symbols:

            return {
                "valid": False,
                "accepted": False,
                "error": (
                    "Invalid input symbol(s): "
                    + ", ".join(invalid_symbols)
                )
            }

        # Initial state

        current_states = {self.start}

        if self.machine_type == "epsilon":

            current_states = self.epsilon_closure(
                current_states
            )

        steps = []

        steps.append({
            "step": 0,
            "symbol": "START",
            "states": sorted(current_states),
            "description": "Initial state configuration"
        })

        # Process each input symbol

        for index, symbol in enumerate(tokens, start=1):

            # Find possible destinations

            next_states = self.move(
                current_states,
                symbol
            )

            # Apply epsilon closure

            if self.machine_type == "epsilon":

                next_states = self.epsilon_closure(
                    next_states
                )

            current_states = next_states

            steps.append({
                "step": index,
                "symbol": symbol,
                "states": sorted(current_states),
                "description": (
                    f"After processing input symbol '{symbol}'"
                )
            })

        # Acceptance condition

        accepted = bool(
            current_states.intersection(self.finals)
        )

        return {

            "valid": True,

            "accepted": accepted,

            "machine_type": self.machine_type,

            "input": input_string,

            "tokens": tokens,

            "final_states_reached": sorted(current_states),

            "accepting_states": sorted(
                current_states.intersection(self.finals)
            ),

            "steps": steps,

            "total_steps": len(tokens)

        }
