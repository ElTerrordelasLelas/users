
# Ejemplo de modelo para FastAPI (Python)
# Este archivo es solo de referencia para crear tu backend

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

"""
Ejemplo de endpoints FastAPI:

from fastapi import FastAPI, HTTPException
from typing import List
import uuid
from datetime import datetime

app = FastAPI()

# Base de datos simulada
records_db = {}

@app.post("/api/criminal-records", response_model=CriminalRecordModel)
async def create_record(record: CriminalRecordCreate):
    record_id = str(uuid.uuid4())
    new_record = CriminalRecordModel(
        id=record_id,
        **record.dict(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    records_db[record_id] = new_record
    return new_record

@app.get("/api/criminal-records/{record_id}", response_model=CriminalRecordModel)
async def get_record(record_id: str):
    if record_id not in records_db:
        raise HTTPException(status_code=404, detail="Record not found")
    return records_db[record_id]

@app.put("/api/criminal-records/{record_id}", response_model=CriminalRecordModel)
async def update_record(record_id: str, record: CriminalRecordUpdate):
    if record_id not in records_db:
        raise HTTPException(status_code=404, detail="Record not found")
    
    stored_record = records_db[record_id]
    update_data = record.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(stored_record, field, value)
    
    stored_record.updated_at = datetime.now()
    records_db[record_id] = stored_record
    return stored_record

@app.delete("/api/criminal-records/{record_id}")
async def delete_record(record_id: str):
    if record_id not in records_db:
        raise HTTPException(status_code=404, detail="Record not found")
    del records_db[record_id]
    return {"message": "Record deleted successfully"}

@app.get("/api/criminal-records", response_model=List[CriminalRecordModel])
async def get_all_records():
    return list(records_db.values())
"""
