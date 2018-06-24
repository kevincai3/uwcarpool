import csv

weighting = {}

with open('./clean_tokens/weights.csv') as datafile:
    reader = csv.reader(datafile)
    for row in reader:
        weighting[row[0]] = int(row[1])
