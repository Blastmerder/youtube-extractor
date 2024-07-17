from pytubefix import YouTube


def download_video(url, path):
    if True:
    # try:
        video = YouTube(url)
        stream_audio = video.streams.get_highest_resolution()
        stream_audio.download(output_path=path,
                              filename=f'{video.author} --- {stream_audio.default_filename}')
        return True
