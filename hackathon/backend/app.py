from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# ================= LOAD ML MODEL =================
model = pickle.load(open("food_risk_model.pkl", "rb"))

# ================= HOME =================
@app.route("/")
def home():
    return "NutriGuard Backend Running"

# ================= ML PREDICTION =================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [[
        float(data['food_availability']),
        float(data['malnutrition_rate']),
        float(data['health_index'])
    ]]

    prediction = model.predict(features)[0]

    return jsonify({
        "risk": "High Food Insecurity" if prediction == 1 else "Low Food Insecurity"
    })

# ================= DATASET =================
@app.route("/dataset", methods=["GET"])
def dataset():
    data = pd.read_csv("food_data.csv")
    return data.to_json(orient="records")

# ================= AI CHATBOT (NEW) =================
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json

    question = data.get("question", "").lower()
    risk_score = float(data.get("riskScore", 0))
    risk_level = data.get("riskLevel", "Unknown")

    # ML-aware context
    if risk_score <= 20:
        severity = "low"
    elif risk_score <= 40:
        severity = "moderate"
    elif risk_score <= 60:
        severity = "high"
    elif risk_score <= 80:
        severity = "very high"
    else:
        severity = "extreme"

    # AI-style responses
    if "malnutrition" in question:
        if risk_score > 60:
            reply = (
                "Malnutrition is a major contributor to the current "
                + risk_level +
                " risk. Immediate nutrition supplementation, maternal-child programs, "
                "and community health interventions are recommended."
            )
        else:
            reply = (
                "To further reduce malnutrition under "
                + risk_level +
                " risk, focus on diet diversity, school feeding programs, "
                "and preventive healthcare."
            )

    elif "food" in question:
        reply = (
            "Food availability directly affects food security. "
            "Given the current "
            + risk_level +
            " risk, improving supply chains, affordability, and storage "
            "will significantly reduce vulnerability."
        )

    elif "improve" in question or "first" in question:
        reply = (
            "Based on the ML assessment and risk score, the first priority "
            "should be reducing malnutrition, as it has the highest impact "
            "on overall food insecurity."
        )

    elif "health" in question:
        reply = (
            "Health infrastructure influences nutrition outcomes. "
            "Under "
            + risk_level +
            " risk conditions, strengthening primary healthcare "
            "and disease prevention is essential."
        )

    else:
        reply = (
            "The system indicates a "
            + risk_level +
            " food security risk scenario. "
            "An integrated approach combining food access, nutrition, "
            "and healthcare improvements is recommended."
        )

    return jsonify({
        "reply": reply,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "severity": severity
    })

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)
