import pandas as pd
from db import engine
from clean_tokens.process import process, clean_message

def update_derived_posts(new_posts):
    new_posts_stage_1 = new_posts.apply(lambda x: process(x["message"], False, False), axis = 1)
    new_posts_stage_2 = new_posts.apply(lambda x: process(x["message"], True, False), axis = 1)
    new_posts_stage_3 = new_posts.apply(lambda x: process(x["message"]), axis = 1)
    new_posts_clean_message = new_posts.apply(lambda x: clean_message(x["message"], "**********"), axis = 1)
    new_derived_posts = pd.DataFrame({
        "post_id": new_posts["post_id"],
        "stage_1": new_posts_stage_1,
        "stage_2": new_posts_stage_2,
        "stage_3": new_posts_stage_3,
        "clean_message": new_posts_clean_message,
        "posttime": new_posts["posttime"]})
    new_derived_posts.drop(["posttime"], axis = 1).drop(["clean_message"], axis = 1).to_sql("derived_posts", engine, if_exists='append', chunksize= 10000, index = False)
    return new_derived_posts