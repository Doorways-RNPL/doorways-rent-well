
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Initial Payment",
    description: "Tenant pays 50% of rent to landlord",
    amount: "50%",
    icon: "💰",
  },
  {
    id: 2,
    title: "Doorways Coverage",
    description: "Doorways covers remaining 50% to landlord",
    amount: "50%",
    icon: "🏠",
  },
  {
    id: 3,
    title: "Flexible Repayment",
    description: "Tenant repays Doorways in 3 easy installments",
    amount: "~16.7% × 3",
    icon: "📅",
  }
]

const PaymentJourney = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How Payments Work
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Simple, transparent payment process to make rent more manageable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="h-full p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-fade-in">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4 text-3xl">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">
                    {step.title}
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {step.amount}
                  </p>
                  <p className="text-white/70">
                    {step.description}
                  </p>
                </div>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 max-w-2xl mx-auto">
            With Doorways, you get immediate access to your new home while spreading the upfront costs over time.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PaymentJourney
