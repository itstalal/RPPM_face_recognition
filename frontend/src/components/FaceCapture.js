import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const capture = useCallback(async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        setError("Impossible de capturer l'image. Réessayez.");
        return;
      }

      setLoading(true);
      setError("");

      const base64Data = imageSrc.split(',')[1];
      const formData = new FormData();
      formData.append('image', base64Data);

      const response = await axios.post(
        "http://localhost/dashboard/ia2_project/face_recognition/compare.php",
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success && response.data.user) {
        const { first_name, email } = response.data.user;
        navigate("/", { state: { first_name, email } });
      } else {
        setError(response.data.message || "Aucune correspondance trouvée.");
      }
    } catch (error) {
      console.error("Erreur de comparaison:", error);
      setError("Erreur serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          Connexion par reconnaissance faciale
        </h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={380}
          height={285}
          className="rounded-lg mb-4"
          mirrored
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          onClick={capture}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Vérification..." : "Vérifier"}
        </button>
      </div>
    </div>
  );
};

export default FaceCapture;