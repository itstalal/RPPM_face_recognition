import React, { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import FaceCapture from "../components/FaceCapture"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showFaceCapture, setShowFaceCapture] = useState(false); 

  // Connexion normale
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/dashboard/ia2_project/backend/login.php",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        alert("Connexion réussie !");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Erreur serveur. Veuillez réessayer.");
    }
  };

  // Connexion avec Google
  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      try {
        const userInfo = jwtDecode(response.credential);
        const res = await axios.post(
          "http://localhost/dashboard/ia2_project/backend/google_login.php",
          {
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.sub,
            token: response.credential,
          }
        );

        if (res.data.success) {
          alert("Connexion réussie via Google !");
        } else {
          setError(res.data.message || "Erreur de connexion avec Google.");
        }
      } catch (error) {
        setError("Erreur serveur. Veuillez réessayer.");
      }
    }
  };

  // show FaceCapture
  const handleFaceLogin = () => {
    setShowFaceCapture(true);
  };

  return (
    <GoogleOAuthProvider clientId="787609373544-jl1b46fqhrrjdmio246itiqc2123e39i.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Se connecter
          </h2>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Erreur de connexion avec Google")}
              shape="pill"
              text="signin_with"
              size="large"
              className="w-full"
            />
          </div>

          <div className="mt-4">
            <button
              onClick={handleFaceLogin}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Connexion par reconnaissance faciale
            </button>
          </div>

          {showFaceCapture && (
            <FaceCapture
              onLoginSuccess={(user) => {
                alert(`Bienvenue ${user.first_name} !`);
                setShowFaceCapture(false);
              }}
              onClose={() => setShowFaceCapture(false)}
            />
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;