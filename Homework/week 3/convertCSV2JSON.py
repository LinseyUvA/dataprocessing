# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json

with open("data.csv", "r") as csvbestand:
    data = {}
    for lijn in csvbestand:
        data[lijn.split(",")[0]] = (lijn.split(",")[1])

with open("data.json", "w") as json
    jsonbestand = json.dump(data, json, indent = 4)

# namen = ("Provincies", "Gasten *1000")
# bestand = csv.DictReader(csvbestand, namen)
#
# for regel in bestand:
#     json.dump(regel, jsonbestand)
#     jsonbestand.write("\n")
# print(jsonbestand)
