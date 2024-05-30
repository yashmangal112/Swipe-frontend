import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';

import toast from 'react-hot-toast';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { deleteProduct, updateEditState, updateProduct } from '../redux/productsSlice';
import { useProductListData } from '../redux/hooks';
import CheckButton from '../ui/CheckButton';
import DeleteButton from '../ui/DeleteButton';
import EditButton from '../ui/EditButton';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { id } = product
  const [onHoverIndex, setOnHoverIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const { productList, editItemId } = useProductListData()

  const handleCardHover = useCallback(() => {
    setOnHoverIndex(id);
  }, [id]);

  const handleCardLeave = useCallback(() => {
    setOnHoverIndex(null);
  }, []);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    dispatch(updateEditState({ value: id }))
    setEditedProduct(productList.find((product) => product.id === id))
  }, [dispatch, id, productList]);

  const handleDelete = useCallback(()=>{
    dispatch(deleteProduct({ id }))
    toast.success("Product deleted for all invoices")
  }, [dispatch, id])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.stopPropagation();
    dispatch(updateProduct({ updatedProduct: { id, ...editedProduct } }));
    dispatch(updateEditState({ value: null }));
    toast.success("Product updated for all invoices")
  }, [dispatch, editedProduct, id])

  // Used useMemo to memoize computation to optimize performance
  const showEditButton = useMemo(()=>{
    return !editItemId && onHoverIndex === id 
  }, [editItemId, onHoverIndex, id])

  const showCheckButton = useMemo(()=>{
    return  editItemId === id
  }, [editItemId, id])

  return (
    <Col key={id} className="mb-4">
      <Card 
        className='h-100'
        onMouseEnter={() => handleCardHover(id)}
        onMouseLeave={handleCardLeave}
      >
        {
          showCheckButton ? (
            <EditableProductCard editedProduct={editedProduct} handleChange={handleChange} />
          ) : (
            <NonEditableProductCard product={product} />
          )
        }
        { showEditButton ? (
            <>
              <EditButton handlerFunction={handleEdit} />
              <DeleteButton handlerFunction={handleDelete} />
            </>
        ) : (
          showCheckButton && <CheckButton handlerFunction={handleSubmit} />
        )}
      </Card>
    </Col>
  )
}

const EditableProductCard = ({ editedProduct, handleChange }) => {
  const { name, desc, price } = editedProduct
  return (
    <Form>
      <Card.Body>
        <div className='d-flex flex-column justify-content-between h-100'>
          <div>
            <Card.Title>
              <Form.Control name="name" value={name} onChange={handleChange} />
            </Card.Title>
            <Card.Text>
              <Form.Control name="desc" value={desc} onChange={handleChange} as="textarea" rows={2}/>
            </Card.Text>
          </div>
          <div></div>
          <Card.Text>
            <span className='d-flex align-items-center fw-bold mt-2 gap-2'>
              Price: $<Form.Control name="price" value={price} onChange={handleChange} className='w-50' />
            </span>
          </Card.Text>
        </div>
      </Card.Body>
    </Form>
  )
}

const NonEditableProductCard = ({ product }) => {
  const {name, desc, price} = product
  return (
    <Card.Body>
      <div className='d-flex flex-column justify-content-between h-100'>
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            {desc}
          </Card.Text>
        </div>
        <div></div>
        <Card.Text>
          <p className='fw-bold'>
            Price: ${price}
          </p>
        </Card.Text>
      </div>
    </Card.Body>
  )
}

export default ProductCard
