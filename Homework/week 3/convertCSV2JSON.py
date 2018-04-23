# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json

csvbestand = open("data.csv", "r")
jsonbestand = open("data.json", "w")

namen = ("Provincies", "Gasten *1000")
bestand = csv.DictReader(csvbestand, namen)

for regel in bestand:
    json.dump(regel, jsonbestand, indent = 4)
    jsonbestand.write("\n")
