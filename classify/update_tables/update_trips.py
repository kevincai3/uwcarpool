import pandas as pd
from db import engine

def update_trips(new_estimate_posts, new_groups):
    
    def splitDataFrameList(df,target_column,separator):       
        def splitListToRows(row,row_accumulator,target_column,separator):
            #.strip to remove parenthesis
            split_row = row[target_column].strip("{}").split(separator)
            for s in split_row:
                new_row = row.to_dict()
                new_row[target_column] = s
                row_accumulator.append(new_row)
        new_rows = []
        df.apply(splitListToRows,axis=1,args = (new_rows,target_column,separator))
        new_df = pd.DataFrame(new_rows)
        return new_df
    
    new_groups.index = new_groups["post_id"]
    new_estimate_posts.index = new_estimate_posts["post_id"]
    
    new_groups = new_groups.drop(["message"], axis = 1).drop(["posttime"], axis = 1).drop(["post_id"], axis = 1)
    
    new_trips = new_groups.join(new_estimate_posts, lsuffix="l").drop_duplicates("post_id")
    new_trips = splitDataFrameList(splitDataFrameList(new_trips, "from_loc", ","), "to_loc", ",")
    old_trips_id_max = pd.read_sql_query('select trip_id from trips', con=engine)["trip_id"].max()
    
    new_trips["trip_id"] = pd.Series(range(old_trips_id_max.astype(int),old_trips_id_max.astype(int) + new_trips.shape[0]))
    
    new_trips.to_sql("trips", engine, if_exists='append', chunksize= 10000, index=False)
    
    return new_trips