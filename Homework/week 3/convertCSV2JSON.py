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
bestand = csv.DictReader(data, namen)

out = json.dumps([row for row in bestand])
jsonbestand.write(out)
