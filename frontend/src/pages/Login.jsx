import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    console.log('Logging in with', email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Se connecter</h2>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
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
            <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
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
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
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
          <p className="text-sm">Pas encore de compte ? <a href="/register" className="text-blue-500 hover:underline">S'inscrire</a></p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <button className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
              <i className="fab fa-facebook-f mr-2"></i>
              Connexion avec Facebook
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button className="w-full flex items-center justify-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300">
              <i className="fab fa-google mr-2"></i>
              Connexion avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
