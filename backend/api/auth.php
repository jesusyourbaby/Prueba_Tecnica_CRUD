<?php
require_once '../config/db.php'; // db.php contiene la configuración de la base de datos
require_once '../lib/JWT.php'; // JWT.php es la biblioteca para manejar tokens JWT
require_once '../config/config.php'; // onfig.php tiene la clave secreta para firmar los tokens

use Firebase\JWT\JWT; // Firebase\JWT para generar y manejar tokens

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(json: file_get_contents(filename:'php://input'), associative: true);

    $email = filter_var(value: $data['email'], filter: FILTER_SANITIZE_EMAIL);

    $password = $data['password'];

    if (!filter_var(value: $email, filter: FILTER_VALIDATE_EMAIL)) {
        http_response_code(response_code: 400);
        echo json_encode(value: ['error' => 'Email inválido.']);
        exit; 
    }

    $stmt = $conn->prepare(query: "SELECT * FROM usuarios WHERE email = :email");

    $stmt->execute(params: ['email' => $email]);

    $user = $stmt->fetch(mode: PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(response_code: 401);
        echo json_encode(value: ['error' => 'No se encontró el usuario que especificó.']);
    } 

    elseif (!password_verify(password: $password, hash: $user['password'])) {
        http_response_code(response_code: 401);
        echo json_encode(value: ['error' => 'Contraseña incorrecta.']);
    }

    else {
        // Clave secreta del token que está definida en config.php
        $key = JWT_SECRET_KEY;

        $payload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + 3600
        ];

        $token = JWT::encode(payload: $payload, key: $key, alg: 'HS256');

        echo json_encode(value:[
            'token' => $token,
            'email' => $user['email']
        ]);
    }
}   else {
    http_response_code(response_code: 405);
    echo json_encode(value: ['error' => 'Método no permitido.']);
}
?>