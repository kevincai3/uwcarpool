import pandas as pd
import datetime
from db import engine

def obtain_new_posts(hourdelta = 1):
    posts = pd.read_sql_query('select id, message, posttime from posts', con=engine)
    posts["posttime"] = pd.to_datetime(posts["posttime"])
    current_datetime = datetime.datetime.now()
    last_hour_datetime = current_datetime - datetime.timedelta(hours = hourdelta)
    return posts[posts["posttime"] > last_hour_datetime]
