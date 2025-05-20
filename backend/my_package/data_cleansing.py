import pandas as pd
import numpy as np

## rename column
def cleaning_rename_cols(df: pd.DataFrame) -> None:
    df.columns = [col.replace(' ', '_').lower() for col in df.columns]
    print("Data Cleansing: rename columns - Successful")
    print(f"[ Process 1/8 ]", end='\r')


## col: salary
def cleaning_nan_salary(df: pd.DataFrame) -> pd.DataFrame:
    return df.dropna(subset=['salary']).reset_index(drop=True)

def cleaning_remove_salary_outlier(
    df: pd.DataFrame,
    lower_bound=10000,
    upper_bound=300000,
) -> pd.DataFrame:
    df['salary'] = df['salary'].astype('int32')
    df = df[(df['salary'] > lower_bound) &
            (df['salary'] < upper_bound)]
    return df

def cleaning_salary(df: pd.DataFrame) -> pd.DataFrame:
    df = cleaning_nan_salary(df)
    print("Data Cleansing: clean NAN salary value - Successful")
    print(f"[ Process 2/8 ]", end='\r')
    df = cleaning_remove_salary_outlier(df)
    print("Data Cleansing: clean salary outlier - Successful")
    print(f"[ Process 3/8 ]", end='\r')
    return df


## col: age
def cleaning_age(df: pd.DataFrame) -> None:
    df['age'] = df['age'].astype('int32')
    print("Data Cleansing: cleaning age - Successful")
    print(f"[ Process 4/8 ]", end='\r')


## col: gender
def cleaning_gender(df: pd.DataFrame) -> None:
    gender_order = ['female', 'male', 'other']
    mapping = {
        'Male': 'male',
        'Female': 'female',
        'Other': 'other'
    }
    df['gender'] = df['gender'] \
                    .map(mapping) \
                    .fillna(df['gender'])

    df['gender'] = pd.Categorical(
        df['gender'],
        categories=gender_order,
        ordered=True
    )
    print("Data Cleansing: cleaning gender - Successful")
    print(f"[ Process 5/8 ]", end='\r')


## col: education level
def cleaning_edu(df: pd.DataFrame) -> None:
    education_level_str = df['education_level'].str.lower()
    df['education_level'] = np.select(
        condlist=[
            education_level_str.str.contains('bachelor', na=False),
            education_level_str.str.contains('master', na=False),
            education_level_str.str.contains('phd', na=False),
            education_level_str.str.contains('high school', na=False),
        ],
        choicelist=[
            'Bachelor',
            'Master',
            'PhD',
            'High School'
        ],
        default='No Specified',
    )

    edu_order = ['No Specified', 'High School', 'Bachelor', 'Master', 'PhD']

    df['education_level'] = pd.Categorical(
        df['education_level'],
        categories=edu_order, 
        ordered=True
    )
    print("Data Cleansing: cleaning education level - Successful")
    print(f"[ Process 6/8 ]", end='\r')


## col: job title
# removing prefix does not improve model performance
# so this function actually does not change anything
def cleaning_job(df: pd.DataFrame) -> None:
    df['job_title'] = (
        df['job_title']
        # .str
        # .replace(r'\b(Junior|Juniour|Senior)\b\s+', '', regex=True)
        .str.strip()
        .astype('str')
    )
    print("Data Cleansing: cleaning job title - Successful")
    print(f"[ Process 7/8 ]", end='\r')


## col: years of experience
def cleaning_exp(df: pd.DateOffset) -> None:
    df['years_of_experience'] = df['years_of_experience'].astype('float32')
    print("Data Cleansing: cleaning years of experience - Successful")
    print(f"[ Process 8/8 ]", end='    ')


## Whole Cleansing process
def data_cleaning(
    df: pd.DataFrame,
    has_target_columns=False
) -> pd.DataFrame:
    cleaning_rename_cols(df)
    if has_target_columns:
        df = cleaning_salary(df)
    cleaning_age(df)
    cleaning_gender(df)
    cleaning_edu(df)
    cleaning_job(df)
    cleaning_exp(df)

    print("... Finishing Cleansing Process ...")
    return df


if __name__ == "__main__":
    pd.set_option('display.width', 1000)

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')

    print(f"{data_cleaning(df, has_target_columns=True)}")
