<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(json: file_get_contents(filename: 'php://input'), associative: true);
    $email = $data['email'];
    $password = $data['password'];

    // Email con formato valido
    if (!filter_var(value: $email, filter: FILTER_VALIDATE_EMAIL)) {
        http_response_code(response_code: 400);
        echo json_encode(value: ['error' => 'Email inválido.']);
        exit;
    }

    // Se verifica si el email ya esta registrado en la base de datos
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        http_response_code(response_code: 400);
        echo json_encode(value: ['error' => 'El email ya está registrado.']);
        exit;
    }

    // Aqui se genera el hash de la contraseña
    $hash = password_hash(password: $password, algo: PASSWORD_DEFAULT);

    try {
        $stmt = $conn->prepare("INSERT INTO usuarios (email, password) VALUES (:email, :password)");

        $stmt->execute([
            'email' => $email,
            'password' => $hash
        ]);
        echo json_encode(value: ['message' => 'Usuario registrado.']);
    } catch (PDOException $e) {
        http_response_code(500); 
        echo json_encode(['error' => 'Error al registrar el usuario.']);
    }
} else {
    http_response_code(response_code: 405);
    echo json_encode(value: ['error' => 'Método no permitido.']);
}
?>