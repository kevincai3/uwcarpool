import pandas as pd
from db import engine

def obtain_new_posts():
    return obtain_posts(additional_sql=' AND (dp.stage_3 IS NULL OR ep.from_loc IS NULL)')

def obtain_posts(start = 0, end = None, additional_sql = ''):
    query = f'SELECT p.post_id, p.message, p.posttime, dp.stage_3, ep.post_type, ep.best_date as date, ep.best_time as time, ep.from_loc, ep.to_loc FROM posts AS p LEFT JOIN derived_posts AS dp ON dp.post_id = p.post_id LEFT JOIN estimate_posts AS ep ON ep.post_id = p.post_id WHERE p.post_id >= {start}'
    if end != None:
        query += f' AND p.post_id < {end}'
    query += additional_sql
    query += f' ORDER BY p.post_id ASC'

    return pd.read_sql_query(query, con=engine)
