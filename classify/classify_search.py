import datetime
from clean_tokens.process import process
from detection.post_type_classifier import train_model, predict
from detection.route_detection import route_detection_2
from detection.date_detection import find_dates
from detection.time_detection import find_times

model, vectorizer = train_model()

def classify_message(m):
    m = process(m)        
    current_datetime = datetime.datetime.now()    
    dos = predict(model, vectorizer,",".join(m))
    routes = route_detection_2(m)
    dates = find_dates(m, current_datetime)
    times = find_times(m, current_datetime)
    return dos, routes, dates, times