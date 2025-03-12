<?php
require_once __DIR__ . '/../config/db.php'; 
require_once __DIR__ . '/../lib/JWT.php';  
require_once __DIR__ . '/../lib/Key.php';  
require_once __DIR__ . '/../config/config.php';

use Firebase\JWT\JWT; // Para generar y manejar tokens
use Firebase\JWT\Key; // Importamos la clase para verificar tokens JWT

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(response_code:401);
    echo json_encode(value: ['error' => 'Debes proporcionar un token de autenticación.']);
    exit;
}

$token = str_replace(search: 'Bearer ', replace: '', subject: $headers['Authorization']);
$key = new Key(keyMaterial: JWT_SECRET_KEY, algorithm: 'HS256');

try {
    $decoded = JWT::decode(jwt: $token, keyOrKeyArray: $key); 
} catch (Exception $e) {
    http_response_code(response_code:401);
    echo json_encode(value:['error' => 'El token no es válido.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $tareaId = (int)$_GET['id'];
            $stmt = $conn->prepare("SELECT * FROM productos WHERE id = :id");
            $stmt->execute(['id' => $tareaId]);
            $tarea = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($tarea) {
                echo json_encode($tarea);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Tarea no encontrada.']);
            }
        } else {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
            $offset = ($page - 1) * $limit;
    
            if (isset($_GET['estado']) && $_GET['estado'] !== '') {
                $estado = $_GET['estado'];
                
                $stmt = $conn->prepare("SELECT COUNT(*) as total FROM productos WHERE estado = :estado");
                $stmt->execute(['estado' => $estado]);
                $totalTareas = $stmt->fetchColumn();
    
                $stmt = $conn->prepare("SELECT * FROM productos WHERE estado = :estado LIMIT :limit OFFSET :offset");
                $stmt->bindValue(':estado', $estado, PDO::PARAM_STR);
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
                $stmt->execute();
                $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->query("SELECT COUNT(*) as total FROM productos");
                $totalTareas = $stmt->fetchColumn();
    
                $stmt = $conn->prepare("SELECT * FROM productos LIMIT :limit OFFSET :offset");
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
                $stmt->execute();
                $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
    
            echo json_encode([
                'tareas' => $tareas,
                'total' => $totalTareas,
            ]);
        }
        break;
    

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Validar que los campos obligatorios no estén vacíos
        if (empty($data['titulo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El título es obligatorio.']);
            exit;
        }
        if (empty($data['fecha_vencimiento'])) {
            http_response_code(400);
            echo json_encode(['error' => 'La fecha de vencimiento es obligatoria.']);
            exit;
        }
        if (empty($data['estado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El estado es obligatorio.']);
            exit;
        }
    
        $creadoPor = $decoded->email;
    
        $stmt = $conn->prepare("INSERT INTO productos (titulo, descripcion, fecha_vencimiento, estado, creado_por) VALUES (:titulo, :descripcion, :fecha_vencimiento, :estado, :creado_por)");
        $stmt->execute([
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'] ?? '',
            'fecha_vencimiento' => $data['fecha_vencimiento'],
            'estado' => $data['estado'],
            'creado_por' => $creadoPor
        ]);
        echo json_encode(['message' => 'La tarea ha sido creada correctamente.']);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['titulo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'El ID y el título son obligatorios.']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE productos SET titulo = :titulo, descripcion = :descripcion, fecha_vencimiento = :fecha_vencimiento, estado = :estado WHERE id = :id");
        $stmt->execute([
            'id' => $data['id'],
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'] ?? '',
            'fecha_vencimiento' => $data['fecha_vencimiento'] ?? null,
            'estado' => $data['estado'] ?? 'pendiente'
        ]);
        echo json_encode(['message' => 'La tarea ha sido actualizada correctamente.']);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($_GET['id'])) {
            // Eliminar un solo producto
            $tareaId = (int)$_GET['id'];
            $stmt = $conn->prepare("DELETE FROM productos WHERE id = :id");
            $stmt->execute(['id' => $tareaId]);

            echo json_encode(['message' => 'La tarea ha sido eliminada correctamente.']);
        } elseif (isset($data['ids'])) {
            // Eliminar múltiples productos
            $ids = implode(',', array_map('intval', $data['ids']));
            $stmt = $conn->prepare("DELETE FROM productos WHERE id IN ($ids)");
            $stmt->execute();

            echo json_encode(['message' => 'Las tareas seleccionadas han sido eliminadas correctamente.']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Debes proporcionar un ID o una lista de IDs.']);
        }
        break;
}