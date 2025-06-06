import sqlite3
import pandas as pd

def init_database(db: str='salary_prediction.db'):
    tables_name = ['salary', 'train', 'test']
    schema = """
        age INTEGER,
        gender TEXT,
        education_level TEXT,
        job_title TEXT,
        years_of_experience REAL,
        salary REAL
    """
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        ## create tables in db
        for name in tables_name:
            c.execute(f"""
                DROP TABLE IF EXISTS {name};
            """)

            c.execute(f"""
                CREATE TABLE {name} ({schema});
            """)

        conn.commit()

def import_database(db: str, table: str, file_name: str):
    import os
    import sys
    sys.path.append(os.getcwd().split('/database')[0])
    from my_package.data_cleansing import cleaning_data

    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        ## import dataset to db
        """
        4 age INTEGER, 
        6 gender TEXT,
        12 education_level TEXT,
        25 job_title TEXT,
        8 years_of_experience REAL,
        8 salary REAL
        64B
        """

        for chunk in pd.read_csv(file_name, chunksize=1_000_000):
            chunk = cleaning_data(chunk, has_target_columns=True)
            chunk.to_sql(table, conn, if_exists='append', index=False)

        conn.commit()

    sys.path = sys.path[:-1]

def create_index(db: str, table: str, col: str, idx_name: str):
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"""
            create index {idx_name} on {table}({col});
        """)

        conn.commit()



def query_show_r(query: str, db: str='salary_prediction.db'):
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"{query}")
        for row in c:
            print(row)

        conn.commit()

if __name__ == "__main__":
    # query_show_r("select age, count(*) from salary group by age;")
    init_database()
    import_database(db='salary_prediction.db',
                    table='salary',
                    file_name='Salary_Data.csv',)
    create_index(db='salary_prediction.db',
                 table='salary',
                 col='job_title',
                 idx_name='idx_job_title')

    # query_show_r("")





