import re
from utils.debug import debug
from datetime import datetime, timedelta
from pytz import timezone, utc
import pandas as pd

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
    return postdate.replace(hour=hour, minute=minute, second=0, microsecond=0)

def pandas_nat_to_none(value):
    if value is pd.NaT:
        return None
    else:
        return value
#source: https://gist.github.com/jlln/338b4b0b55bd6984f883
def split_data_frame_list(df, target_column, output_type=int):
    row_accumulator = []
    def split_list_to_rows(row):
        split_row = row[target_column]
        if isinstance(split_row, list):
          for s in split_row:
              new_row = row.to_dict()
              new_row[target_column] = output_type(s)
              row_accumulator.append(new_row)
        else:
          new_row = row.to_dict()
          new_row[target_column] = output_type(split_row)
          row_accumulator.append(new_row)
    df.apply(split_list_to_rows, axis=1)
    new_df = pd.DataFrame(row_accumulator)
    return new_df

def split_data_frame_string(df,target_column,separator):
    def split_list_to_rows(row,row_accumulator,target_column,separator):
        split_row = row[target_column].split(separator)
        for s in split_row:
            new_row = row.to_dict()
            new_row[target_column] = s
            row_accumulator.append(new_row)
    new_rows = []
    df.apply(split_list_to_rows,axis=1,args = (new_rows,target_column,separator))
    new_df = pd.DataFrame(new_rows)
    return new_df
