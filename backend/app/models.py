from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    q_date = Column(String)
    supplier = Column(String)
    products = relationship("ProductItem", back_populates="quotation")

class ProductItem(Base):
    __tablename__ = "product_items"

    id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(Integer, ForeignKey("quotations.id"))
    product_name = Column(String)
    rate = Column(Float)
    discount = Column(Float)
    packing = Column(Float)
    gst = Column(Float)
    purchase_rate = Column(Float)
    piece_weight = Column(Float)
    profit_percent = Column(Float)

    quotation = relationship("Quotation", back_populates="products")
