import Invoice from "../pages/Invoice";
import InvoiceList from "../pages/InvoiceList";
import Products from "../pages/Products";

export const routes = [
  { 
    path: "/", 
    exact: false, 
    component: InvoiceList
  },
  { 
    path: "/create", 
    exact: false, 
    component: Invoice
  },
  { 
    path: "/create/:id", 
    exact: false, 
    component: Invoice 
  },
  { 
    path: "/edit/:id", 
    exact: false, 
    component: Invoice 
  },
  { 
    path: "/products", 
    exact: false, 
    component: Products
  }
];