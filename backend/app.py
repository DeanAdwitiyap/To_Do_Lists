from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

tasks = []
task_id = 1

@app.route("/", methods=["GET"])
def home():
    return "Backend Flask Aktif!"

@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def add_task():
    global task_id
    data = request.get_json()
    title = data.get("title", "")
    deadline = data.get("deadline", "")

    waktu = datetime.now().strftime("%d %B %Y - %H:%M:%S")
    task = {
        "id": task_id,
        "title": title,
        "timestamp": waktu,
        "deadline": deadline
    }

    print(f"[TO-DO BARU] {title} | Deadline: {deadline}")
    tasks.append(task)
    task_id += 1
    return jsonify(task), 201

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task["id"] != id]
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
