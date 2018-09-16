from sqlalchemy import create_engine
from config import local_db
from psycopg2.extras import execute_values

engine = create_engine(local_db)

def fetch_post(post_id=None):
    where_string = f"WHERE post_id = {post_id}"
    query_string = f"SELECT * FROM posts {where_string if post_id != None else ''} ORDER BY id ASC"
    conn = engine.conenct()
    return conn.execute(query_string)

def fetch_token_post_with_date(post_id=None):
    where_string = f"WHERE p.post_id = {post_id}"
    query_string = f"SELECT dp.post_id, dp.stage_3, p.posttime FROM derived_posts AS dp JOIN posts AS p ON p.post_id = dp.post_id {where_string if post_id != None else ''} ORDER BY dp.post_id ASC"
    conn = engine.connect()
    return conn.execute(query_string)

def batch_update(sql, values, batch_size=100, input_size=None):
    connection = engine.raw_connection()
    if input_size == None:
        input_size = len(values)
    try:
        for i in range(0, len(values), input_size):
            cursor = connection.cursor()
            execute_values(cursor, sql, values[i:i+input_size], None, batch_size)
            cursor.close()
            connection.commit()
            print(".")
    except Exception as e:
        print(e)
    finally:
        connection.close()
