from db import engine
from utils.count_print import CountPrint

def migrate_posts():
    c = CountPrint(1000)
    conn = engine.connect()
    results = conn.execute("SELECT id, driving_or_searching, number_of_routes FROM posts where driving_or_searching IS NOT NULL OR number_of_routes IS NOT NULL ORDER BY id ASC")
    ins_conn = engine.connect()

    statement = "INSERT INTO manual_posts(post_id, post_type, route_count) VALUES (%s, %s, %s) ON CONFLICT (post_id) DO UPDATE SET post_type = EXCLUDED.post_type, route_count = EXCLUDED.route_count;"

    for row in results:
        c.print(".")
        postid, post_type, route_count = row
        ins_conn.execute(statement, (postid, post_type.lower(), route_count))
    conn.close()
    ins_conn.close()

if __name__ == "__main__":
    migrate_posts()
