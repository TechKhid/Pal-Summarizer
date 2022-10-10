import symbl
import json

file_ = "test.mp3"

if file_.endswith(".mp3"):
    voice_object = symbl.Audio.process_file(file_path=file_)
elif file_.endswith(".mp4"):
    voice_object = symbl.Video.process_file(file_path=file_)

mess_ = voice_object.get_messages(parameters={'sentiment': True}) 
topic = voice_object.get_topics(parameters={'parentRefs': True})

class topicEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

class topicDencoder(json.JSONDecoder):
    def default(self, o):
        return o.__dict__


def Jsonize(obj, file_path):
    with open(file_path, 'w') as f:
        json.dump(obj, f, cls=topicEncoder, indent=4)

Jsonize(topic, "topics.json")
with open("topics.json", "r") as f:
    topics_ = json.load(f, cls=topicDencoder)

# print(topics_["_parent_refs"])s
print(topics_.get("_topics")[len(topics_.get("_topics"))-1].get("_parent_refs")[0]["_text"])
