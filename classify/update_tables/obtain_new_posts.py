import pandas as pd
from db import engine

def obtain_new_posts():
    all_posts = pd.read_sql_query('select post_id, message, posttime from posts', con=engine)
    all_posts_id = pd.DataFrame({"post_id":all_posts["post_id"]})
    old_derived_posts_id = pd.read_sql_query('select post_id from derived_posts', con=engine)
    new_posts_id = pd.concat([all_posts_id, old_derived_posts_id]).drop_duplicates(keep = False)
    new_posts = all_posts.loc[all_posts["post_id"].isin(new_posts_id["post_id"])]
    return new_posts

def obtain_posts(start = 0, end = None):
    query = f'SELECT p.post_id, p.message, p.posttime, dp.stage_3 FROM posts AS p JOIN derived_posts AS dp ON dp.post_id = p.post_id JOIN estimate_posts AS ep ON ep.post_id = p.post_id WHERE p.post_id >= {start}'
    if end != None:
        query += f' AND p.post_id < {end}'

    return pd.read_sql_query(query, con=engine)
