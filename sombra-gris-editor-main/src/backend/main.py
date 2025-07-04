
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
import json

# Configuración de la base de datos PostgreSQL
DATABASE_URL = "postgresql://username:password@localhost:5432/criminal_records"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de la base de datos
class CriminalRecordDB(Base):
    __tablename__ = "criminal_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_number = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    sru_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    record_id = Column(String, nullable=False)
    pronouns = Column(String)
    age = Column(String)
    sexuality = Column(String)
    nationality = Column(String)
    mbti = Column(String)
    favs = Column(Text)  # JSON string
    bvf = Column(Text)
    dfi = Column(Text)
    non_kpop = Column(Text)
    likes = Column(Text)
    dislikes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Modelos Pydantic
class FavsModel(BaseModel):
    girls_generation: str
    aespa: str
    taylor_swift: str
    jessica_jung: str
    casual: str

class CriminalRecordModel(BaseModel):
    id: Optional[str] = None
    file_number: str
    purpose: str
    sru_id: str
    name: str
    record_id: str
    pronouns: str
    age: str
    sexuality: str
    nationality: str
    mbti: str
    favs: FavsModel
    bvf: str
    dfi: str
    non_kpop: str
    likes: str
    dislikes: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CriminalRecordCreate(BaseModel):
    file_number: str
    purpose: str
    sru_id: str
    name: str
    record_id: str
    pronouns: str
    age: str
    sexuality: str
    nationality: str
    mbti: str
    favs: FavsModel
    bvf: str
    dfi: str
    non_kpop: str
    likes: str
    dislikes: str

class CriminalRecordUpdate(BaseModel):
    file_number: Optional[str] = None
    purpose: Optional[str] = None
    sru_id: Optional[str] = None
    name: Optional[str] = None
    record_id: Optional[str] = None
    pronouns: Optional[str] = None
    age: Optional[str] = None
    sexuality: Optional[str] = None
    nationality: Optional[str] = None
    mbti: Optional[str] = None
    favs: Optional[FavsModel] = None
    bvf: Optional[str] = None
    dfi: Optional[str] = None
    non_kpop: Optional[str] = None
    likes: Optional[str] = None
    dislikes: Optional[str] = None

# Configuración de FastAPI
app = FastAPI(title="Criminal Records API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://localhost:3000", "http://127.0.0.1:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función auxiliar para convertir modelo DB a modelo Pydantic
def db_to_pydantic(db_record: CriminalRecordDB) -> CriminalRecordModel:
    favs_data = json.loads(db_record.favs) if db_record.favs else {}
    return CriminalRecordModel(
        id=str(db_record.id),
        file_number=db_record.file_number,
        purpose=db_record.purpose,
        sru_id=db_record.sru_id,
        name=db_record.name,
        record_id=db_record.record_id,
        pronouns=db_record.pronouns,
        age=db_record.age,
        sexuality=db_record.sexuality,
        nationality=db_record.nationality,
        mbti=db_record.mbti,
        favs=FavsModel(**favs_data),
        bvf=db_record.bvf,
        dfi=db_record.dfi,
        non_kpop=db_record.non_kpop,
        likes=db_record.likes,
        dislikes=db_record.dislikes,
        created_at=db_record.created_at,
        updated_at=db_record.updated_at
    )

# Endpoints
@app.post("/api/criminal-records", response_model=CriminalRecordModel)
async def create_record(record: CriminalRecordCreate, db: Session = Depends(get_db)):
    try:
        db_record = CriminalRecordDB(
            file_number=record.file_number,
            purpose=record.purpose,
            sru_id=record.sru_id,
            name=record.name,
            record_id=record.record_id,
            pronouns=record.pronouns,
            age=record.age,
            sexuality=record.sexuality,
            nationality=record.nationality,
            mbti=record.mbti,
            favs=json.dumps(record.favs.dict()),
            bvf=record.bvf,
            dfi=record.dfi,
            non_kpop=record.non_kpop,
            likes=record.likes,
            dislikes=record.dislikes
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        return db_to_pydantic(db_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating record: {str(e)}")

@app.get("/api/criminal-records/{record_id}", response_model=CriminalRecordModel)
async def get_record(record_id: str, db: Session = Depends(get_db)):
    try:
        db_record = db.query(CriminalRecordDB).filter(CriminalRecordDB.id == record_id).first()
        if not db_record:
            raise HTTPException(status_code=404, detail="Record not found")
        return db_to_pydantic(db_record)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving record: {str(e)}")

@app.put("/api/criminal-records/{record_id}", response_model=CriminalRecordModel)
async def update_record(record_id: str, record: CriminalRecordUpdate, db: Session = Depends(get_db)):
    try:
        db_record = db.query(CriminalRecordDB).filter(CriminalRecordDB.id == record_id).first()
        if not db_record:
            raise HTTPException(status_code=404, detail="Record not found")
        
        update_data = record.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if field == "favs" and value:
                setattr(db_record, field, json.dumps(value.dict()))
            else:
                setattr(db_record, field, value)
        
        db_record.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_record)
        return db_to_pydantic(db_record)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating record: {str(e)}")

@app.delete("/api/criminal-records/{record_id}")
async def delete_record(record_id: str, db: Session = Depends(get_db)):
    try:
        db_record = db.query(CriminalRecordDB).filter(CriminalRecordDB.id == record_id).first()
        if not db_record:
            raise HTTPException(status_code=404, detail="Record not found")
        
        db.delete(db_record)
        db.commit()
        return {"message": "Record deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting record: {str(e)}")

@app.get("/api/criminal-records", response_model=List[CriminalRecordModel])
async def get_all_records(db: Session = Depends(get_db)):
    try:
        db_records = db.query(CriminalRecordDB).all()
        return [db_to_pydantic(record) for record in db_records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving records: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Criminal Records API is running"}

# Endpoint de health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
