import pandas as pd
import datetime

def posts_lastweek(posts):
    current_time = datetime.datetime.now()
    times = posts["posttime"]
    n = len(times)
    posts_recent = [False] * n
    i = 0
    while(times[i].to_pydatetime() > current_time - datetime.timedelta(days=7)):
        posts_recent[i] = True
        i += 1
    return posts[posts_recent]

def duplicate_detection(new_posts, old_posts):
    all_posts = new_posts.append(old_posts)[["id", "message"]]
    all_posts =  all_posts[all_posts.duplicated(subset = "message",  keep = False)]
    #to only consider posts in the past week
    #all_posts = posts_lastweek(all_posts)
    message_groups = all_posts.groupby("message")
    duplicated_ids = pd.DataFrame(message_groups["id"].agg(list))
    return duplicated_ids