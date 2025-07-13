from sqlalchemy.orm import Session
from app import models, schemas

def create_quotation(db: Session, quotation: schemas.QuotationCreate):
    db_quotation = models.Quotation(q_date=quotation.q_date, supplier=quotation.supplier)
    db.add(db_quotation)
    db.commit()
    db.refresh(db_quotation)
    for item in quotation.products:
        db_item = models.ProductItem(**item.dict(), quotation_id=db_quotation.id)
        db.add(db_item)
    db.commit()
    return db_quotation

def get_quotations(db: Session):
    return db.query(models.Quotation).all()
