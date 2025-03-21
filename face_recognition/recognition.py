import face_recognition
import cv2
import numpy as np
import sys
import os
import json

image_path = sys.argv[1]

image_to_compare = cv2.imread(image_path)
image_to_compare_rgb = cv2.cvtColor(image_to_compare, cv2.COLOR_BGR2RGB)

face_encoding = face_recognition.face_encodings(image_to_compare_rgb)

if len(face_encoding) == 0:
    print(json.dumps({"success": False, "message": "Aucun visage trouvé dans l'image."}))
    sys.exit()

face_encoding = face_encoding[0]

uploads_dir = 'uploads/'

signatures = np.load('Signatures.npy')
stored_encodings = signatures[:, :-1].astype('float')
stored_names = signatures[:, -1]

matches = face_recognition.compare_faces(stored_encodings, face_encoding)
face_distances = face_recognition.face_distance(stored_encodings, face_encoding)

if True in matches:
    best_match_index = np.argmin(face_distances)
    user = stored_names[best_match_index]
    print(json.dumps({"success": True, "user": user}))
else:
    print(json.dumps({"success": False, "message": "Aucune correspondance trouvée."}))
