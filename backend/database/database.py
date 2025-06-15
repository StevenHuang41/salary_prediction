import os
import sqlite3
import pandas as pd

def init_database(db: str='salary_prediction.db'):
    # db_path = os.path.join(os.path.dirname(__file__), db)
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
        c.execute(f"""
            DROP TABLE IF EXISTS salary;
        """)

        c.execute(f"""
            CREATE TABLE salary ({schema});
        """)

        ## import dataset to db
        """
        4 age INTEGER, 
        6 gender TEXT,
        12 education_level TEXT,
        25 job_title TEXT,
        8 years_of_experience REAL,
        8 salary REAL
        64B * 1_000_000 = 64MB
        """
        # import sys
        # sys.path.append(os.getcwd().split('/database')[0])
        from my_package.data_cleansing import cleaning_data

        database_dir = db.split('salary_prediction.db')[0]
        FILE_NAME = os.path.join(database_dir, 'Salary_Data.csv')

        for chunk in pd.read_csv(FILE_NAME, chunksize=1_000_000):
            chunk = cleaning_data(chunk, has_target_columns=True)
            chunk.to_sql('salary', conn, if_exists='append', index=False)

        # sys.path = sys.path[:-1]

        conn.commit()


def create_index(
    col: str,
    idx_name: str,
    table: str='salary',
    db: str='salary_prediction.db',
):
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"""
            drop index if exists {idx_name};
        """)

        c.execute(f"""
            create index {idx_name} on {table}({col});
        """)

        conn.commit()

def create_view(
    view_name: str,
    query: str,
    db: str='salary_prediction.db',
):
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"""
            DROP VIEW IF EXISTS {view_name};
        """)
        c.execute(f"""
            create view {view_name} as
            {query}
        """)

        conn.commit()


def query_show_r(
    query: str,
    db: str='salary_prediction.db'
):
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"{query}")
        for row in c:
            print(row)

        conn.commit()


def query_2_df(query: str, db: str='salary_prediction.db') -> pd.DataFrame:
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        df = pd.read_sql_query(query, conn)

    return df

def insert_record(record: dict, table: str, db: str='salary_prediction.db'):
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute(f"PRAGMA table_info({table})")
        schema_info = c.fetchall()
        table_column = [col[1] for col in schema_info]

        # check record keys
        record_keys_set = set(record.keys())
        if record_keys_set != set(table_column):
            raise AssertionError("Record keys do not match table columns.")

        import sys
        sys.path.append(os.getcwd().split('/database')[0])
        from my_package.data_cleansing import cleaning_data

        record_df = pd.DataFrame([record])
        record_df = cleaning_data(record_df)
        record_df.to_sql('salary', conn, if_exists='append', index=False)

        conn.commit()
        
def delete_record(rowid, db: str='salary_prediction.db') -> None:
    # db_path = os.path.join(os.path.dirname(__file__), db)
    with sqlite3.connect(db) as conn:
        c = conn.cursor()

        c.execute("delete from salary where rowid = (?)", (str(rowid),))
        conn.commit()


if __name__ == "__main__":
    init_database()
    create_index(col='job_title', idx_name='idx_job_title')
    create_index(col='salary', idx_name='idx_salary')

    record = {
        'age': 19,
        'gender': 'male',
        'education_level': "master's degree",
        'job_title': 'Data Scientist',
        'years_of_experience': 1,
        'salary': 130000,
    }
    insert_record(record=record, table='salary')

    query = "select rowid, * from salary order by rowid desc limit 3;"
    print(query_2_df(query))
    delete_record(6696)
    print(query_2_df(query))