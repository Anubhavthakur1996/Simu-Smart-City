import os
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import Metadata
import pandas as pd
import plotly.express as px

current_dir = os.path.dirname(os.path.abspath(__file__))
data = pd.read_csv(os.path.join(current_dir, './data/openaq chd sec 22 (1-1-25 to 2-12-26).csv'))

# Step 1: Define metadata
metadata = Metadata.detect_from_dataframe(data)
# metadata.detect_from_dataframe(data)

# Step 2: Create synthesizer
synthesizer = GaussianCopulaSynthesizer(metadata)

# Step 3: Train synthesizer on real data
synthesizer.fit(data)

# Step 4: Generate synthetic data
# synthetic_data = synthesizer.sample(num_rows=5)
synthetic_data = synthesizer.sample(1000)

# real data
print("Real Data:")
print(data.head())

print("Synthetic Data:")
print(synthetic_data)

# Filtering for specific pollutants
conditionalData = data[data['parameter'].isin(['no2', 'o3', 'pm10', 'pm2.5', 'so2'])]

# Save synthetic data to CSV
synthetic_data.to_csv(os.path.join(current_dir, "./data/synthetic_aqi.csv"), index=False)
# data = pd.read_csv(os.path.join(current_dir, './data/openaq chd sec 22 (1-1-25 to 2-12-26).csv'))


# Save to JSON
# synthetic_data.to_json("synthetic_aqi.json", orient="records")


# plotting Graphs
# Creating a multi-line plot to visualize variouse pollutants
# fig = px.line( conditionalData.sample(50), # sample more rows for smoother lines 
#               x='datetimeLocal',
#               y='value', # <-- numeric concentration values 
#               color='parameter',
#               title='Pollution Levels Over Time - Mohali Sec 22' ) 

# fig.update_layout( 
#   xaxis_title="Time", 
#   yaxis_title="Pollution levels", 
#   legend_title="Pollutant" ) 

# fig.show()

# Box Plot
# fig = px.box(
#     conditionalData,
#     x="parameter",
#     y="value",
#     color="parameter",
#     title="Distribution of Pollutant Concentrations"
# )
# fig.show()

# # Histogram
# fig = px.histogram(
#     conditionalData,
#     x="value",
#     color="parameter",
#     barmode="overlay",
#     nbins=50,
#     title="Pollutant Value Distributions"
# )
# fig.show()

# # Scatter Plot
# fig = px.scatter(
#     conditionalData,
#     x="datetimeLocal",
#     y="value",
#     color="parameter",
#     title="Pollutant Scatter Over Time"
# )
# fig.show()


# Interactive dropdown selector
# fig = px.line(
#     conditionalData,
#     x="datetimeLocal",
#     y="value",
#     color="parameter",
#     title="Pollution Levels Over Time"
# )

# fig.update_layout(
#     updatemenus=[{
#         "buttons": [
#             {"method": "update", "label": "CO", "args": [{"visible": [True, False, False, False]}]},
#             {"method": "update", "label": "NO2", "args": [{"visible": [False, True, False, False]}]},
#             # add more pollutants here
#         ]
#     }]
# )
# fig.show()





# Final Graph
# Faceted Line CHart
# fig = px.line(
#     conditionalData,
#     x="datetimeLocal",
#     y="value",
#     color="parameter",
#     facet_col="parameter",
#     facet_col_wrap=3,
#     title="Pollution Levels Over Time (Faceted by Pollutant)"
# )
# fig.update_layout(xaxis_title="Time", yaxis_title="Concentration")
# fig.show()