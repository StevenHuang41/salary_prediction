from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import os
import shutil
import numpy as np

from my_package.data_extract_func import get_uniq_job_title
from my_package.data_predict import predict_salary
from my_package.data_visualization import salary_hist_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.1.16:3000", # mac
        "http://192.168.1.23:3000", # mobile
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class RowData(BaseModel):
    age: int
    gender: str
    education_level: str
    job_title: str
    years_of_experience: float

class SalaryInput(BaseModel):
    salary: float



## dataFrame needs cleansing
df = pd.read_csv("Salary_Data.csv")
df.dropna(inplace=True)

## file path
current_dir_path = os.getcwd()
best_performance_dir = os.path.join(current_dir_path,
                                    'best_performance')

@app.get('/api/get_uniq_job_title')
async def get_data():
    result = get_uniq_job_title(df)
    result.sort()

    return {'value': result}


@app.post("/api/predict")
async def get_predict_salary(data: RowData):
    # result = predict_salary(data.dict())
    result = predict_salary(data.model_dump())
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


@app.delete("/api/retrain_model")
async def del_best_performance_dir():
    if os.path.isdir(best_performance_dir):
        shutil.rmtree('best_performance')
        return {'status': 'success',
                'message': 'best_performance dir has been deleted.'}

    return {'status': 'not found',
            'message': 'file not found.'}


@app.post("/api/salary_avxline_plot")
async def get_salary_hist_plot(data: SalaryInput):
    image_byte = salary_hist_image(data.salary)

    return Response(content=image_byte, media_type="image/png")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


## TODO: learn how to use pydantic and typing and use in my_package
## TODO: setup splite database