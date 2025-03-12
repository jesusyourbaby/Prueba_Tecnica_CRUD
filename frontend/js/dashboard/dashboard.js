// Dashboard.js
AuthManager.redirectIfUnauthorized();
AuthManager.setUserEmailInUI();

window.addEventListener('pageshow', function (event) {
    AuthManager.redirectIfUnauthorized();
});

const productsPerPage = 5;
let currentPage = 1;
let totalProducts = 0;

loadProducts(currentPage);

async function loadProducts(page = 1, limit = productsPerPage, estado = '') {
    const response = await API.getProducts(page, limit, estado);
    UIManager.renderProducts(response.tareas);
    totalProducts = response.total;
    UIManager.renderPagination(totalProducts, page, limit);
}

// Eliminar un producto
async function deleteProduct(productId) {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!confirmDelete) return;

    const response = await API.deleteProduct(productId);
    if (response.message) {
        alert(response.message);
        loadProducts(currentPage);
    } else {
        alert('Error al eliminar el producto.');
    }
}

// Editar un producto
async function editProduct(productId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost/Prueba_Tecnica_CRUD/backend/api/productos.php?id=${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const product = await response.json();

        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductTitle').value = product.titulo || '';
        document.getElementById('editProductDescription').value = product.descripcion || '';
        document.getElementById('editProductDueDate').value = product.fecha_vencimiento || '';
        document.getElementById('editProductEstado').value = product.estado || 'pendiente';

        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        alert('Error al cargar los datos de la tarea.');
    }
}

window.editProduct = editProduct;

// Eliminar múltiples productos
async function deleteAllProducts() {
    const checkboxes = document.querySelectorAll('.productCheckbox:checked');
    const productIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (productIds.length === 0) {
        alert('Por favor, selecciona al menos un producto para eliminar.');
        return;
    }

    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar ${productIds.length} productos?`);
    if (!confirmDelete) return;

    const response = await API.deleteMultipleProducts(productIds);
    if (response.message) {
        alert(response.message);
        loadProducts(currentPage);
    } else {
        alert('Error al eliminar los productos.');
    }
}

window.deleteAllProducts = deleteAllProducts;

// Guardar cambios de un producto editado
async function saveEditedProduct() {
    const productId = document.getElementById('editProductId').value;
    const titulo = document.getElementById('editProductTitle').value;
    const descripcion = document.getElementById('editProductDescription').value;
    const fecha_vencimiento = document.getElementById('editProductDueDate').value;
    const estado = document.getElementById('editProductEstado').value;

    const data = { id: productId, titulo, descripcion, fecha_vencimiento, estado };
    const response = await API.updateProduct(data);

    if (response.message) {
        alert(response.message);
        loadProducts(currentPage);
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editModal.hide();
    } else {
        alert('Error al actualizar la tarea.');
    }
}

// Filtrar tareas
function filtrarTareas() {
    const estado = document.getElementById('filtroEstado').value;
    currentPage = 1;
    loadProducts(currentPage, productsPerPage, estado);
}

// Info de una tarea
async function mostrarInfo(tareaId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost/Prueba_Tecnica_CRUD/backend/api/productos.php?id=${tareaId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const tarea = await response.json();

        document.getElementById('infoTitulo').textContent = tarea.titulo;
        document.getElementById('infoDescripcion').textContent = tarea.descripcion || 'Sin descripción';
        document.getElementById('infoFechaVencimiento').textContent = tarea.fecha_vencimiento || 'Sin fecha';

        let estadoTarea = tarea.estado || 'pendiente';
        if (tarea.fecha_vencimiento) {
            const [year, month, day] = tarea.fecha_vencimiento.split('-');
            const fechaVenc = new Date(year, month - 1, day);
            const fechaHoy = new Date();
            fechaHoy.setHours(0, 0, 0, 0);

            if (fechaVenc < fechaHoy) {
                estadoTarea = 'Atrasado';
            }
        }

        document.getElementById('infoEstado').textContent = estadoTarea;
        document.getElementById('infoCreadoPor').textContent = tarea.creado_por || 'Desconocido';

        const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
        infoModal.show();
    } catch (error) {
        console.error('Error al obtener la información de la tarea:', error);
        alert('Error al cargar los detalles de la tarea.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
});

window.mostrarInfo = mostrarInfo;

EventManager.setupEventListeners();