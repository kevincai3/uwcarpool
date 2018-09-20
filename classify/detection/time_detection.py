import re
from collections import Counter, defaultdict
from utils.helper import match, indiceToToken, timetuple_to_datetime, get_time_zone
from detection.detection import detect
from detection.timeparser import SPECIAL, HOUR, COMPLETE, AMBIGIOUS, MINUTE, BOTH, parse
from pytz import utc

EXCLUDE = r'(\$d+|d+\$)'

TOLERANCE = 0

def get_time(token, postdate):
    if token == 'noon':
        return postdate.replace(hour=12, minute=0)
    return None

def tag_time(token, postdate):
    if match(EXCLUDE, token):
        return 0b00, None
    elif match(SPECIAL, token):
        return 0b11, get_time(token, postdate)
    elif match(COMPLETE, token):
        return 0b11, None
    elif match(AMBIGIOUS, token):
        return 0b110, None
    elif match(HOUR, token):
        return 0b10, None
    elif match(MINUTE, token):
        return 0b01, None
    elif match(BOTH, token):
        return 0b11, None
    else:
        return 0b00, None

def valid_state(state):
    return (state & 0b11) == 0b11

def parse_time(buffer, tokens, postdate, results):
    if len(buffer) != 0:
        time = parse(buffer, tokens)
        if time != None:
            results.append((buffer, time))

def find_times(tokens, postdate):
    postdate = postdate.astimezone(get_time_zone())
    all_times = detect(tokens, postdate, TOLERANCE, tag_time, valid_state, parse_time, greedy=True)
    return process_times(all_times, tokens, postdate)

def process_times(times, tokens, postdate):
    if len(times) == 0:
        return None, []
    d = defaultdict(list)
    for indice, time in times:
        d[(time.hour, time.minute)].append(indiceToToken(indice, tokens))
    counter = Counter({time: len(items) for time, items in d.items()})
    most_common = counter.most_common(1)[0][0]
    return timetuple_to_datetime(most_common, postdate), [(time, d[time]) for time, count in counter.most_common()]
