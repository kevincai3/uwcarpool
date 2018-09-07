import pandas as pd
from db import engine
from utils.helper import format_all_time, format_all_date, format_time, format_datetuple

from detection.post_type_classifier import *
from detection.date_detection import *
from detection.route_detection import *
from detection.time_detection import *
dos_model, dos_vectorizer  = train_model()

def classify_posts():
    posts = pd.read_sql_query('select id, message, posttime from posts', con=engine).set_index("id")
    derived_posts = pd.read_sql_query('select post_id, stage_3 from derived_posts', con=engine)
    derived_posts = derived_posts.rename(columns = {"post_id":"id"}).set_index("id")
    complete_posts = derived_posts.join(posts)
    complete_posts = complete_posts.sort_values(by="id")
    #dos_model, dos_vectorizer  = train_model()    
    locs = complete_posts.apply(lambda x:
                                route_detection_2(x["stage_3"].split(',')), axis = 1)
    
    from_locs = [x[0] for x in locs] 
    to_locs = [x[1] for x in locs]
    
    dates = complete_posts.apply(lambda x:                                 
                                    format_datetuple(find_dates(x["stage_3"].split(','), x["posttime"])[0]), axis = 1)
    
        
    times = complete_posts.apply(lambda x: 
                                format_time(find_times(x["stage_3"].split(','), x["posttime"])[0]), axis = 1)
    

    posts_type = complete_posts.apply(lambda x:
                                        predict(dos_model, dos_vectorizer, x["stage_3"]), axis = 1)
    
    df = pd.DataFrame({"from_loc":from_locs, "to_loc":to_locs, "date":dates, "time":times, "post_type":posts_type})
    
    df["date"] = pd.to_datetime(df["date"])
    
    df.to_sql("estimate_posts2", engine)
    
    return df