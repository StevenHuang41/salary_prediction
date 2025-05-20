from sklearn.model_selection import train_test_split
import pandas as pd

def spliting_data(
    df: pd.DataFrame,
    *,
    test_size: float = 0.2,
    random_state: int | None = None,
    shuffle: bool = True,
) -> tuple[pd.DataFrame, ...]:

    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    return train_test_split(X, y,
                            test_size=test_size,
                            shuffle=shuffle,
                            random_state=random_state)


if __name__ == "__main__":
    from data_cleansing import data_cleaning

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = data_cleaning(df, has_target_columns=True)

    X_train, X_test, y_train, y_test = \
        spliting_data(df)