import pandas as pd
import datetime
from db import engine

def update_groups(new_posts):    
    old_groups = pd.read_sql_query('select * from groups', con=engine)
    week_old_groups = old_groups[old_groups["posttime"] > datetime.datetime.now() - datetime.timedelta(weeks = 1)]
    new_posts = new_posts.assign(group_id = "")
    
    index = week_old_groups["group_id"].max() + 1
    n = new_posts.shape[0]

    for i in range(0,n):
        message = new_posts["message"].iloc[i]
        group_id_list = week_old_groups[week_old_groups["message"] == message]["group_id"].tolist()

        if(len(group_id_list) == 0):
            group_id = index
            new_posts.at[new_posts.index[i], "group_id"] = group_id 
            index += 1
        else:
            group_id = group_id_list[0]
            new_posts.at[new_posts.index[i], "group_id"] = group_id

    week_old_groups = pd.concat([week_old_groups,pd.DataFrame({"group_id":[group_id],"message":[message]})], sort = False)
    
    new_posts["group_id"] = new_posts["group_id"].astype(int)
    
    new_posts.to_sql("groups_test", engine, if_exists='append', chunksize= 10000, index = False)
    
    return new_posts