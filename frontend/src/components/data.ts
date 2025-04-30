export type TeamMember = {
    id: string
    name: string
    avatar: string
    task: string
    tasksFinished: number
    totalTasks: number
    problem: string | null
    message: string
  }
  
  export const teamData: TeamMember[] = [
    {
      id: "1",
      name: "Sophie Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Conception de l'interface utilisateur",
      tasksFinished: 8,
      totalTasks: 10,
      problem: "Problème de compatibilité avec Safari",
      message: "Je terminerai les dernières tâches demain matin.",
    },
    {
      id: "2",
      name: "Thomas Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Développement backend",
      tasksFinished: 5,
      totalTasks: 12,
      problem: null,
      message: "L'API est presque terminée, je travaille sur les tests unitaires.",
    },
    {
      id: "3",
      name: "Emma Bernard",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Tests d'assurance qualité",
      tasksFinished: 15,
      totalTasks: 15,
      problem: null,
      message: "Tous les tests sont passés avec succès!",
    },
    {
      id: "4",
      name: "Lucas Petit",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Optimisation des performances",
      tasksFinished: 3,
      totalTasks: 8,
      problem: "Problème de mémoire sur les appareils mobiles",
      message: "Je travaille sur une solution pour réduire l'utilisation de la mémoire.",
    },
    {
      id: "5",
      name: "Chloé Leroy",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Documentation technique",
      tasksFinished: 2,
      totalTasks: 6,
      problem: null,
      message: "La documentation avance bien, je devrais terminer dans les délais.",
    },
    {
      id: "6",
      name: "Antoine Moreau",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Intégration des API tierces",
      tasksFinished: 4,
      totalTasks: 7,
      problem: "Problème d'authentification avec l'API de paiement",
      message: "J'ai contacté le support technique pour résoudre le problème.",
    },
    {
      id: "7",
      name: "Léa Fournier",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Design graphique",
      tasksFinished: 12,
      totalTasks: 15,
      problem: null,
      message: "Les nouvelles icônes sont prêtes pour validation.",
    },
    {
      id: "8",
      name: "Hugo Girard",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Analyse de données",
      tasksFinished: 6,
      totalTasks: 10,
      problem: "Données incomplètes pour certains utilisateurs",
      message: "Je travaille sur un algorithme pour estimer les valeurs manquantes.",
    },
    {
      id: "9",
      name: "Inès Lambert",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Gestion de projet",
      tasksFinished: 18,
      totalTasks: 20,
      problem: null,
      message: "La réunion d'avancement est prévue pour demain à 14h.",
    },
    {
      id: "10",
      name: "Mathis Roux",
      avatar: "/placeholder.svg?height=40&width=40",
      task: "Sécurité et conformité",
      tasksFinished: 7,
      totalTasks: 12,
      problem: "Vulnérabilité détectée dans une bibliothèque tierce",
      message: "Je prépare un correctif et une mise à jour de sécurité.",
    },
  ]
  