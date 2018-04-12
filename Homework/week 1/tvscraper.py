#!/usr/bin/env python
# Name: Linsey Schaap
# Student number: 11036109
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

from urllib.request import urlopen




def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    #grab the url and download it
    uClient = urlopen(TARGET_URL)
    tvseries_html = uClient.read()
    uClient.close()

    #find all tvseries with all information in it
    tvseries = dom.find_all("div", {"class":"lister-item-content"})
    tvserie = tvseries[0]

    #reserve storage for all information
    info = []
    for tvserie in tvseries:
        #give title
        title = tvserie.h3.a.text

        #give rating
        rating = tvserie.div.strong.text

        #give genres
        genres = tvserie.find_all("span", {"class":"genre"})[0].text.strip()

        #search for actors and put it in a list
        actors = tvserie.find_all("a", {"href":re.compile('name')})
        actorslist = []
        for actor in actors:
            actornames = actor.text
            actorslist.append(actornames)
        #give all actors
        tvserie_actors = []
        for i in actorslist:
            tvserie_actors = ",".join(actorslist)

        #give runtime if it is given
        try:
            runtime = tvserie.find_all("span", {"class":"runtime"})[0].text.strip('min')
        except:
            runtime = "-"

        #store all the information in info
        info.append([title, rating, genres, tvserie_actors, runtime])

    return info


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for object in tvseries:
        writer.writerow(object)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
