import pandas as pd

from update_tables.obtain_new_posts import obtain_new_posts
from update_tables.update_derived_posts import update_derived_posts
from update_tables.update_estimate_posts import update_estimate_posts
from update_tables.update_groups import update_groups
from update_tables.update_trips import update_trips

def update_tables():
    new_posts = obtain_new_posts()
    new_derived_posts = update_derived_posts(new_posts)
    new_estimate_posts = update_estimate_posts(new_derived_posts)
    new_posts, new_groups = update_groups(new_posts)
    new_trips = update_trips(new_estimate_posts, new_posts)
