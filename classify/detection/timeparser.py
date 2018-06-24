import re
from datetime import datetime
from utils.helper import match

# Shared
SPECIAL = r'(noon|afternoon|morning|night|evening|midnight|tonight)'
HOUR = r'([01]?\d|20|21|22|23|one|two|three|four|five|six|seven|eight|nine|ten)'
COMPLETE = f'{HOUR}(?:am|pm)'
AMBIGIOUS = r'(10|15|20)'
MINUTE = r'([012345][05])(?:am|pm)?'
BOTH = f'{HOUR}:?{MINUTE}?'

# Private

word_to_int = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
}

def parse_hour(token):
    hour = None
    if token.isdigit():
        hour = int(token)
    else:
        hour = word_to_int[token]
    return (hour, 0)

def parse_minute(token):
    minute = re.search(MINUTE, token).group(1)
    return (None, int(minute))

def parse_special(token):
    time = None
    if token == 'noon':
        time = (12, 0)
    elif token == 'afternoon':
        time = (17, 0)
    elif token == 'morning':
        time = (7, 0)
    elif token == 'night' or token == 'evening' or token == 'tonight':
        time = (20, 0)
    elif token == 'midnight':
        time = (0, 0)
    else:
        time = (12, 0)
    return time

def parse_both(token):
    m = re.search(BOTH, token)
    hour_time = parse_hour(m.group(1))
    minute_time = parse_minute(m.group(2))
    return (hour_time[0], minute_time[1])

def parse_token(token, parse_as_hour=True):
    if match(SPECIAL, token):
        return parse_special(token), 0b11, 100
    elif match(COMPLETE, token):
        return parse_complete(token), 0b11, 95
    elif match(AMBIGIOUS, token):
        if parse_as_hour:
            return parse_hour(token), 0b110, 80
        else:
            return parse_minute(token), 0b101, 80
    elif match(HOUR, token):
        return parse_hour(token), 0b10, 80
    elif match(MINUTE, token):
        return parse_minute(token), 0b01, 80
    elif match(BOTH, token):
        return parse_both(token), 0b11, 90
    else:
        raise(f"Token doesn't match {token}")

def get_best_time(hour, hour_weight, minute, minute_weight, seen_pm):
    best_hour = hour
    best_minute = minute
    if hour_weight != 100:
        if hour < 12 and seen_pm:
            best_hour += 12
        elif hour < 7:
            best_hour += 12
    return best_hour, best_minute

def parse_complete(token):
    return parse_hour(re.search(COMPLETE, token).group(1))

def parse_time(tokens):
    tags = {}
    state = 0b00
    for i in range(len(tokens)):
        parse_as_hour = state & 0b10 == 0
        result = parse_token(tokens[i], parse_as_hour)
        state |= result[1]
        tags[i] = result
    # print(tags)
    return get_time(tags, seen_pm(tokens))

def seen_pm(tokens):
    return bool(re.search('pm', ' '.join(tokens)))

def get_time(tags, seen_pm):
    hour = None
    hour_weight = 0
    minute = 0 # NOTE: Optimistic
    minute_weight = 0

    for index, value in tags.items():
        time, flag, weight = value
        # print(time, flag, weight)
        if flag & 0b10 != 0:
            if weight > hour_weight:
                hour = time[0]
                hour_weight = weight
        if flag & 0b01 != 0:
            if weight > minute_weight:
                minute = time[1]
                minute_weight = weight

    if hour == None:
        return None
    else:
        best_hour, best_minute = get_best_time(hour, hour_weight, minute, minute_weight, seen_pm)
        return datetime.now().replace(hour=best_hour, minute=best_minute)

def parse(buffer, tokens):
    time_tokens = [tokens[i] for i in buffer]
    # print(time_tokens)
    return parse_time(time_tokens)
