from typing import List
from pydantic import BaseModel

class ProductItemBase(BaseModel):
    product_name: str
    rate: float
    discount: float
    packing: float
    gst: float
    purchase_rate: float
    piece_weight: float
    profit_percent: float

class ProductItemCreate(ProductItemBase):
    pass

class ProductItem(ProductItemBase):
    id: int
    class Config:
        orm_mode = True

class QuotationBase(BaseModel):
    q_date: str
    supplier: str

class QuotationCreate(QuotationBase):
    products: List[ProductItemCreate]

class Quotation(QuotationBase):
    id: int
    products: List[ProductItem]
    class Config:
        orm_mode = True
