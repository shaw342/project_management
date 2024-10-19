import React from "react";
import { Sidebar, SidebarContent } from "../../components/ui/sidebar";

export default function AppHome() {
    return (
        <>
        <div>
        <h1 className="text-3xl font-bold mb-4">Bienvenue dans l'application</h1>
            <p>Ceci est la page principale de votre application.</p>
            {/* Ajoutez ici le contenu principal de votre application */}
        <Sidebar>
        <SidebarContent />
        </Sidebar>
        </div>
        </>
    )
  }