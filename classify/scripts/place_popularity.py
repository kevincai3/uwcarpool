import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))


from db import engine;
from clean_tokens.keywords import locations;

results = []

for location in locations:
    conn = engine.connect()
    query = f"SELECT COUNT(*) FROM derived_posts WHERE stage_3 ILIKE '%%{location}%%'"
    count = conn.execute(query).fetchall()[0][0];
    results.append([location, count])

results.sort(key=lambda i: i[1])
print(*results[::-1], sep=',\n')
