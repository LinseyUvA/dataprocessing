# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json

csvbestand = open("data.csv", "r")
jsonbestand = open("data.json", "w")

data = {}
for lijn in csvbestand:
    data[lijn.split(";")[0]] = (lijn.split(";")[1])

namen = ("Provincies", "Gasten *1000")
bestand = csv.DictReader(csvbestand, namen)

for regel in bestand:
    json.dump(regel, jsonbestand)
    jsonbestand.write("\n")
