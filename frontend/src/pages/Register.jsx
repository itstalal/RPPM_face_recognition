import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import {useNavigate} from "react-router-dom"

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    console.log("Début de l'inscription");
  
    if (!firstName || !lastName || !email || !password || !capturedImage) {
      setError("Tous les champs sont requis.");
      return;
    }
  
    try {
      console.log("Envoi des données vers le serveur");
  
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("imageData", capturedImage);  
  
      const response = await axios.post('http://localhost/dashboard/server/process_register.php', 
        formData, 
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Réponse du serveur :", response);
  
      if (response.data.success) {
        console.log("Inscription réussie :", response.data.message);
        window.location.href = "/"; 
      } else {
        setError(response.data.message);
        console.log("Erreur d'inscription :", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setError("Erreur serveur. Veuillez réessayer.");
    }
  };
  
  

  const handleCapture = () => {
    if (webcamRef.current) {
      const canvas = document.createElement("canvas");
      const video = webcamRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    if (showWebcam) {
      const constraints = { video: { facingMode: "user" } };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    } else if (webcamRef.current && webcamRef.current.srcObject) {
      const stream = webcamRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      webcamRef.current.srcObject = null;
      setCapturedImage(null);
    }
  }, [showWebcam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Créer un compte
        </h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700">Prénom</label>
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={showWebcam}
              onChange={() => setShowWebcam(!showWebcam)}
            />
            <label className="text-gray-700">Activer la reconnaissance faciale</label>
          </div>

          {showWebcam && (
            <div className="mb-4">
              <video ref={webcamRef} autoPlay playsInline className="w-full rounded-lg border border-gray-300"></video>
              <button
                type="button"
                onClick={handleCapture}
                className="mt-2 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              >
                Capturer l'image
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="mb-4">
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg border border-gray-300" />
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-3 rounded-lg transition duration-300 ${
              !capturedImage ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={!capturedImage}
          >
            S'inscrire
          </button>
        </form>

        <label className="text-blue-500 font-bold">
          <a href="/">Avez-vous déjà un compte?</a>
        </label>
      </div>
    </div>
  );
};

export default Register;
