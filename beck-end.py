import os
import re
from pytube import YouTube
from os import listdir
from os.path import isfile, join

from starlette.staticfiles import StaticFiles

from download_video import download_video
from search_video import search_video
from converting import convert_video_to_audio
import shutil

from fastapi import FastAPI
from starlette.responses import FileResponse
from pydantic import BaseModel
import uuid

from searchResult import SearchResult

app = FastAPI()
"""
templates = Jinja2Templates(directory="static")


@app.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
"""

class GetNames(BaseModel):
    Names: list[str]


class GetURLs(BaseModel):
    # URLs: list[str]
    URLs: list


class GetURL(BaseModel):
    URL: str


@app.post("/get_inf")
async def get_inf_video(url: GetURL):

    video = YouTube(url.URL)

    return SearchResult(
        url=url.URL,
        title=video.title,
        similarity=100,
        length=video.length,
        preview=video.thumbnail_url,
        author=video.author
    )


@app.post("/get_names_songs")
async def get_names_songs(url: GetURL):
    url = url.URL
    video = YouTube(url)
    description = ''
    for n in range(6):
        try:
            description = video.initial_data["engagementPanels"][n]["engagementPanelSectionListRenderer"]["content"][
                "structuredDescriptionContentRenderer"]["items"][1]["expandableVideoDescriptionBodyRenderer"][
                "attributedDescriptionBodyText"]["content"]
        except:
            continue

    # found in the description time codes

    time_codes = re.finditer(r"\d{2}:\d{2}\s*.\s*(.+)", fr'{description}', re.MULTILINE)

    names_sounds = []
    # add to the names sounds list all songs from time codes

    for matchNum, match in enumerate(time_codes, start=1):
        for groupNum in range(0, len(match.groups())):
            groupNum = groupNum + 1
            names_sounds.append(match.group(groupNum))

    return names_sounds if names_sounds else None


@app.post("/get_urls_songs")
async def read_urls_songs(names: GetNames):
    searchResults = []


    for video in names.Names:
        result_url = search_video(video) if video is not None else None
        if result_url is not None:
            searchResults.append(result_url)

        del result_url

    return searchResults if searchResults else None


@app.post("/download_urls_songs")
async def download_urls_songs(urls: GetURLs):
    uuid4 = uuid.uuid4()
    if not os.path.isdir(f'./users/'):
        os.mkdir(f'./users/')
    os.mkdir(f'./users/{uuid4}')
    os.mkdir(f'./users/{uuid4}/video')
    os.mkdir(f'./users/{uuid4}/tmp')
    os.mkdir(f'./users/{uuid4}/result')

    for sound in urls.URLs:
        download_video(sound, f'users/{uuid4}/video')

    if not os.path.isdir(f'./users/{uuid4}'):
        return None
    video_files = [f for f in listdir(f'./users/{uuid4}/video') if isfile(join(f'./users/{uuid4}/video', f))]

    for video_file in video_files:
        if 'mp4' in video_file:
            convert_video_to_audio(video_file.replace('.mp4', ''), folder_video=f'./users/{uuid4}/video',
                                   result_folder=f'./users/{uuid4}/result', folder_tmp=f'./users/{uuid4}/tmp')

    shutil.make_archive(f'users/{uuid4}/result', 'zip', f'users/{uuid4}/result')

    os.rmdir(f'users/{uuid4}/video')
    os.rmdir(f'users/{uuid4}/tmp')

    return uuid4


@app.get("/download_urls_songs/{UUID}")
async def converting_urls(UUID: str):
    response = FileResponse(path=f'users/{UUID}/result.zip', filename=f'users/{UUID}/result.zip')

    return response

app.mount("/", StaticFiles(directory="static", html=True), name="static")
