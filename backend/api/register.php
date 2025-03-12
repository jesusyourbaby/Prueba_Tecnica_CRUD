<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $password = $data['password'];

    // Aqui se genera el hash de la contraseña
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO usuarios (email, password) VALUES (:email, :password)");
    $stmt->execute([
        'email' => $email,
        'password' => $hash
    ]);

    echo json_encode(['message' => 'Usuario registrado.']);
} else {
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido.']);
}
?>