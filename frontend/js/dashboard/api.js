// Api.js
const API = (() => {
    const BASE_URL = 'http://localhost/Prueba_Tecnica_CRUD/backend/api/productos.php';

    const fetchData = async (endpoint, method, body = null) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthManager.getToken()}`
            },
            body: body ? JSON.stringify(body) : null
        });
        return response.json(); 
    };

    return {
        getProducts: (page, limit, estado) => fetchData(`?page=${page}&limit=${limit}&estado=${estado}`, 'GET'),

        createProduct: (data) => fetchData('', 'POST', data),

        updateProduct: (data) => fetchData('', 'PUT', data),

        deleteProduct: (id) => fetchData(`?id=${id}`, 'DELETE'),

        deleteMultipleProducts: (ids) => fetchData('', 'DELETE', { ids })
    };
})();
