import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle

# Load dataset
data = pd.read_csv("food_data.csv")

X = data[['food_availability', 'malnutrition_rate', 'health_index']]
y = (data['malnutrition_rate'] > 30).astype(int)

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LogisticRegression()
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open("food_risk_model.pkl", "wb"))

print("Model trained & saved successfully!")

def ai_action_plan(food, malnutrition, health):
    actions = []

    if food < 30:
        actions.append("Emergency food distribution and supply chain stabilization")

    if malnutrition > 70:
        actions.append("Immediate nutrition support for children, mothers, and elderly")

    if health < 30:
        actions.append("Deploy mobile health clinics and improve sanitation facilities")

    if food < 40 and malnutrition > 60:
        actions.append("Government and NGO intervention required at district level")

    if not actions:
        actions.append("Situation stable. Continue monitoring and preventive programs")

    return actions
