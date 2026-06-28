import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getStats     = ()        => API.get('/dashboard/stats');

export const getCars      = ()        => API.get('/cars');
export const createCar    = (data)    => API.post('/cars', data);
export const updateCar    = (id,data) => API.put(`/cars/${id}`, data);
export const deleteCar    = (id)      => API.delete(`/cars/${id}`);

export const getDealers   = ()        => API.get('/dealers');
export const createDealer = (data)    => API.post('/dealers', data);
export const updateDealer = (id,data) => API.put(`/dealers/${id}`, data);
export const deleteDealer = (id)      => API.delete(`/dealers/${id}`);

export const getCustomers   = ()        => API.get('/customers');
export const getCustomer    = (id)      => API.get(`/customers/${id}`);
export const createCustomer = (data)    => API.post('/customers', data);
export const updateCustomer = (id,data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id)      => API.delete(`/customers/${id}`);

export const getSales    = ()     => API.get('/sales');
export const createSale  = (data) => API.post('/sales', data);
export const deleteSale  = (id)   => API.delete(`/sales/${id}`);

export const getFeedback       = ()     => API.get('/feedback');
export const createFeedback    = (data) => API.post('/feedback', data);
export const deleteFeedback    = (id)   => API.delete(`/feedback/${id}`);

export const getStates = () => API.get('/states');
