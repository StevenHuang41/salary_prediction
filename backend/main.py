from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd

from my_package.data_extract_func import get_uniq_job_title

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
async def read():
    return {}


df = pd.read_csv("Salary_Data.csv", nrows=10)


@app.get('/api/get_uniq_job_title')
async def get_data():
    # return {i: i for i in get_uniq_job_title(df)}
    return {'value': list(get_uniq_job_title(df))}
    # return get_uniq_job_title(df)



if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)