import datetime
from db import fetch_token_post_with_date
from clean_tokens.process import process
from detection.date_detection import find_dates
from detection.post_type_classifier import train_model, predict
from detection.route_detection import route_detection_2
from detection.time_detection import find_times
from utils.helper import format_all_date, format_datetuple, format_all_time, format_time
from utils.debug import debug

model, vectorizer = train_model()

def parse_date(post_id):
    results = fetch_token_post_with_date(post_id)
    row = results.fetchall()[0]
    tokens = row[1].split(',')
    best_date, all_date = find_dates(tokens, row[2])
    debug(best_date, all_date)
    formated_all_date = format_all_date(all_date)
    return best_date, formated_all_date

def parse_time(post_id):
    results = fetch_token_post_with_date(post_id)
    row = results.fetchall()[0]
    tokens = row[1].split(',')
    best_time, all_time = find_times(tokens, row[2])
    formated_all_time = format_all_time(all_time)
    return best_time, formated_all_time

def classify_message(m):
    m = process(m)
    current_datetime = datetime.datetime.now()
    posttype = predict(model, vectorizer,",".join(m))
    routes = route_detection_2(m)
    dates = find_dates(m, current_datetime)
    times = find_times(m, current_datetime)
    return posttype, routes, dates, times
