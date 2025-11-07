import React from "react";

// Ce layout s'applique uniquement aux routes /login et /register
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-primary-800 p-6">
      {/* Le layout d'authentification est souvent simple :
        - Un fond (ici notre couleur primaire)
        - Centre le contenu (le formulaire)
      */}
      <div className="w-full">
        {/* Le contenu (page.tsx de login ou register) sera inséré ici */}
        {children}
      </div>
    </main>
  );
}
