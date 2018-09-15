from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from dateutil import parser
from detection.detection import detect
from utils.debug import debug
from utils.helper import match, indiceToToken, get_time_zone, datetuple_to_datetime
from pytz import utc
import re

# Values
#  Days    : 5
#  Special : 10
#  Month   : 7
#  Number  : 1

# Absolutes
DAYS = r'monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|tues|wed|thur|thurs|fri|sat|sun'
SPECIAL = r'tonight|tomorrow|today|afternoon|asap'
# Months
MONTHS = r'january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec'
# Day
DAY_NUMBER = r'[123]?\d(st|nd|rd|th)?'
# MONTH
MONTH_NUMBER = r'[1]?\d'
# BOTH
BOTH_NUMBER = f'{MONTH_NUMBER}[-/]{DAY_NUMBER}'

TOLERANCE = 1

day_map = {
    'monday': 0,
    'mon': 0,
    'tuesday': 1,
    'tue': 1,
    'tues': 1,
    'wednesday': 2,
    'wed': 2,
    'thursday': 3,
    'thur': 3,
    'thurs': 3,
    'friday': 4,
    'fri': 4,
    'saturday': 5,
    'sat': 5,
    'sunday': 6,
    'sun': 6,
}

def get_date(time):
    return (time.date.month, time.date.day)

def delta(token):
    if token == 'tomorrow':
        return timedelta(days=1)
    else:
        return timedelta(days=0)

def next_date(day, postdate):
    if postdate.weekday() == day_map[day]:
        return postdate
    else:
        return postdate + timedelta(days=(day_map[day] - postdate.weekday()) % 7)

def tag_date(token, postdate):
    if match(SPECIAL, token):
        return 0b11, postdate + delta(token)
    elif match(DAYS, token):
        return 0b11, next_date(token, postdate)
    elif match(MONTHS, token):
        return 0b10, None
    elif match(MONTH_NUMBER, token):
        return 0b110, None
    elif match(DAY_NUMBER, token):
        return 0b01, None
    elif match(BOTH_NUMBER, token):
        return 0b11, None
    else:
        return 0b0, None

def parse_date(buffer, tokens, postdate, results):
    buffer_str = [tokens[i] for i in buffer]
    date = None
    if True:
        try:
            date = parser.parse(
                ' '.join(buffer_str),
                default=postdate,
                ignoretz=True,
                fuzzy=True,
            )
        except:
            pass
    if date != None:
        results.append((buffer, date))

def valid_state(state):
    return (state & 0b11) == 0b11

def find_dates(tokens, postdate):
    postdate = postdate.astimezone(get_time_zone())
    all_dates = detect(tokens, postdate, TOLERANCE, tag_date, valid_state, parse_date)
    return process_dates(all_dates, tokens, postdate)

def process_dates(results, tokens, postdate):
    debug(results)
    dates = remove_invalid(results, postdate)
    if len(dates) == 0:
        return None, []
    d = defaultdict(list)
    for indice, date in dates:
        d[(date.year, date.month, date.day)].append(indiceToToken(indice, tokens))
    counter = Counter({date: len(items) for date, items in d.items()})
    most_common = counter.most_common(1)[0][0]
    return datetuple_to_datetime(most_common), [(date, d[date]) for date, count in counter.most_common()]

def remove_invalid(results, postdate):
    min_date = postdate - timedelta(days=1)
    max_date = postdate + timedelta(days=7)
    r = [(indices, date) for indices, date in results if date > min_date and date < max_date]
    return r
