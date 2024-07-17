import moviepy.editor as mp
import music_tag
import os


def convert_video_to_audio(name, format_audio='mp3', format_video='mp4', folder_tmp='tmp', result_folder='', folder_video=''):
    if os.path.exists(f'{folder_video}/{name}.{format_video}'):
        clip = mp.VideoFileClip(f"{folder_video}/{name}.{format_video}")
        clip.audio.write_audiofile(f"{result_folder}/{name}.{format_audio}")

        clip.save_frame(f'{folder_tmp}/{name}.png', 60)


        f = music_tag.load_file(f"{result_folder}/{name}.mp3")

        f['title'] = name.split(' --- ')[1]
        f['artist'] = name.split(' --- ')[0]

        with open(f'{folder_tmp}/{name}.png', 'rb') as img_in:
            f['artwork'] = img_in.read()
        with open(f'{folder_tmp}/{name}.png', 'rb') as img_in:
            f.append_tag('artwork', img_in.read())

        f.save()
        clip.close()

        os.remove(f'{folder_tmp}/{name}.png')
        os.remove(f'{folder_video}/{name}.{format_video}')
