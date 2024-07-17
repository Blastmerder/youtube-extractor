from pytube import YouTube
from converting import convert_video_to_audio
from os import listdir
from os.path import isfile, join


def download_from_url_file(URLFile, folder='songs'):

    URLs = open(f'{URLFile}.txt', "r")

    print(f'start download.')

    count_urls = 0

    while True:
        url = URLs.readline()
        if url == '':
            print('end')
            break
        else:

            video = YouTube(url)
            stream_audio = video.streams.get_highest_resolution()
            print('\n--------------------------------------------------------------------\n')
            # stream_video = video.streams.filter(adaptive=True).filter(mime_type='video/mp4').first()

            print(f'download start for {stream_audio.default_filename}, wait...')

            stream_audio.download(output_path='songs', filename=f'{video.author} --- {stream_audio.default_filename}')
            print(f'\nThe {stream_audio.default_filename.replace(".mp4", "")} is downloaded!')

            count_urls += 1

    URLs.close()
    # URL = str(input("URL>>> "))

    print(f'downloaded {count_urls} songs')

    video_files = [f for f in listdir(folder) if isfile(join(folder, f))]

    print(f'\n\nStart converting songs.')

    for video_file in video_files:
        print('\n---------------------------------------------------------------------\n')
        print(f'Start convert for {video_file}.')
        convert_video_to_audio(video_file.replace('.mp4', ''), folder_video=folder, result_folder='songs_result')

    print('converting is done.')