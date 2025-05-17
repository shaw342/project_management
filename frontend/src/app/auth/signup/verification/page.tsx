"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import axios from "axios"
import { getCookie } from "cookies-next"
export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [email, setEmail] = useState("") 
  const router = useRouter()
  axios.defaults.withCredentials = true

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError("Veuillez entrer le code de vérification.")
      return
    }


    setIsVerifying(true)
    setError(null)

    try {

      const response = await axios.get("http://localhost:8080/api/v1/user/get/code")

      setEmail(response.data["email"])
      
      if (verificationCode === response.data["code"]) {
        setIsVerified(true)

        router.push("/auth/login")
        
        toast({
          title: "Email vérifié",
          description: "Votre adresse email a été vérifiée avec succès.",
        })
      } else {
        setError("Code de vérification incorrect. Veuillez réessayer.")
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la vérification. Veuillez réessayer.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return

    try {
      // Simuler un appel API pour renvoyer le code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Code renvoyé",
        description: `Un nouveau code de vérification a été envoyé à ${email}.`,
      })

      // Définir un délai avant de pouvoir renvoyer un autre code
      setCountdown(60)
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer un nouveau code. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Vérification de l'email</CardTitle>
          <CardDescription>Veuillez entrer le code de vérification envoyé à {email}</CardDescription>
        </CardHeader>
        <CardContent>
          {isVerified ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Email vérifié</AlertTitle>
              <AlertDescription>
                Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à toutes les
                fonctionnalités.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleVerifyEmail}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="verificationCode"
                    placeholder="Entrez le code à 10 chiffres"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={10}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          )}
        </CardContent>
        {!isVerified && (
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={handleVerifyEmail} disabled={isVerifying || !verificationCode.trim()} className="w-full">
              {isVerifying ? "Vérification en cours..." : "Vérifier"}
            </Button>
            <div className="flex items-center justify-center w-full">
              <Button variant="ghost" onClick={handleResendCode} disabled={countdown > 0} className="text-sm">
                {countdown > 0 ? (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Renvoyer le code dans {countdown}s
                  </span>
                ) : (
                  "Renvoyer le code"
                )}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
