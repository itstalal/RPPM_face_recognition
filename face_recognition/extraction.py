import face_recognition_models
import face_recognition
import cv2
import numpy as np
import os
import pkg_resources


chemin = '../backend/uploads/' 
list_images = []
list_noms = []

list_file = os.listdir(chemin)

for file_name in list_file:
    image_path = os.path.join(chemin, file_name)
    image = cv2.imread(image_path)

    list_images.append(image)
    nom = os.path.splitext(file_name)[0]
    list_noms.append(nom)

def extraction_caracteristiques_visage(images, noms):
    caracteristiques = []
    compteur = 1
    for image, nom in zip(images, noms):
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        encodages = face_recognition.face_encodings(image_rgb)
        
        if len(encodages) > 0:
            encodage = encodages[0]  
            encodage = encodage.tolist() + [nom] 
            caracteristiques.append(encodage)
        else:
            print(f"Aucun visage détecté dans l'image {nom}")

        progression = int((compteur / len(images)) * 100)
        print(f'{progression} % d\'images traitées')
        compteur += 1

    array_caracteristiques = np.array(caracteristiques)
    np.save('Signatures.npy', array_caracteristiques)
    print("Extraction terminée et sauvegardée dans Signatures.npy")

extraction_caracteristiques_visage(list_images, list_noms)
