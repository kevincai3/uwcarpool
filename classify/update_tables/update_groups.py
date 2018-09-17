import pandas as pd
import datetime
from db import engine
from utils.helper import split_data_frame_list

def group_posts(posts):  
    group_post_lists = pd.DataFrame(posts.groupby("message")["post_id"].agg(list))    
    group_post_lists = group_post_lists.reset_index()
    group_post_lists["group_id"] = group_post_lists.index + 1
    groups = split_data_frame_list(group_post_lists, "post_id",output_type=int)
    groups = groups.sort_values(by = "post_id")
    groups["posttime"] = posts.sort_values(by = "post_id")["posttime"]
    return groups

def update_groups(new_posts, new_posts_are_all_posts = False):
    
    if new_posts_are_all_posts:
        new_posts = group_posts(new_posts)
        new_groups = new_posts
    
    else:                
        old_groups = pd.read_sql_query('select * from groups', con=engine)
        old_groups = old_groups[old_groups["posttime"] > datetime.datetime.now() - datetime.timedelta(weeks = 1)]

        new_posts = new_posts.assign(group_id = "")
        old_max_group_id = old_groups["group_id"].max().astype(int)
        index = old_max_group_id + 1 
        n = new_posts.shape[0]

        for i in range(0,n):
            message = new_posts["message"].iloc[i]
            group_id_list = old_groups[old_groups["message"] == message]["group_id"].tolist()

            if(len(group_id_list) == 0):
                group_id = index
                new_posts.at[new_posts.index[i], "group_id"] = group_id 
                index += 1
            else:
                group_id = group_id_list[0]
                new_posts.at[new_posts.index[i], "group_id"] = group_id

            old_groups = pd.concat([old_groups,pd.DataFrame({"group_id":[group_id],"message":[message]})], sort = False)        
        
        
        new_groups = new_posts[new_posts["group_id"] > old_max_group_id].drop_duplicates(subset = "group_id")        

        new_posts.to_sql("groups", engine, if_exists='append', chunksize= 10000, index = False)

    return new_posts, new_groups
