import pandas as pd
import os
import shutil
from sklearn.metrics import mean_absolute_error, mean_squared_error

from .data_cleansing import cleaning_data
from .data_spliting import spliting_data
from .data_preprocessing import preprocess_data
from .data_training import model_select, save_model

def predict_salary(data: dict,
                   poly_state: bool = False,
                   restart: bool = False,
                   n_iter: int = 2) -> dict:
    ## load csv 
    abs_path = os.getcwd()
    abs_path = abs_path.split('/my_package')[0]
    FILE_NAME = os.path.join(abs_path, "Salary_Data.csv")
    # print(FILE_NAME)
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = cleaning_data(df, has_target_columns=True)

    ## spliting
    X_train, X_test, y_train, y_test = spliting_data(df, random_state=23)

    ## processing
    X_train_, X_test_ = preprocess_data(X_train, y_train,
                                        X_test, use_polynomial=poly_state)

    current_path = os.getcwd()
    best_performance_dir = os.path.join(current_path,
                                        'best_performance')
    if restart:
        shutil.rmtree('best_performance')

    if not os.path.isdir(best_performance_dir):
        os.makedirs(best_performance_dir, mode=0o755, exist_ok=True)

    if len(os.listdir(best_performance_dir)) != 1:
        shutil.rmtree('best_performance')
        model, model_name = model_select(X_train_, y_train,
                                         X_test_, y_test,
                                         use_poly=poly_state,
                                         n_iter=n_iter)
        save_model(model, model_name)

    else :
        model_file = os.listdir(best_performance_dir)[0]
        model_path = os.path.join(best_performance_dir, model_file)
        model_name = model_file.split('.')[0]
        if 'NN' in model_name: # keras load
            from keras.models import load_model
            model = load_model(model_path)
        else : # sklearn model load
            import joblib
            model = joblib.load(model_path)

    if (poly_state is True and 'poly' not in model_name) or \
    (poly_state is False and 'poly' in model_name):
        shutil.rmtree('best_performance')
        model, model_name = model_select(X_train_, y_train,
                                         X_test_, y_test,
                                         use_poly=poly_state,
                                         n_iter=n_iter)
        save_model(model, model_name)


    ## transform data to df
    example_df = pd.DataFrame([data])

    ## cleanse df
    example_df = cleaning_data(example_df)

    ## preprocessing
    _, example_df_ = preprocess_data(X_train, y_train,
                                     example_df, use_polynomial=poly_state)

    ## evaluate
    y_pred = model.predict(X_test_)
    

    return {
        "model_name": model_name,
        "value": model.predict(example_df_)[0],
        "mae": mean_absolute_error(y_test, y_pred),
        "mse": mean_squared_error(y_test, y_pred),
        "num_train_dataset": X_train.shape[0],
        "num_test_dataset": X_test.shape[0]
    }

if __name__ == "__main__":

    print(predict_salary({
        "age": 20,
        "gender": "female",
        "education_level": "Bachelor",
        "job_title": "Data Engineer",
        "years_of_experience": 1,
    }, poly_state=True))

    # shutil.rmtree('best_performance')