import pandas as pd
from db import engine
from detection.route_detection import route_detection_0

def split_by_trips(derived_post):
    
    list_of_trips = []    
    n = len(derived_post)
    j = 0 
    for i in range(1,n):                
        routes = route_detection_0(derived_post[j:i])
        if (len(routes[0]) != 0) & (len(routes[1]) != 0):
            list_of_trips.append(derived_post[j:i])            
            j = i 
    return list_of_trips

def split_by_trips_index(derived_post):
    
    list_of_trips_index = []    
    n = len(derived_post)
    j = 0 
    for i in range(1,n):                
        routes = route_detection_0(derived_post[j:i])
        if (len(routes[0]) != 0) & (len(routes[1]) != 0):
            start = j
            end = i
            list_of_trips_index.append([start, end])            
            j = i 
    return list_of_trips_index