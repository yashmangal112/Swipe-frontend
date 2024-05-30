import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

import Row from 'react-bootstrap/Row';

import { updateEditState } from '../redux/productsSlice';
import { useProductListData } from '../redux/hooks'
import GoBackButton from '../ui/GoBackButton';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const dispatch = useDispatch()
  const { productList, isProductListEmpty } = useProductListData();

  // If we leave Products page while editing a product, this cleanup function
  // will make sure to reset the Editing state
  useEffect(()=>{
    return () => dispatch(updateEditState({ value: null }))
  }, [dispatch])

  if(isProductListEmpty){
    return (
      <div> No products added yet. </div>
    )
  } else {
    return (
      <div className='align-items-start p-4'>
        <GoBackButton />
        <h1>Products</h1>
        <Row xs={1} sm={2} md={3} lg={4}>
          {productList.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))}
        </Row>
      </div>
    )
  }
}

export default Products
