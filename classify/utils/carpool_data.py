import psycopg2 as pg
import pandas as pd
import pandas.io.sql as psql

from connection_info import connection

connection = pg.connect(connection)

posts = pd.read_sql_query('select id, message, driving_or_searching, number_of_routes from posts', con=connection)
derived_posts = pd.read_sql_query('select post_id, stage_3 from derived_posts', con=connection)

posts = posts.sort_values(by="id")
derived_posts = derived_posts.sort_values(by="post_id")

derived_posts = derived_posts.reset_index(drop = True)
posts = posts.reset_index(drop = True)
posts["tockenized_message"] =  derived_posts["stage_3"]
