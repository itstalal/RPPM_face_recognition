<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';


$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['password'])) {
    $email = htmlspecialchars($data['email']);
    $password = htmlspecialchars($data['password']);

    // Prépare la requête pour récupérer l'utilisateur
    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie",
                "user" => [
                    "id" => $user['id'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Mot de passe incorrect"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Utilisateur not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs"]);
}
?>
