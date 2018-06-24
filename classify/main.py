from db import engine
from clean_tokens.process import process, stage3
from utils.count_print import CountPrint

def main():
    c = CountPrint(1000)
    conn = engine.connect()
    results = conn.execute("SELECT * FROM posts ORDER BY id ASC")
    #results = conn.execute("SELECT * FROM derived_posts ORDER BY post_id ASC")
    ins_conn = engine.connect()

    #statement = "INSERT INTO derived_posts(post_id, stage_3) VALUES (%s, %s) ON CONFLICT (post_id) DO UPDATE SET stage_3 = EXCLUDED.stage_3;"
    statement = "INSERT INTO derived_posts(post_id, stage_1, stage_2, stage_3) VALUES (%s, %s, %s, %s) ON CONFLICT (post_id) DO UPDATE SET stage_3 = EXCLUDED.stage_3, stage_2 = EXCLUDED.stage_2, stage_1 = EXCLUDED.stage_1;"
    for row in results:
        c.print(".")
        stage_1 = process(row[3], False)
        stage_2 = process(row[3])
        stage_3 = stage3(stage_2)
        value = (row[0], ','.join(stage_1), ','.join(stage_2), ','.join(stage_3))
        ins_conn.execute(statement, value)
    conn.close()
    ins_conn.close()

if __name__ == "__main__":
    main()
