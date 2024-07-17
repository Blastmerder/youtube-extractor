import re
from pytube import YouTube
from pytube import Search
from similarity import similarity
from searchResult import SearchResult


def search_video(search_name, doesnt_use: list = None, attempts=0):
    # try search song, if can't 10 return None
    if attempts == 10:
        return None
    try:
        s = Search(search_name)
        have_author = False
        founded_video = []

        for v in s.results:
            # have most usage
            url = v.watch_url
            video = YouTube(url)
            title_video = video.title.lower().replace(",", "")

            # long var
            name_authors_list = video.author.lower().replace('& ', '').replace(',', '').split(' ')
            video_name_format = search_name.lower().replace('& ', '').replace(',', '').split('-') if '-' in search_name else search_name.lower().replace('& ', '').replace(',', '').split('-') if '"' in search_name else search_name.lower().replace('& ', '').replace(',', '').replace('"', '')
            song_name = video_name_format[1] if len(video_name_format) == 2 else video_name_format


            for name_author in name_authors_list:
                if name_author in video_name_format[0] and video.length > 60:
                    # if we found video, but it's not author
                    if not have_author:
                        founded_video = []
                    have_author = True

                    # formate name video ( author / name song )
                    pattern = re.finditer(r"(.+)\s*-\s*(.+)", fr'{title_video}', re.MULTILINE)
                    name = [match.groups() for matchNum, match in enumerate(pattern, start=1)]
                    name = name[0] if name else name

                    name_video_alt = None
                    if '"' in title_video:
                        name_video_alt = title_video.split('"')[1]


                    # get max similarity with search name and title video ( video been named with name author or not)
                    similarity1 = similarity(title_video, song_name)

                    if len(name) == 2:
                        similarity2 = similarity(name[1], song_name)
                    else:
                        similarity2 = 0
                    if name_video_alt:
                        similarity3 = similarity(name_video_alt, song_name)
                    else:
                        similarity3 = 0
                    if len(name) == 2:
                        similarity4 = similarity(name[0], song_name)
                    else:
                        similarity4 = 0

                    result = SearchResult(
                        url=url,
                        title=title_video,
                        similarity=max(similarity1, similarity2, similarity3, similarity4),
                        length=video.length,
                        preview=video.thumbnail_url,
                        author=video.author
                    )

                    founded_video.append(result)
            else:
                # if author doesn't exist
                if video.length > 60 and not have_author:
                    result = SearchResult(
                        url=url,
                        title=title_video,
                        similarity=similarity(title_video.replace('"', ''), song_name),
                        length=video.length,
                        preview=video.thumbnail_url,
                        author=video.author
                    )

                    founded_video.append(result)

        founded_video.sort(key=lambda x: x.own_similarity)

        return founded_video
    except:
        # Try again
        attempts += 1
        search_video(search_name, attempts=attempts)
