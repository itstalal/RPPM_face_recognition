from .descripteurs import glcm_haralik_bit, glcm, bitdesc, haralik_feat
from .distance import recherche_image
import numpy as np
import os

# Dictionnaire pour mapper les noms de descripteurs aux fonctions et signatures
DESCRIPTEURS = {
    "glcm_haralik_bit": (glcm_haralik_bit, "SignatureConcat.npy"),
    "glcm": (glcm, "SignatureGLCM.npy"),
    "bitdesc": (bitdesc, "SignatureBitdesc.npy"),
    "haralik_feat": (haralik_feat, "SignatureHaralik_feat.npy")
}

def traiter_image_requete(chemin_image, distance='canberra', descripteur='glcm_haralik_bit', K=5):
    if descripteur not in DESCRIPTEURS:
        raise ValueError(f"Descripteur '{descripteur}' non supporté.")

    fonction, signature_file = DESCRIPTEURS[descripteur]
    chemin_signature = os.path.join("cbir", "signatures", signature_file)
    signature = np.load(chemin_signature)

    carac_requete = fonction(chemin_image)
    resultat = recherche_image(
        bdd_signature=signature,
        img_requete=carac_requete,
        distance=distance,
        K=K
    )

    return [{
        'image': x[0].split('animalsCbir' + os.sep)[-1].replace('\\', '/'),
        'distance': x[1],
        'classe': x[2]
    } for x in resultat]
