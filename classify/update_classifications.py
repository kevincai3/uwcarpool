from db import engine
from utils.count_print import CountPrint
from detection.date_detection import find_dates
from detection.time_detection import find_times
from utils.helper import format_all_time, format_all_date, format_time, format_datetuple
from detection.post_type_classifier import train_model, predict

def format_dates(indices, tokens, date):
    text = ' '.join([tokens[i] for i in indices])
    #date = date.strftime(r"%b-%d")
    date = date.strftime(r"%-I:%M%p")
    return f"{date} ({text})"

def update_dates():
    conn = engine.connect()
    ins_conn = engine.connect()
    results = conn.execute("SELECT dp.post_id, dp.stage_3, p.posttime FROM derived_posts AS dp JOIN posts AS p ON p.id = dp.post_id ORDER BY dp.post_id ASC")
    c = CountPrint(1000)
    ins_statement = "INSERT INTO estimate_posts(post_id, best_date, all_date) VALUES (%s, %s, %s) ON CONFLICT (post_id) DO UPDATE SET best_date = EXCLUDED.best_date, all_date = EXCLUDED.all_date"
    for row in results:
        c.print('.')
        tokens = row[1].split(',')
        best_date, all_date = find_dates(tokens, row[2])
        formated_best_date = format_datetuple(best_date) if best_date != None else ""
        formated_all_date = format_all_date(all_date)
        ins_conn.execute(ins_statement, (row[0], formated_best_date, formated_all_date))

def update_times():
    conn = engine.connect()
    ins_conn = engine.connect()
    results = conn.execute("SELECT dp.post_id, dp.stage_3, p.posttime FROM derived_posts AS dp JOIN posts AS p ON p.id = dp.post_id ORDER BY dp.post_id ASC")
    c = CountPrint(1000)
    ins_statement = "INSERT INTO estimate_posts(post_id, best_time, all_time) VALUES (%s, %s, %s) ON CONFLICT (post_id) DO UPDATE SET best_time = EXCLUDED.best_time, all_time = EXCLUDED.all_time"
    for row in results:
        c.print('.')
        tokens = row[1].split(',')
        best_time, all_time = find_times(tokens, row[2])
        formated_best_time = format_time(best_time) if best_time != None else ""
        formated_all_time = format_all_time(all_time)
        ins_conn.execute(ins_statement, (row[0], formated_best_time, formated_all_time))

def update_type():
    model, vectorizer = train_model()
    conn = engine.connect()
    ins_conn = engine.connect()
    results = conn.execute("SELECT dp.post_id, dp.stage_3 FROM derived_posts AS dp JOIN posts AS p ON p.id = dp.post_id WHERE dp.post_id > 182373 ORDER BY dp.post_id ASC")
    c = CountPrint(1000)
    ins_statement = "INSERT INTO estimate_posts(post_id, post_type) VALUES (%s, %s) ON CONFLICT (post_id) DO UPDATE SET post_type = EXCLUDED.post_type"
    for row in results:
        c.print('.')
        ins_conn.execute(ins_statement, (row[0], predict(model, vectorizer, row[1])))


if __name__ == "__main__":
    #update_times()
    #update_dates()
    update_type()
