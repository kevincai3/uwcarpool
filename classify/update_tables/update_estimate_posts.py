import pandas as pd
import datetime
from db import engine, batch_update

from detection.post_type_classifier import predict, train_model
from detection.date_detection import find_dates
from detection.route_detection import route_detection_2
from detection.time_detection import find_times
from utils.helper import format_all_time, format_all_date, generateUpsertSQL, pandas_nat_to_none
dos_model, dos_vectorizer = train_model()

UPDATE_STATEMENT = generateUpsertSQL('estimate_posts', 'post_id', ['post_id', 'post_type', 'best_date', 'all_date', 'best_time', 'all_time', 'from_loc', 'to_loc'])

def update_estimate_posts(new_derived_posts):
    locs = new_derived_posts.apply(
        lambda x: route_detection_2(x["stage_3"].split(',')), axis = 1)

    from_locs = [','.join(x[0]) for x in locs]
    to_locs = [','.join(x[1]) for x in locs]

    print('done routes')
    dates = new_derived_posts.apply(
        lambda x: find_dates(x["stage_3"].split(','), x["posttime"]), axis = 1)
    best_dates = [x[0] for x in dates]
    all_dates = [x[1] for x in dates]

    times = new_derived_posts.apply(
        lambda x: find_times(x["stage_3"].split(','), x["posttime"]), axis = 1)
    best_times = [x[0] for x in times]
    all_times = [x[1] for x in times]

    print('done time/date')
    posts_type = new_derived_posts.apply(
        lambda x: predict(dos_model, dos_vectorizer, x["stage_3"]), axis = 1)

    print('done post_type')
    new_estimate_posts = pd.DataFrame({
        "post_id":new_derived_posts["post_id"],
        "from_loc":from_locs,
        "to_loc":to_locs,
        "date":best_dates,
        "all_dates": all_dates,
        "time":best_times,
        "all_times":all_times,
        "post_type":posts_type,
        "posttime": new_derived_posts["posttime"]})
    new_estimate_posts.astype({
        "date": "object",
        "time": "object",
    })

    values = [(post_id, post_type, pandas_nat_to_none(best_date),
               format_all_date(all_dates), pandas_nat_to_none(best_time),
               format_all_time(all_times), from_locs, to_locs)
              for post_id, post_type, best_date, all_dates, best_time, all_times, from_locs, to_locs
              in new_estimate_posts[['post_id', 'post_type', 'date', 'all_dates', 'time', 'all_times', 'from_loc', 'to_loc']].values]

    batch_update(UPDATE_STATEMENT, values, 1000, 10000)

    new_estimate_posts["time"] = pd.to_datetime(new_estimate_posts["time"]).dt.time

    return new_estimate_posts
