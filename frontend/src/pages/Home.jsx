import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();  
  const { first_name, email } = location.state || {};
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [distance, setDistance] = useState('canberra');
  const [descripteur, setDescripteur] = useState('glcm_haralik_bit');
  const [resultats, setResultats] = useState([]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('distance', distance);
    formData.append('descripteur', descripteur);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setResultats(response.data.resultat);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🔍 Système CBIR - Recherche d'Images</h1>

      {first_name && email ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
          <div className="text-center">
            <p className="text-lg"><strong>👤 Utilisateur :</strong> {first_name}</p>
            <p className="text-md text-gray-500">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            {previewURL && (
              <img
                src={previewURL}
                alt="Aperçu"
                className="w-64 h-auto rounded-xl shadow-md border border-gray-300"
              />
            )}

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <select
                value={descripteur}
                onChange={(e) => setDescripteur(e.target.value)}
                className="border p-2 rounded-lg bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="glcm_haralik_bit">GLCM + Haralick + Bit</option>
                <option value="glcm">GLCM</option>
                <option value="haralik_feat">Haralick</option>
                <option value="bitdesc">Bit Descriptor</option>
              </select>

              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="border p-2 rounded-lg bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="euclidienne">Euclidienne</option>
                <option value="manhattan">Manhattan</option>
                <option value="chebyshev">Chebyshev</option>
                <option value="canberra">Canberra</option>
              </select>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-md transition"
            >
              📤 Envoyer l'image
            </button>
          </form>
        </div>
      ) : (
        <p className="text-red-500 font-medium mt-10">❌ Veuillez vous connecter pour envoyer une image.</p>
      )}

      {resultats.length > 0 && (
        <div className="mt-10 w-full max-w-6xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📂 Résultats de la recherche :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultats.map((img, idx) => (
              <div key={idx} className="bg-white border rounded-xl shadow p-4 flex flex-col items-center">
                <img
                  src={`http://localhost:5000/static/${img.image}`}
                  alt={`Image ${idx}`}
                  className="w-52 h-auto rounded-md"
                />
                <p className="mt-3 font-medium text-gray-800">📛 Nom : {img.classe}</p>
                <span className="text-sm mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  🧮 Distance : {img.distance.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
