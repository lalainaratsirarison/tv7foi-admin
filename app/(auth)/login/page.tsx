"use client";

import { useState } from "react";
import { useLogin } from "@/services/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Utilisation de notre hook de service
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      // @TODO: Meilleure validation
      alert("Veuillez remplir tous les champs");
      return;
    }
    login({ email, password });
  };

  return (
    <div className="mx-auto max-w-xl bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
      <div className="text-center mb-10">
        {/* @TODO: Remplacer par un vrai logo */}
        <h1 className="text-4xl font-bold text-primary-800 mb-2">Connexion</h1>
        <p className="text-lg text-gray-600">
          Accédez à votre tableau de bord
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Champ Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Adresse Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="vous@exemple.com"
          />
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="••••••••"
          />
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <p className="text-red-500 text-center">
            {/* @TODO: Message d'erreur plus convivial */}
            L'email ou le mot de passe est incorrect.
          </p>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-5 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isPending ? (
            <span>Connexion en cours...</span>
          ) : (
            <>
              <LogIn size={24} />
              <span>Se connecter</span>
            </>
          )}
        </button>

        <p className="text-center text-gray-600">
          Vous n'avez pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-primary-700 hover:underline">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
