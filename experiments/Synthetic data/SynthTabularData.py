import os
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import SingleTableMetadata
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))
data = pd.read_csv(os.path.join(current_dir, 'openaq chd sec 22 (1-1-25 to 2-12-26).csv'))

# Step 1: Define metadata
metadata = SingleTableMetadata()
metadata.detect_from_dataframe(data)

# Step 2: Create synthesizer
synthesizer = GaussianCopulaSynthesizer(metadata)

# Step 3: Train synthesizer on real data
synthesizer.fit(data)

# Step 4: Generate synthetic data
synthetic_data = synthesizer.sample(num_rows=5)

print("Synthetic Data:")
print(synthetic_data)
