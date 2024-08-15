from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# In-memory data storage
data_store = []

# Home route to serve the HTML
@app.route('/')
def index():
    return render_template('index.html')

# Read (GET) - Retrieve all items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(data_store), 200

# Create (POST) - Add a new item
@app.route('/items', methods=['POST'])
def create_item():
    item = request.json
    if not item.get('name'):
        return jsonify({"error": "Item name cannot be empty"}), 400
    data_store.append(item)
    return jsonify(item), 201

# Update (PUT) - Update an existing item by index
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = request.json
    if not item.get('name'):
        return jsonify({"error": "Item name cannot be empty"}), 400
    if 0 <= item_id < len(data_store):
        data_store[item_id]['name'] = item['name']  # Update the specific field
        return jsonify(data_store[item_id]), 200
    return jsonify({"error": "Item not found"}), 404

# Delete (DELETE) - Remove an item by index
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    if 0 <= item_id < len(data_store):
        removed_item = data_store.pop(item_id)
        return jsonify(removed_item), 200
    return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
