import Header from "@/components/header"
import Footer from "@/components/footer"
import { CheckCircle, Users, Lightbulb, Globe } from "lucide-react"

export default function About() {
  const values = [
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a trustworthy community of renters and landlords.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly improving our platform with new features and technology.",
    },
    { icon: Globe, title: "Global Reach", description: "Expanding to serve renters worldwide with local expertise." },
    {
      icon: CheckCircle,
      title: "Trust & Safety",
      description: "Security and verification are at the heart of everything we do.",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <section className="py-20 md:py-28 bg-card border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About PropertyHub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              We're revolutionizing how people find and rent properties. Our mission is to make property hunting
              accessible, transparent, and secure for everyone.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Founded in 2020, PropertyHub started with a simple vision: make finding rental properties easier and
                  safer for everyone. What began as a small project has grown into a platform trusted by over 150,000
                  users.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that everyone deserves access to quality housing information and verified landlords. That's
                  why we're dedicated to creating a platform that's transparent, secure, and user-friendly.
                </p>
              </div>
              <div className="bg-primary/10 rounded-xl h-80 border border-border flex items-center justify-center">
                <img
                  src="/team-office-meeting.jpg"
                  alt="PropertyHub team"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="p-6 rounded-lg border border-border bg-card">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
