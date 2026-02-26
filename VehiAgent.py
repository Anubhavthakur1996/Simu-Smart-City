import random

# Q-table: stores state-action values
Q = {}

def choose_action(state, epsilon=0.2):
  # epsilon-greedy: sometimes explore randomly
  if random.random() < epsilon:
    return random.choice(["road_A", "road_B"])
  else:
    # pick action with highest Q-value
    return max(["road_A", "road_B"], key=lambda a: Q.get((state, a), 0))

def update_Q(state, action, reward, next_state, alpha=0.1, gamma=0.9):
  old_value = Q.get((state, action), 0)
  next_max = max([Q.get((next_state, a), 0) for a in ["road_A", "road_B"]], default=0)
  new_value = old_value + alpha * (reward + gamma * next_max - old_value)
  Q[(state, action)] = new_value

# --- Tiny simulation run ---
state = "pollution_levels"  # simplified single state
for step in range(10):
  action = choose_action(state)
  reward = +1 if action == "road_A" else -1
  update_Q(state, action, reward, state)
  print(f"Step {step}: chose {action}, reward={reward}, Q={Q}")
