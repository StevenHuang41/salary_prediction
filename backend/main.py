from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import os
import shutil
import numpy as np
import sqlite3

from my_package.data_cleansing import cleaning_data
from my_package.data_extract_func import get_uniq_job_title
from my_package.data_predict import predict_salary
from my_package.data_visualization import (
    salary_hist_image, salary_box_image
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://172.20.10.2:3000",
        "http://192.168.1.3:3000",
        "http://192.168.1.16:3000", # mac
        "http://192.168.1.19:3000", # mobile
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RowData(BaseModel):
    age: int
    gender: str
    education_level: str
    job_title: str
    years_of_experience: float

class FullData(BaseModel):
    age: int
    gender: str
    education_level: str
    job_title: str
    years_of_experience: float
    salary: float

class SalaryInput(BaseModel):
    salary: float



## dataFrame needs cleansing
# df = pd.read_csv("database/Salary_Data.csv")
# df = cleaning_data(df, has_target_columns=True)
# print(df)

## sql
from database.database import (
    init_database, create_index, query_2_df, insert_record
)
root_dir_path = os.getcwd().split('/backend')[0]
backend_dir_path = os.path.join(root_dir_path, 'backend')
database_dir_path = os.path.join(backend_dir_path, 'database')
db_file_path = os.path.join(database_dir_path, 'salary_prediction.db')
init_database(db_file_path)
create_index('job_title', 'idx_job_title',
             db=db_file_path)
create_index('education_level', 'idx_education_level',
             db=db_file_path)
create_index('salary', 'idx_salary', db=db_file_path)    
# df = query_2_df("select * from salary", db_file_path)
# print(df)
    

## file path
current_dir_path = os.getcwd()
store_file_name = 'best_performance'
model_store_file = os.path.join(current_dir_path, store_file_name)

@app.get('/api/get_uniq_job_title')
async def get_job_title_data():
    df = query_2_df("select * from salary;", db_file_path)

    ## dataframe
    result = get_uniq_job_title(df)

    return {'value': result}


@app.post("/api/predict")
async def get_predict_salary(data: RowData):
    df = query_2_df("select * from salary;", db_file_path)

    data_df = pd.DataFrame([data.model_dump()])
    data_df = cleaning_data(data_df)
    result = predict_salary(data_df, df, model_store_file)
    """
    result:
        "model_name": model_name_trim,
        "use_polynomial": use_poly,
        "value": float(model.predict(example_df_)[0]),
        "num_train_dataset": X_train.shape[0],
        "num_test_dataset": X_test.shape[0],
        "params": model_params,
    """
    return result


@app.post("/api/retrain_model")
async def retrain(data: RowData):
    df = query_2_df("select * from salary;", db_file_path)

    data_df = pd.DataFrame([data.model_dump()])
    data_df = cleaning_data(data_df)
    # # data_dict = data_df.to_dict(orient="records")

    # if data_dict == []:
    #     return {'status': 'fail',
    #             'message': 'Input data does not add into database.'}

    # data_dict = data_dict[0]

    # ## insert data into database, and upate df
    # insert_record(data_dict, 'salary', db_file_path)
    # df = query_2_df("select * from salary;", db_file_path)

    ## restart the model
    result = predict_salary(
        data_df, df, model_store_file, restart=True
    )

    return {
        'status': 'success',
        'message': 'Retrain model successfully.',
        'result': result,
    }

@app.post("/api/reset_model")
async def reset():
    init_database(db_file_path)
    create_index('job_title', 'idx_job_title',
                db=db_file_path)
    create_index('education_level', 'idx_education_level',
                db=db_file_path)
    create_index('salary', 'idx_salary', db=db_file_path)    
    # df = query_2_df("select * from salary;", db_file_path)
    # data_df = pd.DataFrame([data.model_dump()])
    # data_df = cleaning_data(data_df)
    # predict by restart the model
    # result = predict_salary(data_df, df, model_store_file, True)

    return {
        'status': 'success',
        'message': 'Reset the database.',
    }

@app.post("/api/add_data")
async def add_record(data: FullData):
    data_df = pd.DataFrame([data.model_dump()])
    data_df = cleaning_data(data_df, has_target_columns=True)
    data_dict = data_df.to_dict(orient="records")

    if data_dict == []:
        return {'status': 'fail',
                'message': 'Input data does not add into database.'}

    data_dict = data_dict[0]
    ## insert data into database
    insert_record(data_dict, 'salary', db_file_path)
    print(data_dict)
    return {
        'status': 'success',
        'message': 'Input data stored in database.'
    }



@app.post("/api/salary_avxline_plot")
async def get_salary_hist_plot(data: SalaryInput):
    df = query_2_df("select * from salary;", db_file_path)

    image_byte = salary_hist_image(data.salary, df)

    return Response(content=image_byte, media_type="image/png")

@app.post("/api/salary_boxplot")
async def get_salary_boxplot(data: SalaryInput):
    df = query_2_df("select * from salary;", db_file_path)

    image_byte = salary_box_image(data.salary, df)

    return Response(content=image_byte, media_type="image/png")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


## TODO: learn how to use pydantic and typing and use in my_package
## TODO: setup splite database
