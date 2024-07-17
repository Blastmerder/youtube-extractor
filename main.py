import re
from pytube import YouTube
from download_video import download_video
from download_from_file import download_from_url_file
from search_video import search_video
from converting import convert_video_to_audio
from os import listdir
from os.path import isfile, join
import shutil


def download_from_collection_url(url, folder):
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

    print(names_sounds)

    # search all urls for downloading

    searchResults = []
    URLs = open('URLs.txt', 'w')

    for video in names_sounds:
        result_url = search_video(video)

        if result_url is not None:
            searchResults.append(result_url)
            print(f'\t{YouTube(result_url).author} --- {YouTube(result_url).title}')
            print(result_url)
            URLs.writelines(f'{result_url}\n')
        del result_url


    URLs.close()

    print(f"\nAll URL's {searchResults}")
    print(f'start downloading songs for {len(searchResults)} songs.')

    # download sounds

    for sound in searchResults:
        video = YouTube(sound)
        stream_audio = video.streams.get_highest_resolution()
        del video
        print('\n--------------------------------------------------------------------\n')

        print(f'download start for {stream_audio.default_filename}, wait...')

        download_video(sound, folder)
        print(f'\nThe {stream_audio.default_filename.replace(".mp4", "")} is downloaded!')

    print(f'The {len(searchResults)} video is downloaded.')

    video_files = [f for f in listdir(folder) if isfile(join(folder, f))]

    print(f'\n\nStart converting songs.')

    for video_file in video_files:
        if video_file != 'Lega':
            print('\n---------------------------------------------------------------------\n')
            print(f'Start convert for {video_file}.')
            convert_video_to_audio(video_file.replace('.mp4', ''), folder_video=folder, result_folder='songs_result')

    print('converting is done.')

    print('\n\ncreate a .zip file')

    shutil.make_archive(folder, 'zip', folder)


url_collection = ''

if open('URLs.txt', 'r') == '':
    download_from_collection_url(url_collection)
else:
    answer = str(input('continue downloading? (y/n)>>>'))
    if answer == 'y':
        download_from_url_file('URLs')
    else:
        download_from_collection_url(url_collection, 'songs')
