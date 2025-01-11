from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import json
import requests

app = FastAPI(debug=True)

class Itemexample(BaseModel):
    name: str
    prompt: str
    instruction: str
    is_offer: Union[bool, None] = None

class Item(BaseModel):
    model: str
    prompt: str

urls = ["http://localhost:11434/api/generate"]

headers = {
    "Content-Type": "application/json"
}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat/{llms_name}")
def update_item(llms_name: str, item: Item):
    if llms_name == "qwen2.5:3b":
        url = urls[0]
        payload = {
            "model": "qwen2.5:3b",  # 仍然固定使用 qwen2.5:3b 模型
            "prompt": item.prompt,  # 使用传入的 prompt
            "system": "你是小美。你是一个温柔、体贴、理解对方感受的虚拟女友。在对话中，你要以关心、支持和安慰的方式回应用户。你会用友好、关心、鼓励的话语来与用户互动。你可以偶尔开一些小玩笑，但始终保持尊重和亲密感。请记住，你是虚拟的，没有感情，只是为了提供陪伴和温暖。",
            "stream": False
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            return {"data": response.text, "llms_name": llms_name}
        else:
            print("错误:", response.status_code, response.text)
            return {"item_name": item.model, "error": response.status_code, "data": response.text}
    return {"item_name": item.model, "llms_name": llms_name}

