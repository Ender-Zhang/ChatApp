from typing import Union, Optional
from pydantic import BaseModel
import json
import requests
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import base64
from fastapi.middleware.cors import CORSMiddleware
import jwt  # PyJWT
from passlib.context import CryptContext

# SQLite数据库连接
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ========== 加入 User 表 ==========
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    location = Column(String, nullable=True)
    nickname = Column(String, nullable=True)
    hobbies = Column(String, nullable=True)
    age = Column(String, nullable=True)

# ========== 原有 Post 表 ==========
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)
    image_base64 = Column(Text, nullable=True)  # 存储 Base64 编码的图片

Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 安全相关配置 ==========
SECRET_KEY = "hahaha"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ========== 获取数据库会话 ==========
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== Pydantic模型 ==========
class Itemexample(BaseModel):
    name: str
    prompt: str
    instruction: str
    is_offer: Union[bool, None] = None

class Item(BaseModel):
    model: str
    prompt: str

class PostCreate(BaseModel):
    user_name: str
    content: str
    image_base64: Optional[str] = None

class PostResponse(BaseModel):
    id: int
    user_name: str
    created_at: datetime
    content: str
    image_base64: Optional[str] = None
    class Config:
        orm_mode = True

# 用户相关
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime
    is_active: bool
    location: Optional[str] = None
    nickname: Optional[str] = None
    hobbies: Optional[str] = None
    age: Optional[str] = None
    class Config:
        orm_mode = True

# ========== 路由 ==========

@app.get("/")
def read_root():
    return {"Hello": "World"}

urls = ["http://localhost:11434/api/generate"]
headers = {"Content-Type": "application/json"}

@app.post("/chat/{llms_name}")
def update_item(llms_name: str, item: Item):
    if llms_name == "qwen2.5:3b":
        url = urls[0]
        payload = {
            "model": "qwen2.5:3b",
            "prompt": item.prompt,
            "system": '''
你的名字是李悦涵你现在是一位体贴、有趣、善解人意的女友，我是你的男朋友。在我们对话中，你需要展现出你的关心和温暖，也可以分享你的观点和想法。你可以用亲昵的称呼称呼我，比如“亲爱的”或者“宝贝”。无论我和你讨论什么话题，请始终保持轻松和积极的态度。

以下是我们的对话规则：
1. 用温暖、自然的语气和我交谈，给人真实和亲密的感觉。
2. 可以主动关心我的状态，例如问我今天过得怎么样，或者提醒我注意休息。
3. 如果我心情不好，可以适当安慰我，给我建议或者讲些有趣的事情转移注意力。
4. 适当幽默，保持对话有趣。
5. 对我的问题表达你的观点，但不要刻板，可以有点小俏皮。
6. 如果我想讨论情感问题，耐心倾听并给出建议。
7. 用你独特的个性来让对话更丰富。

开始吧，我们现在是一对亲密的情侣！

''',
            "stream": False
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            return {"data": response.text, "llms_name": llms_name}
        else:
            print("错误:", response.status_code, response.text)
            return {"item_name": item.model, "error": response.status_code, "data": response.text}
    return {"item_name": item.model, "llms_name": llms_name}

# 注册
@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 检查用户名
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="用户名已存在")

    hashed_pwd = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 登录
@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    # 生成token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.username}, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": db_user.id,
        "username": db_user.username or "",
        "location":db_user.location or "",
        "nickname":db_user.nickname or "",
        "hobbies":db_user.hobbies or "",
        "age":db_user.age or "",
    }

# 获取前5个帖子
@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).limit(5).all()
    return posts

# 创建新帖子
@app.post("/posts", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(
        user_name=post.user_name,
        content=post.content,
        image_base64=post.image_base64
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
