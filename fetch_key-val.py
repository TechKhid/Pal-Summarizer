import json


class topicDecoder(json.JSONDecoder):
    def default(self, o):
        return o.__dict__

with open("topics.json", "r") as f:
    topics = json.load(f, cls=topicDecoder)

print(topics.keys())
print(topics.get("_topics")[len(topics.get("_topics"))-1].get("_parent_refs")[0]["_text"])
