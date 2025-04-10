import face_recognition
import numpy as np
import cv2
import json
import mysql.connector
from mysql.connector import Error
import sys
import os

def connect_to_database():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="Talal123",
            password="Talal123",
            database="projetIA2"
        )
    except Error as e:
        raise Exception(f"Erreur de connexion à la base de données: {str(e)}")

def load_signatures_from_db():
    conn = connect_to_database()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, first_name, email, image FROM users")
        users = cursor.fetchall()

        if not users:
            raise Exception("Aucun utilisateur trouvé dans la base de données")

        signatures = []
        names = []
        first_names = []
        emails = []

        for user_id, first_name, email, image in users:
            if not image:
                print(f"Warning: Empty image blob for user {user_id}", file=sys.stderr)
                continue

            try:
                # Convert blob to numpy array
                nparr = np.frombuffer(image, np.uint8)
                if len(nparr) == 0:
                    print(f"Warning: Empty image data for user {user_id}", file=sys.stderr)
                    continue

                user_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if user_image is None:
                    print(f"Warning: Failed to decode image for user {user_id}", file=sys.stderr)
                    continue
                
                # Convert BGR to RGB
                rgb_image = cv2.cvtColor(user_image, cv2.COLOR_BGR2RGB)
                
                # Get face encodings
                face_encodings = face_recognition.face_encodings(rgb_image)
                
                if face_encodings:
                    signatures.append(face_encodings[0])
                    names.append(first_name)
                    first_names.append(first_name)
                    emails.append(email)
                else:
                    print(f"Warning: No face detected in image for user {user_id}", file=sys.stderr)
            except Exception as e:
                print(f"Error processing user {user_id}: {str(e)}", file=sys.stderr)
                continue

        if not signatures:
            raise Exception("Aucune signature faciale valide trouvée dans la base de données")

        return np.array(signatures), names, first_names, emails
    except Exception as e:
        print(f"Database error: {str(e)}", file=sys.stderr)
        raise
    finally:
        cursor.close()
        conn.close()

def compare_faces(captured_image_path):
    try:
        if not os.path.exists(captured_image_path):
            return {"success": False, "message": "Le fichier image n'existe pas"}

        # Load the signatures
        try:
            signatures, names, first_names, emails = load_signatures_from_db()
        except Exception as e:
            return {"success": False, "message": str(e)}
        
        # Load and process the captured image
        try:
            captured_image = face_recognition.load_image_file(captured_image_path)
        except Exception as e:
            return {"success": False, "message": f"Erreur lors du chargement de l'image: {str(e)}"}

        try:
            captured_encodings = face_recognition.face_encodings(captured_image)
        except Exception as e:
            return {"success": False, "message": f"Erreur lors de l'encodage du visage: {str(e)}"}

        if not captured_encodings:
            return {"success": False, "message": "Aucun visage détecté dans l'image capturée."}

        # Compare with the first detected face
        captured_encoding = captured_encodings[0]
        distances = face_recognition.face_distance(signatures, captured_encoding)
        
        min_distance = np.min(distances)
        min_distance_index = np.argmin(distances)

        # Threshold for face matching
        if min_distance < 0.6:
            return {
                "success": True,
                "user": {
                    "name": names[min_distance_index],
                    "first_name": first_names[min_distance_index],
                    "email": emails[min_distance_index],
                    "confidence": float(1 - min_distance)
                }
            }
        else:
            return {
                "success": False,
                "message": "Aucune correspondance trouvée."
            }

    except Exception as e:
        return {"success": False, "message": f"Erreur lors de la comparaison: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "message": "Usage: python compare.py <image_path>"}))
        sys.exit(1)

    captured_image_path = sys.argv[1]
    result = compare_faces(captured_image_path)
    print(json.dumps(result))