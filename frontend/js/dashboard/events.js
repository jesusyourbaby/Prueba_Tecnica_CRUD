// Events.js
const EventManager = (() => {
    const setupEventListeners = () => {
        document.getElementById('addProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const titulo = document.getElementById('productTitle').value.trim();
            const descripcion = document.getElementById('productDescription').value.trim();
            const fecha_vencimiento = document.getElementById('productDueDate').value.trim();
            const estado = document.getElementById('productEstado').value.trim();

            if (!titulo) {
                alert('El titulo es obligatorio.');
                return;
            }
            if (!fecha_vencimiento) {
                alert('La fecha de vencimiento es obligatoria.');
                return;
            }
            if (!estado) {
                alert('El estado es obligatorio.');
                return
            }

            const data = { titulo, descripcion, fecha_vencimiento, estado };

            const response = await API.createProduct(data);

            if (response.message) {
                alert(response.message);
                loadProducts(currentPage); // Recargar la lista de tareas
                document.getElementById('addProductForm').reset(); // Limpiar el formulario
                bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide(); // Cerrar el modal
            } else {
                alert('Error: ' + response.error);
            }
        });

        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('click', function () {
                const checkboxes = document.querySelectorAll('.productCheckbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
            });
        }
    };
    return {
        setupEventListeners
    };
})();