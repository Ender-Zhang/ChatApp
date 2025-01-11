from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import base64
from typing import Optional

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

# 初始化FastAPI应用
app = FastAPI()

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
