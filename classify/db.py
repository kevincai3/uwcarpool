from sqlalchemy import create_engine
from config import local_db

engine = create_engine(local_db)

def fetch_post(post_id=None):
    where_string = f"WHERE ID = {post_id}"
    query_string = f"SELECT * FROM posts {where_string if post_id != None else ''} ORDER BY id ASC"
    conn = engine.conenct()
    return conn.execute(query_string)

def fetch_token_post_with_date(post_id=None):
    where_string = f"WHERE p.ID = {post_id}"
    query_string = f"SELECT dp.post_id, dp.stage_3, p.posttime FROM derived_posts AS dp JOIN posts AS p ON p.id = dp.post_id {where_string if post_id != None else ''} ORDER BY dp.post_id ASC"
    conn = engine.connect()
    return conn.execute(query_string)
