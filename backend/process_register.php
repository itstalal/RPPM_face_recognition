<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = isset($_POST['firstName']) ? $_POST['firstName'] : null;
    $lastName = isset($_POST['lastName']) ? $_POST['lastName'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $password = isset($_POST['password']) ? password_hash($_POST['password'], PASSWORD_BCRYPT) : null;
    $imageData = isset($_POST['imageData']) ? $_POST['imageData'] : null;

    if (!$firstName || !$lastName || !$email || !$password || !$imageData) {
        echo json_encode(["success" => false, "message" => "Tous les champs sont requis."]);
        exit;
    }


    $uploadDir = 'uploads/';

    $imageDecoded = base64_decode(str_replace('data:image/png;base64,', '', $imageData));
    $imageFileName = uniqid() . ".png"; // Nom unique pour l'image
    $imageFilePath = $uploadDir . $imageFileName;

    if (!file_put_contents($imageFilePath, $imageDecoded)) {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'enregistrement de l'image."]);
        exit;
    }

    try {
        // Requête SQL avec les colonnes dans l'ordre exact
        $stmt = $pdo->prepare("INSERT INTO users (id, first_name, last_name, email, password, image, image_path) 
                               VALUES (NULL, ?, ?, ?, ?, ?, ?)");

        $stmt->bindParam(1, $firstName);
        $stmt->bindParam(2, $lastName);
        $stmt->bindParam(3, $email);
        $stmt->bindParam(4, $password);
        $stmt->bindParam(5, $imageDecoded, PDO::PARAM_LOB); 
        $stmt->bindParam(6, $imageFilePath);

        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Inscription réussie avec image enregistrée"]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erreur d'insertion : " . $e->getMessage()]);
    }
}
?>