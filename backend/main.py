from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd

from my_package.data_extract_func import get_uniq_job_title
from my_package.data_predict import predict_salary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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



## dataFrame needs cleansing
df = pd.read_csv("Salary_Data.csv")
df.dropna(inplace=True)

@app.get('/api/get_uniq_job_title')
async def get_data():
    result = get_uniq_job_title(df)
    result.sort()

    return {'value': result}

@app.post("/api/predict")
async def get_predict_salary(data: RowData):
    return predict_salary(data.model_dump())


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


## TODO: learn how to use pydantic and typing
## TODO: setup splite database