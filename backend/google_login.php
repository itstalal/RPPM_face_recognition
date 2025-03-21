<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require 'config.php'; 

// get data from db
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->name) && isset($data->googleId)) {
    $email = $data->email;
    $name = $data->name;
    $googleId = $data->googleId;

    try {
        $query = "SELECT * FROM users WHERE google_id = :google_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":google_id", $googleId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie",
                "user" => $stmt->fetch(PDO::FETCH_ASSOC)
            ]);
        } else {
            $insertQuery = "INSERT INTO users (first_name, email, google_id) VALUES (:name, :email, :google_id)";
            $stmt = $pdo->prepare($insertQuery);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":google_id", $googleId);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Utilisateur créé",
                "user" => ["name" => $name, "email" => $email]
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erreur de base de données : " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Données manquantes"
    ]);
}
?>
