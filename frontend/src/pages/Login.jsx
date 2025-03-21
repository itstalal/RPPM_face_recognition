import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Importation de GoogleOAuthProvider et GoogleLogin
import { jwtDecode } from 'jwt-decode'; // Correct import from jwt-decode

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fonction de connexion normale
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      console.log('Envoi des données...', { email, password });
      const response = await axios.post(
        'http://localhost/dashboard/ia2_project/backend/login.php',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Réponse du serveur:', response.data);

      if (response.data.success) {
        console.log('Connexion réussie:', response.data.user);
        alert('Connexion réussie ');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Erreur serveur. Veuillez réessayer.');
    }
  };

  // Fonction pour gérer la connexion avec Google
  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      try {
        // jwtDecode for decoding user infos
        const { credential } = response;
        const userInfo = jwtDecode(credential);
  
        console.log('User Info:', userInfo);
  
        const res = await axios.post(
          'http://localhost/dashboard/ia2_project/backend/google_login.php',
          {
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.sub,
            token: credential,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Réponse du serveur:', res.data);
  
        if (res.data.success) {
          alert('Connexion réussie via Google! ');
        } else {
          setError(res.data.message || 'Erreur de connexion avec Google.');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion avec Google:', error);
        setError('Erreur serveur. Veuillez réessayer.');
      }
    }
  };
  
  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "787609373544-jl1b46fqhrrjdmio246itiqc2123e39i.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
  
      if (!window.googlePromptShown) {
        window.google.accounts.id.prompt();
        window.googlePromptShown = true;
      }
    }
  }, []);
  
  

  return (
    <GoogleOAuthProvider clientId="787609373544-jl1b46fqhrrjdmio246itiqc2123e39i.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Se connecter</h2>
  
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
  
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105"
            >
              Se connecter
            </button>
          </form>
  
          <div className="text-center mt-4">
            <a href="/" className="text-blue-500 text-sm hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
  
          <div className="text-center mt-4">
            <p className="text-sm">
              Pas encore de compte ?{' '}
              <a href="/register" className="text-blue-500 hover:underline">
                S'inscrire
              </a>
            </p>
          </div>
  
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <button
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 transform hover:scale-105"
              >
                <i className="fab fa-facebook-f mr-2"></i>
                Connexion avec Facebook
              </button>
            </div>
  
            {/* Google Sign-In Button */}
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError('Erreur de connexion avec Google')}
              useOneTap
              shape="pill"
              theme="outline"
              text="signin_with"
              size="large"
              className="w-full"
            />
  
            <div className="flex items-center justify-between mb-4 mt-4">
              <button className="w-full flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-lg shadow-md hover:shadow-lg hover:from-gray-800 hover:to-black transition duration-300 transform hover:scale-105">
                <i className="fas fa-user-circle mr-2"></i>
                Connexion par reconnaissance faciale
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};  

export default Login;
