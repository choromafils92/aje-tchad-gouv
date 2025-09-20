import { Card, CardContent } from "@/components/ui/card";
import directeurImage from "@/assets/directeur-aje.jpg";

const DirectorMessage = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Photo du Directeur */}
                <div className="relative">
                  <div className="aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <img
                      src={directeurImage}
                      alt="MAHAMAT TADJADINE - Directeur de l'Agence Judiciaire de l'État"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message du Directeur */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                        Mot du Directeur
                      </h2>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        MAHAMAT TADJADINE
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">
                        Directeur Général de l'Agence Judiciaire de l'État
                      </p>
                    </div>

                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        "L'Agence Judiciaire de l'État du Tchad s'engage résolument dans sa mission de défense des intérêts de notre nation avec la plus grande rigueur et le plus haut niveau de professionnalisme."
                      </p>
                      
                      <p>
                        "Depuis notre création, nous œuvrons sans relâche pour garantir que l'État du Tchad soit représenté avec excellence dans toutes les procédures juridiques, tout en accompagnant nos administrations publiques par des conseils juridiques de qualité."
                      </p>
                      
                      <p>
                        "Notre équipe de juristes expérimentés met son expertise au service de la protection du patrimoine public et de la défense de la souveraineté nationale. Nous restons déterminés à servir notre pays avec <strong>Justice, Équité et Honneur</strong>."
                      </p>
                      
                      <p className="italic">
                        "Ensemble, construisons un système juridique fort au service du développement du Tchad."
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <img 
                            src="/src/assets/logo-aje.svg" 
                            alt="Logo AJE"
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-primary">Agence Judiciaire de l'État</p>
                          <p className="text-sm text-muted-foreground">République du Tchad</p>
                        </div>
                      </div>
                    </div>
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