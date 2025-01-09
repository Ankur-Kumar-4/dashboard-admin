'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ProductForm } from '@/components/Product-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ApiService from '@/lib/ApiServiceFunction'
import ApiEndPoints from '@/lib/ApiServiceEndpoint'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [permissions, setPermissions] = useState("");

  const getPermission = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.get(`${ApiEndPoints?.getpermission}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = response.data;
      setPermissions(data.role);
      console.log(data.role);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      setIsLoading(true)
      const response = await ApiService.get(`${ApiEndPoints?.getproducts}`);
      const data = await response.data;
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };
       

  const addProduct = async (product) => {
    try {
      const response = await ApiService.post(`${ApiEndPoints?.addproduct}`, product);
      const data = await response.data;
      console.log(data);
      getProducts();
    } catch (error) {
      console.log(error);
    }finally {
      setIsFormOpen(false);
    }
    // console.log(product)
    // const newProduct = { ...product, id: Date.now() }
    // setProducts([...products, newProduct])
    // setIsFormOpen(false)
  }

  const updateProduct = async(updatedProduct) => {
    try {
      const response = await ApiService.put(`${ApiEndPoints?.updateproduct}/${updatedProduct.id}`, updatedProduct);
      const data = await response.data;
      console.log(data);

    } catch (error) {
      console.log(error);
    }finally {
      setIsFormOpen(false);
    }
    console.log(updatedProduct)
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  const deleteProduct = async(id) => {
    try {
      const response = await ApiService.delete(`${ApiEndPoints?.deleteproduct}/${id}`);
      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }finally {

    }
    setProducts(products.filter(p => p.id !== id))
  }

  useEffect(() => {
    getProducts()
    getPermission();
  }, [])
  return (
    <div className="container mx-auto  px-4">
        {/* <h1 className="text-3xl  font-bold text-gray-800 mb-4">Product Management</h1> */}
      <div className=" rounded-lg mb-4">
        <Button onClick={() => setIsFormOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
          Add New Product
        </Button>
      </div>
      

      {!isLoading ? (
         <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
         <Table>
           <TableHeader>
             <TableRow className="bg-gray-50 border-b border-gray-200">
               <TableHead className="font-bold text-gray-700 px-6 py-4">Name</TableHead>
               <TableHead className="font-bold text-gray-700 px-6 py-4">Price</TableHead>
               <TableHead className="font-bold text-gray-700 px-6 py-4">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {products.map((product) => (
               <TableRow key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                 <TableCell className="px-6 py-4">{product.name}</TableCell>
                 <TableCell className="px-6 py-4">₹{product.price}</TableCell>
                 <TableCell className="px-6 py-4">
                   <Button 
                     variant="outline" 
                     onClick={() => {
                       setEditingProduct(product)
                       setIsFormOpen(true)
                     }} 
                     className="mr-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                   >
                     Edit
                   </Button>
                   <Button 
                     variant="destructive" 
                     onClick={() => deleteProduct(product.id)}
                     className="bg-red-500 hover:bg-red-600 text-white"
                   >
                     Delete
                   </Button>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>
      ) : (
        <div className="flex items-center justify-center mt-10">
          <svg
            className="animate-spin h-16 w-16 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
     

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={editingProduct ? updateProduct : addProduct} 
            onCancel={() => {
              setIsFormOpen(false)
              setEditingProduct(null)
            }}
            initialData={editingProduct}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductsPage;

