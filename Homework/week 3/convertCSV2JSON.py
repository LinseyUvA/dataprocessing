# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json

with open("data.csv", "r") as f:
    namen = ("Provincies", "Gasten *1000")
    bestand = csv.DictReader(f, namen)
    regels = list(reader)

with open("jsonbestand", "w") as f:
    json.dump(regels, f, indent = 4)
