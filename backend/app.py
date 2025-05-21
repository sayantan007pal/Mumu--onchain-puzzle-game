from flask import Flask, request, jsonify
from flask_cors import CORS
from game_logic import update_grid_with_move, apply_formula, check_completion

app = Flask(__name__)
CORS(app)

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    grid = data['grid']
    width = data['width']
    height = data['height']
    x = data['x']
    y = data['y']
    direction = data['direction']
    new_grid = update_grid_with_move(grid, width, height, x, y, direction)
    return jsonify({'grid': new_grid})


@app.route('/apply_formula', methods=['POST'])
def apply_formula_route():
    data = request.json
    grid = data['grid']
    width = data['width']
    height = data['height']
    formula = data['formula']  # {'input': int, 'output': int}
    new_grid = apply_formula(grid, width, height, formula)
    return jsonify({'grid': new_grid})


@app.route('/check_completion', methods=['POST'])
def check_completion_route():
    data = request.json
    grid = data['grid']
    target = data['target']
    completed = check_completion(grid, target)
    return jsonify({'completed': completed})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/toggle_mock', methods=['POST'])
def toggle_mock():
    data = request.json
    mode = data.get('mock', False)
    # In a real implementation, you would set a global or config value here
    # For now, just echo the requested mode
    return jsonify({
        'mock': mode,
        'message': 'Mock mode toggled (no-op in backend)'
    })


if __name__ == '__main__':
    app.run(debug=True)
