// Auth.js
const AuthManager = (() => {
    const getToken = () => localStorage.getItem('token');

    const getUserEmail = () => localStorage.getItem('userEmail');

    const redirectIfUnauthorized = () => {
        if (!getToken()) window.location.href = 'index.html';
    };

    const setUserEmailInUI = () => {
        const email = getUserEmail();
        if (email) document.getElementById('loggedInUser').textContent = email;
    };

    const logout = () => {
        console.log('Cerrando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    };

    return {
        getToken,
        getUserEmail,
        redirectIfUnauthorized,
        setUserEmailInUI,
        logout
    };
})();

window.logout = AuthManager.logout;