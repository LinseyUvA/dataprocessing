# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json

csvbestand = open("data.csv", "r")
jsonbestand = open("data.json", "w")

Namen = ("Provincie", "Gasten *1000")
reader = csv.DictReader(csvbestand, Namen)
for row in reader:
    json.dump(row, jsonbestand)
    jsonbestand.write("\n")
