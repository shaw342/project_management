import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-[100%]">
      <Navbar />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Bienvenue sur notre sit
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Découvrez nos services et notre expertise. Cette barre de navigation responsive s'adapte à tous les
              écrans.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-lg bg-muted p-8">Contenu de la page...</div>
          </div>
        </section>
      </main>
    </div>
  )
}