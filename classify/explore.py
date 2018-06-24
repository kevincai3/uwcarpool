from db import fetch_token_post_with_date
from detection.date_detection import find_dates
from detection.time_detection import find_times
from utils.helper import format_all_date, format_datetuple, format_all_time, format_time
from utils.debug import debug

def parse_date(post_id):
    results = fetch_token_post_with_date(post_id)
    rtn = []
    for row in results:
        tokens = row[1].split(',')
        best_date, all_date = find_dates(tokens, row[2])
        debug(best_date, all_date)
        formated_best_date = format_datetuple(best_date)
        formated_all_date = format_all_date(all_date)
        rtn += (formated_best_date, formated_all_date)
    return rtn

def parse_time(post_id):
    results = fetch_token_post_with_date(post_id)
    rtn = []
    for row in results:
        tokens = row[1].split(',')
        best_time, all_time = find_times(tokens, row[2])
        formated_best_time = format_time(best_time)
        formated_all_time = format_all_time(all_time)
        rtn += (formated_best_time, formated_all_time)
    return rtn
