import pandas as pd
from db import engine

def update_trips(new_estimate_posts, new_groups):
    
    def split_data_frame_list(df, 
                       target_column,
                      output_type=str):
        ''' 
        Accepts a column with multiple types and splits list variables to several rows.

        df: dataframe to split
        target_column: the column containing the values to split
        output_type: type of all outputs
        returns: a dataframe with each entry for the target column separated, with each element moved into a new row. 
        The values in the other columns are duplicated across the newly divided rows.
        '''
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
    
    new_groups.index = new_groups["post_id"]
    new_estimate_posts.index = new_estimate_posts["post_id"]
    
    new_groups = new_groups.drop(["message"], axis = 1).drop(["posttime"], axis = 1).drop(["post_id"], axis = 1).drop(["posttime"], axis = 1)
    
    new_trips = new_groups.join(new_estimate_posts, lsuffix="l")
    new_trips = split_data_frame_list(split_data_frame_list(new_trips, "from_loc"), "to_loc")
    old_trips_id_max = pd.read_sql_query('select trip_id from trips', con=engine)["trip_id"].max()
    
    new_trips["trip_id"] = pd.Series(range(old_trips_id_max.astype(int),old_trips_id_max.astype(int) + new_trips.shape[0]))
    
    new_trips.to_sql("trips_test", engine, if_exists='append', chunksize= 10000, index=False)
    
    return new_trips