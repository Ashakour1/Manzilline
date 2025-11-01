"use client"

import { Home, Users, MapPin, TrendingUp } from "lucide-react"

const stats = [
  { icon: Home, label: "Properties Listed", value: "25,000+" },
  { icon: Users, label: "Active Users", value: "150,000+" },
  { icon: MapPin, label: "Cities Covered", value: "250+" },
  { icon: TrendingUp, label: "Success Rate", value: "98%" },
]

export default function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-primary/5 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
