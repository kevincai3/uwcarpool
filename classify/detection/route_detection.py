import pandas as pd
list_of_cities = pd.read_csv("frequent_cities.csv",  sep = ",",  encoding='latin-1')["name"]

#route detection general
#pivots off the words "to" and "from"
def route_detection_1(tockenized_message):
    list_of_start = []
    list_of_end = []
    if("to" in tockenized_message):        
        if("from" in tockenized_message):            
            if(tockenized_message.index("from") < tockenized_message.index("to")):
                #...from...to...                
                before_to = tockenized_message[:tockenized_message.index("to")]
                after_to = tockenized_message[tockenized_message.index("to"):]
                list_of_start = [x for x in before_to if x in list_of_cities.values]
                list_of_end = [x for x in after_to if x in list_of_cities.values]
            else:
                #...to...from...                
                before_from = tockenized_message[:tockenized_message.index("from")]
                after_from = tockenized_message[tockenized_message.index("from"):]
                list_of_start = [x for x in after_from if x in list_of_cities.values]
                list_of_end = [x for x in before_from if x in list_of_cities.values]
        else:
            #...to...
            #destinations are after to
            #starts are before to
            before_to = tockenized_message[:tockenized_message.index("to")]
            after_to = tockenized_message[tockenized_message.index("to"):]
            list_of_start = [x for x in before_to if x in list_of_cities.values]
            list_of_end = [x for x in after_to if x in list_of_cities.values]
            
    elif("from" in tockenized_message):        
        #...from...
        before_from = tockenized_message[:tockenized_message.index("from")]
        after_from = tockenized_message[tockenized_message.index("from"):]
        list_of_start = [x for x in after_from if x in list_of_cities.values]
        list_of_end = [x for x in before_from if x in list_of_cities.values]
            
    else:
        #...
        if(len(list(x for x in tockenized_message if x in list_of_cities.values))>1):
            #location1...locations (2 or more locations)          
            all_locations = [x for x in tockenized_message if x in list_of_cities.values]
            list_of_start = [all_locations[0]]
            list_of_end = [all_locations[1:]] 
                                   
            #...(0 or 1 locations)          
            #just leave it as empty           
            
    #if either start or destination is empty (but not both), and waterloo is not in the other,
    #we assume waterloo
    if((len(list_of_start) == 0) & (len(list_of_end) != 0) & ("waterloo" not in list_of_end)):
        list_of_start.append("waterloo")
        
    if((len(list_of_end) == 0) & (len(list_of_start) != 0) & ("waterloo" not in list_of_start)):
        list_of_end.append("waterloo")
        
    return list(set(list_of_start)), list(set(list_of_end))

#route detection Waterloo
#pivots off the words "waterloo", "to" and "from"
#if we have to choose whether waterloo is a start or destination and we have no other information,
#we choose start
def route_detection_2(tockenized_message):
    list_of_start = []
    list_of_end = [] 
    if("waterloo" in tockenized_message):           
        if("to" in tockenized_message):
            if("from" in tockenized_message):
                if(tockenized_message.index("from") < tockenized_message.index("to")):
                    #...from...to...
                    before_to = tockenized_message[:tockenized_message.index("to")] 
                    after_to = tockenized_message[tockenized_message.index("to"):] 
                    if(tockenized_message.index("waterloo") < tockenized_message.index("to")):
                        #...from...waterloo...to...
                        #...waterloo...from...to...
                        list_of_start = ["waterloo"]
                        list_of_end = [x for x in after_to if x in list_of_cities.values and x != "waterloo"]
                    else:
                        #...from...to...waterloo...
                        #....from...to...waterloo
                        list_of_start = [x for x in before_to if x in list_of_cities.values and x != "waterloo"]
                        list_of_end = ["waterloo"]
                else:
                    #...to...from...
                    before_from = tockenized_message[:tockenized_message.index("from")] 
                    after_from = tockenized_message[tockenized_message.index("from"):]  
                    if(tockenized_message.index("waterloo") < tockenized_message.index("from")):
                        #...to...waterloo...from...
                        #...waterloo...to...from...
                        list_of_start = [x for x in after_from if x in list_of_cities.values and x != "waterloo"]
                        list_of_end = ["waterloo"]
                    else:
                        #...to...from...waterloo...
                        list_of_start = ["waterloo"]
                        list_of_end = [x for x in before_from if x in list_of_cities.values and x != "waterloo"]
                                      
            else:
                #...to...            
                if(tockenized_message.index("waterloo") < tockenized_message.index("to")):
                    #...waterloo...to...
                    after_to = tockenized_message[tockenized_message.index("to"):]                
                    list_of_start = ["waterloo"]
                    list_of_end = [x for x in after_to if x in list_of_cities.values and x != "waterloo"]
                
                else:
                    #...to...waterloo...                
                    before_to = tockenized_message[:tockenized_message.index("to")]                
                    list_of_start = [x for x in before_to if x in list_of_cities.values and x != "waterloo"]
                    list_of_end = ["waterloo"]  
                  
        elif("from" in tockenized_message):
            #...from...
            if(tockenized_message.index("waterloo") < tockenized_message.index("from")):
                #...waterloo...from...                
                after_from = tockenized_message[tockenized_message.index("from"):]              
                list_of_start = [x for x in after_from if x in list_of_cities.values and x != "waterloo"]
                list_of_end = ["waterloo"]                              
            else:
                #...from...waterloo...
                before_from = tockenized_message[:tockenized_message.index("from")]               
                list_of_start = ["waterloo"]
                list_of_end = [x for x in before_from if x in list_of_cities.values and x != "waterloo"]
                       
        else:
            #...waterloo...
            before_waterloo = tockenized_message[:tockenized_message.index("waterloo")] 
            after_waterloo = tockenized_message[tockenized_message.index("waterloo"):] 
            list_of_start = [x for x in before_waterloo if x in list_of_cities.values and x != "waterloo"]
            list_of_end = [x for x in after_waterloo if x in list_of_cities.values and x != "waterloo"]
            if((len(list_of_start) + len(list_of_end)) == 0):
                #...waterloo...
                list_of_start = ["waterloo"]
            elif(len(list_of_start) == 0):
                #...waterloo...places..
                list_of_start = ["waterloo"]
            elif(len(list_of_end) == 0):
                #...places...waterloo...                
                list_of_end = ["waterloo"]
            else:
                #...places...waterloo...places...
                # we assume waterloo is a the start
                list_of_start.append("waterloo")
               
    else:
        return route_detection_1(tockenized_message)
    
    return list(set(list_of_start)), list(set(list_of_end))