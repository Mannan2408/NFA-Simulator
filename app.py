
from flask import Flask, render_template, request, jsonify

from automata import AutomatonEngine

app = Flask(__name__)


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():

    return render_template("index.html")


# ==========================================
# SIMULATION API
# ==========================================

@app.route("/api/simulate", methods=["POST"])
def simulate():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "valid": False,
                "error": "No simulation data received."
            }), 400

        machine = data.get("machine")
        input_string = data.get("input", "")

        if not isinstance(input_string, str):
            return jsonify({
                "valid": False,
                "error": "Input must be a string."
            }), 400

        if not isinstance(machine, dict):
            return jsonify({
                "valid": False,
                "error": "Invalid automaton configuration."
            }), 400

        engine = AutomatonEngine(machine)

        result = engine.simulate(input_string)

        return jsonify(result)

    except (KeyError, TypeError, ValueError) as error:

        return jsonify({
            "valid": False,
            "error": f"Invalid automaton data: {error}"
        }), 400

    except Exception as error:

        app.logger.exception("Simulation error")

        return jsonify({
            "valid": False,
            "error": "An unexpected simulation error occurred."
        }), 500


# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":

    app.run(debug=True)
