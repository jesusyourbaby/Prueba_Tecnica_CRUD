<?php
$host = 'localhost';
$dbname = 'prueba_tecnica_crud';
$username = 'root'; 
$password = '';

try {
    // Una forma segura y flexible de conectarse a bases de datos en PHP
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>