import { Card, CardContent } from "@/components/ui/card";
import directeurImage from "@/assets/directeur-aje.png";

const DirectorMessage = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="space-y-8">

                {/* Contenu principal avec photo flottante */}
                <div className="relative">
                  {/* Photo du Directeur - Flottante */}
                  <div className="float-left mr-8 mb-6 w-64 flex-shrink-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={directeurImage}
                        alt="MAHAMAT TADJADINE - Directeur de l'Agence Judiciaire de l'État"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4 text-center space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Agent Judiciaire de l'État
                      </p>
                      <h3 className="text-2xl font-bold text-foreground whitespace-nowrap">
                        MAHAMAT TADJADINE
                      </h3>
                    </div>
                  </div>

                  {/* Message du Directeur */}
                  <div className="text-foreground leading-relaxed space-y-4">
                    <p className="text-lg">
                      "L'Agence Judiciaire de l'État du Tchad s'engage résolument dans sa mission de défense des intérêts de notre nation avec la plus grande rigueur et le plus haut niveau de professionnalisme."
                    </p>
                    
                    <p>
                      "Depuis notre création, nous œuvrons sans relâche pour garantir que l'État du Tchad soit représenté avec excellence dans toutes les procédures juridiques, tout en accompagnant nos administrations publiques par des conseils juridiques de qualité."
                    </p>
                    
                    <p>
                      "Notre équipe de juristes expérimentés met son expertise au service de la protection du patrimoine public et de la défense de la souveraineté nationale. Nous restons déterminés à servir notre pays avec <strong>Conseiller-Defendre-Proteger</strong>."
                    </p>
                    
                    <p className="italic">
                      "Ensemble, construisons un système juridique fort au service du développement du Tchad."
                    </p>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;