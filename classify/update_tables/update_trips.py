import pandas as pd
from db import engine, batch_update
from utils.helper import generateUpsertSQL, pandas_nat_to_none

INSERT_STATEMENT = 'INSERT INTO trips (group_id, post_type, date, time, from_loc, to_loc) VALUES %s'

def splitListToRows(row,row_accumulator,target_column,separator):
    #.strip to remove parenthesis
    split_row = row[target_column].split(separator)
    for s in split_row:
        new_row = row.to_dict()
        new_row[target_column] = s
        row_accumulator.append(new_row)

def splitDataFrameList(df,target_column,separator):
    new_rows = []
    df.apply(splitListToRows,axis=1,args = (new_rows,target_column,separator))
    new_df = pd.DataFrame(new_rows)
    return new_df

def update_trips(new_estimate_posts, new_groups):

    new_groups.index = new_groups["post_id"]
    new_estimate_posts.index = new_estimate_posts["post_id"]

    new_groups = new_groups.drop(["post_id"], axis = 1)

    new_trips = new_groups.join(new_estimate_posts, lsuffix="l").drop_duplicates("post_id")
    new_trips = new_trips[new_trips["post_type"] != "o"]
    new_trips = splitDataFrameList(splitDataFrameList(new_trips, "from_loc", ","), "to_loc", ",")

    values = [(group_id, post_type, pandas_nat_to_none(best_date), pandas_nat_to_none(best_time), from_loc, to_loc)
              for group_id, post_type, best_date, best_time, from_loc, to_loc
              in new_trips[['group_id', 'post_type', 'date', 'time', 'from_loc', 'to_loc']].values]

    batch_update(INSERT_STATEMENT, values, 1000, 10000)

    return new_trips
