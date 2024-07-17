from pydantic import BaseModel


class SearchResult:
    def __init__(self, url: str, similarity: float, title: str, length: int, preview, author: str):
        self.URL = url
        self.own_similarity = similarity
        self.title = title
        self.length = length
        self.preview = preview
        self.author = author
