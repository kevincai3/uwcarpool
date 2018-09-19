import pandas as pd
from datetime import datetime, timedelta
from db import engine, batch_update
from utils.helper import split_data_frame_list, generateUpsertSQL

UPDATE_STATEMENT = generateUpsertSQL('groups', 'post_id', ['group_id', 'post_id'])

def get_max_group_id():
    result = engine.execute("select max(group_id) from groups").fetchall()[0]
    if result == None:
        result = 0
    return result

def old_groups_sql():
    threshhold = datetime.utcnow() - timedelta(weeks = 1)
    time_str = threshhold.strftime('%Y-%m-%d')
    query = f'SELECT g.group_id, g.post_id, p.message FROM groups AS g JOIN posts AS p ON p.post_id = g.post_id where g.posttime > {time_str}'
    return query

def group_posts(posts):
    group_post_lists = pd.DataFrame(posts.groupby("message")["post_id"].agg(list))
    group_post_lists = group_post_lists.reset_index()
    group_post_lists["group_id"] = group_post_lists.index + 1
    groups = split_data_frame_list(group_post_lists, "post_id",output_type=int)
    return groups

def update_groups(new_posts, all_posts = False):
    new_groups = None
    if all_posts:
        new_posts = group_posts(new_posts)
        new_groups = new_posts.drop_duplicates(subset = "group_id")
    else:
        old_groups = pd.read_sql_query(old_groups_sql(), con=engine)
        new_posts = new_posts.assign(group_id = "")
        max_group_id = get_max_group_id()
        index = max_group_id + 1
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


        new_groups = new_posts[new_posts["group_id"] > max_group_id].drop_duplicates(subset = "group_id")

    values = [(group_id.item(), post_id.item()) for group_id, post_id in new_posts[['group_id', 'post_id']].values]

    batch_update(UPDATE_STATEMENT, values, 1000, 10000)

    return new_posts, new_groups
