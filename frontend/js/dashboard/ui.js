// Ui.js
const UIManager = (() => {
    const renderProducts = (products) => {
        const productTable = document.getElementById('productTable');
        productTable.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaVencimiento = product.fecha_vencimiento
                ? new Date(product.fecha_vencimiento.replace(/-/g, '/'))
                : null;
            const estaAtrasada = fechaVencimiento && fechaVencimiento < hoy;

            row.innerHTML = `
                <td><input type="checkbox" class="productCheckbox" value="${product.id}"></td>
                <td>${product.titulo}</td>
                ${window.innerWidth > 768 ? `<td>${product.descripcion}</td>` : '<td class="hidden-column"></td>'}
                <td style="${estaAtrasada ? 'color: red;' : ''}">${product.fecha_vencimiento || 'Sin fecha'}</td>
                <td>${estaAtrasada ? '<span style="color: red;">Atrasada</span>' : product.estado}</td>
                <td class="acciones-columna">
                    <button class="btn btn-info btn-sm" onclick="mostrarInfo(${product.id})">
                        <i class="bi bi-info-circle-fill"></i>
                        Info
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil-square"></i>
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash3-fill"></i>
                        Eliminar
                    </button>
                </td>
            `;
            productTable.appendChild(row);
        });
    };

    const renderPagination = (totalProducts, currentPage, productsPerPage) => {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(totalProducts / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => loadProducts(i, productsPerPage));
            pagination.appendChild(button);
        }
    };

    return {
        renderProducts,
        renderPagination
    };
})();