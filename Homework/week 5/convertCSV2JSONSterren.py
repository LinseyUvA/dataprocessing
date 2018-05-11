# Name: Linsey Schaap
# Student number: 11036109
"""
This script convert a csv file into a JSON format.
"""

import csv
import json


csvbestand = open("sterren.csv", "r")
jsonbestand = open("sterren.json", "w")

namen = ("Jaar", "OvernachtingenGeenSter", "Overnachtingen1Ster", "Overnachtingen2Sterren", "Overnachtingen3Sterren", "Overnachtingen4Sterren", "Overnachtingen5Sterren")
bestand = csv.DictReader(csvbestand, namen)

# Parse the CSV into JSON
out = json.dumps( [ regel for regel in bestand ] )
# Save the JSON
jsonbestand.write('{"data": ' + out + '}')
