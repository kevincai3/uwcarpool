import pandas as pd
import datetime
from db import engine

from detection.post_type_classifier import *
from detection.date_detection import *
from detection.route_detection import *
from detection.time_detection import *
from utils.helper import format_all_time, format_all_date, format_time, format_datetuple
dos_model, dos_vectorizer  = train_model()

def update_estimate_posts(new_derived_posts):
      
    locs = new_derived_posts.apply(lambda x:
                                route_detection_2(x["stage_3"].split(',')), axis = 1)
    
    from_locs = [x[0] for x in locs] 
    to_locs = [x[1] for x in locs]
    
    dates = new_derived_posts.apply(lambda x:                                 
                                    format_datetuple(find_dates(x["stage_3"].split(','), x["posttime"])[0]), axis = 1)    
        
    times = new_derived_posts.apply(lambda x: 
                                format_time(find_times(x["stage_3"].split(','), x["posttime"])[0]), axis = 1)    

    posts_type = new_derived_posts.apply(lambda x:
                                        predict(dos_model, dos_vectorizer, x["stage_3"]), axis = 1)
    
    new_estimate_posts = pd.DataFrame({"post_id":new_derived_posts["post_id"], "from_loc":from_locs, "to_loc":to_locs, "date":dates, "time":times, "post_type":posts_type})
    
    new_estimate_posts["date"] = pd.to_datetime(new_estimate_posts["date"])
    
    new_estimate_posts["time"] = pd.to_datetime(new_estimate_posts["time"]).dt.time
    
    new_estimate_posts["posttime"] = new_derived_posts["posttime"]

    new_estimate_posts.drop(["posttime"], axis = 1).to_sql("estimate_posts_test", engine, if_exists='append', chunksize= 10000, index=False)
    
    return new_estimate_posts
