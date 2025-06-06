import pandas as pd
import sqlite3

conn = sqlite3.connect('salary_prediction.db')

c = conn.cursor()

## create table in db
c.execute("""
CREATE TABLE IF NOT EXISTS salary (
    age INTEGER,
    gender TEXT,
    education_level TEXT,
    job_title TEXT,
    years_of_experience REAL
);
""")

conn.commit()
conn.close()