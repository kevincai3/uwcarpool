import re
from utils.debug import debug
from datetime import datetime, timedelta
from pytz import timezone

def get_time_zone():
    return timezone("America/Toronto")

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
    if time == None:
        return None
    else:
        hour = time[0]
        suffix = "AM"
        if hour >= 12:
            if hour > 12:
                hour -= 12
            suffix = "PM"
            return f"{pad(hour)}:{pad(time[1])}{suffix}"

def format_datetuple(date):
    if date == None:
        return None
    else:
        year, month, day = date
        return f"{year}-{pad(month)}-{pad(day)}"

def combine_locations(parsed, locations):
    joined_locations = [" ".join(tokens) for tokens in locations]
    return f"{parsed} ({','.join(locations)})"


def format_all_date(all_date):
    return ", ".join([combine_locations(format_datetuple(date), locations) for date, locations in all_date])

def format_all_time(all_time):
    return ", ".join([combine_locations(format_time(time), locations) for time, locations in all_time])

# The primary key should be in var_names as well
def generateUpsertSQL(table_name, primary_key, var_names):
    var_string = ",".join(var_names)
    excluded = ','.join([f"{name} = EXCLUDED.{name}" for name in var_names if name != primary_key])
    base = f"INSERT INTO {table_name}({var_string}) VALUES %s ON CONFLICT ({primary_key}) DO UPDATE SET {excluded};"
    return base

def datetuple_to_datetime(datetuple):
    year, month, date = datetuple
    return get_time_zone().localize(datetime(year, month, date))

def timetuple_to_datetime(timetuple, postdate):
    hour, minute = timetuple
    return postdate.astimezone(get_time_zone()).replace(hour=hour, minute=minute, second=0, microsecond=0)
