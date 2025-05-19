import pandas as pd
import numpy as np

def get_uniq_job_title(df: pd.DataFrame) -> list[str]:
    return df['Job Title'].unique().tolist()

if __name__ == "__main__":
    df = pd.read_csv("../Salary_Data.csv")
    pass