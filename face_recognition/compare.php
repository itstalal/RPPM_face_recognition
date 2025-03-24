<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    if (!isset($_POST['image']) || empty($_POST['image'])) {
        throw new Exception('Aucune image reçue.');
    }

    $base64Image = $_POST['image'];

    $decodedImage = base64_decode($base64Image);
    if (!$decodedImage) {
        throw new Exception("Échec du décodage de l'image.");
    }

    $tempImage = tempnam(sys_get_temp_dir(), 'face_recognition_') . '.jpg';
    if (!file_put_contents($tempImage, $decodedImage)) {
        throw new Exception("Impossible de sauvegarder l'image temporaire.");
    }

    $pythonPath = "C:\\Users\\elmou\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
    if (!file_exists($pythonPath)) {
        throw new Exception("Python n'est pas installé ou le chemin est incorrect.");
    }

    // Exécuter le script Python avec l'image temporaire
    $command = escapeshellarg($pythonPath) . " " . 
               escapeshellarg(__DIR__ . "/compare.py") . " " . 
               escapeshellarg($tempImage) . " 2>&1";

    $output = shell_exec($command);

    if (file_exists($tempImage)) {
        unlink($tempImage);
    }

    $result = json_decode($output, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Erreur lors du traitement de l\'image: ' . $output);
    }

    if (!isset($result['success']) || !isset($result['user']['first_name']) || !isset($result['user']['email'])) {
        throw new Exception("Réponse du serveur invalide : " . json_encode($result));
    }

    header('Content-Type: application/json');
    echo json_encode($result);

} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
