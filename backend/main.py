from typing import Union, Optional
from pydantic import BaseModel
import json
import requests
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import base64
from fastapi.middleware.cors import CORSMiddleware


# SQLite数据库连接
DATABASE_URL = "sqlite:///./test.db"

# 创建数据库引擎
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# 创建会话类
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

# 定义Post模型
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)
    image_base64 = Column(Text, nullable=True)  # 存储 Base64 编码的图片

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境建议改为指定域名列表
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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



# Pydantic模型用于请求验证和响应格式化
class PostCreate(BaseModel):
    user_name: str
    content: str
    image_base64: Optional[str] = None  # 接收 Base64 编码的图片

class PostResponse(BaseModel):
    id: int
    user_name: str
    created_at: datetime
    content: str
    image_base64: Optional[str] = None  # 返回 Base64 编码的图片

    class Config:
        orm_mode = True

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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



# 获取前5个帖子
@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).limit(5).all()  # 获取前5个帖子
    return posts

# 创建新帖子
@app.post("/posts", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(user_name=post.user_name, content=post.content, image_base64=post.image_base64)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post