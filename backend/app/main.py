from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session 

from app import models, schemas, crud
from app.database import engine, SessionLocal
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/quotations", response_model=schemas.Quotation)
def create_quotation(quotation: schemas.QuotationCreate, db: Session = Depends(get_db)):
    return crud.create_quotation(db, quotation)

@app.get("/quotations", response_model=List[schemas.Quotation])
def read_quotations(db: Session = Depends(get_db)):
    return crud.get_quotations(db)
from fastapi import HTTPException

@app.delete("/quotations/{quotation_id}")
def delete_quotation(quotation_id: int, db: Session = Depends(get_db)):
    quotation = db.query(models.Quotation).filter(models.Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    db.delete(quotation)
    db.commit()
    return {"message": "Deleted successfully"}
