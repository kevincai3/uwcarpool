import re
from utils.debug import debug

def match(regex, token, complete=True):
    r = f'^({regex})$' if complete else f'({regex})'
    return bool(re.search(r, token))

def indiceToToken(indices, tokens, seperator=" "):
    return seperator.join([tokens[i] for i in indices])

def pad(num, size=2):
    if num < 10**(size - 1):
        return f"0{num}"
    else:
        return str(num)

def format_time(time):
    hour = time[0]
    suffix = "AM"
    if hour > 12:
        hour -= 12
        suffix = "PM"
    return f"{pad(hour)}:{pad(time[1])}{suffix}"

def format_datetuple(date):
    year, month, day = date
    return f"{year}-{pad(month)}-{pad(day)}"

def combine_locations(parsed, locations):
    joined_locations = [" ".join(tokens) for tokens in locations]
    return f"{parsed} ({','.join(locations)})"


def format_all_date(all_date):
    return ", ".join([combine_locations(format_datetuple(date), locations) for date, locations in all_date])

def format_all_time(all_time):
    return ", ".join([combine_locations(format_time(time), locations) for time, locations in all_time])
