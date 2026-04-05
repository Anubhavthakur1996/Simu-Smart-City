import os
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import Metadata
import pandas as pd
import plotly.express as px

current_dir = os.path.dirname(os.path.abspath(__file__))
data = pd.read_csv(os.path.join(current_dir, './data/openaq chd sec 22 (1-1-25 to 2-12-26).csv'))


def validateSyntheticData(real, synthetic):
  for col in ['pm25','pm10','nox','so2','co']:  # adjust to your pollutants
    fig = px.histogram(
      pd.concat([
        real[[col]].assign(dataset="real"),
        synthetic[[col]].assign(dataset="synthetic")
      ]),
      x=col, color="dataset", barmode="overlay", nbins=50,
      title=f"Distribution comparison for {col}"
    )
    fig.show()

def generateSyntheticData():
  # 1 - Define metadata
  metadata = Metadata.detect_from_dataframe(data)
  # metadata.detect_from_dataframe(data)

  # 2 - Create synthesizer
  synthesizer = GaussianCopulaSynthesizer(metadata)

  # 3 - Train synthesizer on real data
  synthesizer.fit(data)

  # 4 - Generate synthetic data
  # synthetic_data = synthesizer.sample(num_rows=5)
  synthetic_data = synthesizer.sample(1000)

  # real data
  print("Real Data:")
  print(data.head())

  print("Synthetic Data:")
  print(synthetic_data)

  # Filtering for specific pollutants
  conditionalData = data[data['parameter'].isin(['nox', 'co2', 'co', 'pm10', 'pm25', 'so2'])]

  # Plotting charts for proof
  # validateSyntheticData(conditionalData, (synthetic_data[synthetic_data['parameter'].isin(['nox', 'co2', 'co', 'pm10', 'pm25', 'so2'])]))

  # convert parameter column values to column
  conv_data = conditionalData.pivot_table(index="datetimeUtc", columns='parameter', values='value').reset_index()

  # Save synthetic data to CSV
  # synthetic_data.to_csv(os.path.join(current_dir, "./data/synthetic_aqi.csv"), index=False)
  # data = pd.read_csv(os.path.join(current_dir, './data/openaq chd sec 22 (1-1-25 to 2-12-26).csv'))

  # remove null values
  # synthetic_data = synthetic_data.dropna(axis=1, how='all')  # drop columns with all null values

  # Get 100 random rows (or fewer if dataset is smaller)
  sample_df = conv_data.sample(n=100, random_state=42)  # random_state for reproducibility

  # Save to JSON
  # sample_df.to_json(os.path.join(current_dir, "./data/synthetic_aqi.json"), orient="records")
  
  # Return JSON string of the sample data
  return sample_df.to_json(orient="records")
    