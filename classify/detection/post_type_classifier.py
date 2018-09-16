import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier

from db import engine

def fetch_data():
    query = "SELECT post.post_id, derived.stage_3, manual.post_type FROM posts as post JOIN derived_posts AS derived ON derived.post_id = post.post_id JOIN manual_posts AS manual ON manual.post_id = post.post_id WHERE derived.stage_3 IS NOT NULL AND manual.post_type IS NOT NULL"
    posts = pd.read_sql_query(query, engine)
    return posts

def train_model():
    data = fetch_data()
    vectorizer = CountVectorizer(analyzer = analyzer)
    X_count = vectorizer.fit_transform(data["stage_3"])
    X_count_feat = pd.DataFrame(X_count.toarray())
    Y = data["post_type"]

    rf = RandomForestClassifier(n_estimators = 60, max_depth = 10, n_jobs=-1)
    rf_model = rf.fit(X_count_feat,Y)
    return rf_model, vectorizer

def analyzer(text):
    return text.split(",")

def predict(model, vectorizer, processed_message):
    return model.predict(vectorizer.transform([processed_message]))[0]
