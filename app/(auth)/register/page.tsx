"use client";

import { useState, useEffect, useRef } from "react";
import { useRegister } from "@/services/auth";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const errorPasswordRef = useRef<HTMLParagraphElement>(null);
  

  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !surname) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    else if (password !== passwordConfirmation) {
      errorPasswordRef.current?.classList.remove("hidden");
      return;
    }
    register({ email, password, name, surname });
  };
  useEffect(() => {
    if (passwordConfirmation !== password && password !== "") {
      errorPasswordRef.current?.classList.remove("hidden");
    }
    else{
      errorPasswordRef.current?.classList.add("hidden");
    }
  }, [password, passwordConfirmation]);

  return (
    <div className="mx-auto max-w-2xl bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary-800 mb-2">
          Créer un compte
        </h1>
        <p className="text-lg text-gray-600">
          Rejoignez la plateforme d'administration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Champ Prénom */}
          <div>
            <label
              htmlFor="surname"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Prénom
            </label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              disabled={isPending}
              className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
              placeholder="Jean"
            />
          </div>

          {/* Champ Nom */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
              placeholder="Dupont"
            />
          </div>
        </div>

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
        <div>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Confirmation du mot de passe
          </label>
          <input
            type="password"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            disabled={isPending}
            className="w-full py-5 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 transition"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-center">
            Une erreur est survenue lors de l'inscription.
          </p>
        )}
        <p ref={errorPasswordRef} className="text-red-500 text-center hidden">
            Les mots de passe ne correspondent pas.
        </p>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-5 text-xl font-bold text-white bg-primary-800 rounded-2xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isPending ? (
            <span>Création en cours...</span>
          ) : (
            <>
              <UserPlus size={24} />
              <span>S'inscrire</span>
            </>
          )}
        </button>

        <p className="text-center text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
