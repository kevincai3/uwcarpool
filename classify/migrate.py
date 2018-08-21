from sqlalchemy import create_engine
from db import engine
from utils.count_print import CountPrint
from config import remote_db
remote = create_engine(remote_db)

fetch_query = 'SELECT id, time, "fbId", message, "createdAt", "updatedAt", timeseen, source, posttime from posts WHERE id > 188890 ORDER BY id ASC'
insert_query = 'INSERT INTO posts(id, time, "fbId", message, "createdAt", "updatedAt", timeseen, source, posttime) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING'

results = engine.connect().execute(fetch_query)
remote_conn = remote.connect()

c = CountPrint(1000)
for row in results:
    c.print(".")
    remote_conn.execute(insert_query, row.values())
