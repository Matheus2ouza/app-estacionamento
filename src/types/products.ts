
export interface Product{
  id?: string
  productName: string
  unitPrice: number
  quantity: number
  expirationDate?: string
}

export interface Response {
  success: boolean
  message: string
  list?: Product[]
  error: string
}