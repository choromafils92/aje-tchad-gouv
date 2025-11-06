-- Table pour les missions principales avec support multilingue
CREATE TABLE IF NOT EXISTS missions_principales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- 'representation', 'conseil', 'contentieux'
  
  -- Titres multilingues
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  
  -- Descriptions courtes multilingues
  description_fr TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  
  -- Contenu détaillé multilingue (HTML/Markdown supporté)
  content_fr TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  
  -- Détails d'intervention (JSONB pour flexibilité)
  details_fr JSONB DEFAULT '[]'::jsonb,
  details_ar JSONB DEFAULT '[]'::jsonb,
  details_en JSONB DEFAULT '[]'::jsonb,
  
  -- Métadonnées
  icon_name TEXT DEFAULT 'Scale',
  color_class TEXT DEFAULT 'bg-primary/10 text-primary',
  ordre INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  
  -- Audit
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_missions_principales_code ON missions_principales(code);
CREATE INDEX IF NOT EXISTS idx_missions_principales_ordre ON missions_principales(ordre);
CREATE INDEX IF NOT EXISTS idx_missions_principales_published ON missions_principales(published);

-- RLS Policies
ALTER TABLE missions_principales ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les missions publiées
CREATE POLICY "Anyone can view published missions"
  ON missions_principales
  FOR SELECT
  USING (published = true);

-- Admins peuvent tout gérer
CREATE POLICY "Admins can manage missions"
  ON missions_principales
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_missions_principales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER missions_principales_updated_at
  BEFORE UPDATE ON missions_principales
  FOR EACH ROW
  EXECUTE FUNCTION update_missions_principales_updated_at();

-- Données initiales
INSERT INTO missions_principales (code, title_fr, title_ar, title_en, description_fr, description_ar, description_en, content_fr, content_ar, content_en, details_fr, details_ar, details_en, icon_name, color_class, ordre, created_by)
VALUES 
(
  'representation',
  'Représentation juridique et judiciaire',
  'التمثيل القانوني والقضائي',
  'Legal and Judicial Representation',
  'Plaider pour l''État, en demande comme en défense, devant juridictions nationales, internationales et arbitrales.',
  'الترافع نيابة عن الدولة، سواء كمدعية أو مدافعة، أمام المحاكم الوطنية والدولية والتحكيمية.',
  'Pleading for the State, as plaintiff or defendant, before national, international and arbitral courts.',
  '<h3>Mission de représentation juridique de l''État</h3><p>L''AJE assure la défense et la représentation de l''État du Tchad devant toutes les juridictions nationales et internationales. Cette mission cruciale garantit que les intérêts de l''État sont protégés dans tous les contentieux.</p><h4>Nos domaines d''action</h4><ul><li>Contentieux administratifs et fiscaux</li><li>Contentieux commerciaux et contractuels</li><li>Arbitrage national et international</li><li>Litiges devant les juridictions internationales</li></ul>',
  '<h3>مهمة التمثيل القانوني للدولة</h3><p>تضمن وكالة الدولة القضائية الدفاع عن جمهورية تشاد وتمثيلها أمام جميع المحاكم الوطنية والدولية. هذه المهمة الحاسمة تضمن حماية مصالح الدولة في جميع النزاعات.</p><h4>مجالات عملنا</h4><ul><li>النزاعات الإدارية والضريبية</li><li>النزاعات التجارية والتعاقدية</li><li>التحكيم الوطني والدولي</li><li>النزاعات أمام المحاكم الدولية</li></ul>',
  '<h3>State Legal Representation Mission</h3><p>The AJE ensures the defense and representation of the State of Chad before all national and international courts. This crucial mission guarantees that State interests are protected in all litigation.</p><h4>Our areas of action</h4><ul><li>Administrative and tax litigation</li><li>Commercial and contractual disputes</li><li>National and international arbitration</li><li>Disputes before international courts</li></ul>',
  '["Représentation devant les juridictions civiles, commerciales, administratives et pénales", "Défense des intérêts de l''État dans les procédures d''arbitrage", "Intervention dans les contentieux constitutionnels", "Représentation devant les cours internationales", "Assistance dans les procédures d''exécution"]'::jsonb,
  '["التمثيل أمام المحاكم المدنية والتجارية والإدارية والجنائية", "الدفاع عن مصالح الدولة في إجراءات التحكيم", "التدخل في النزاعات الدستورية", "التمثيل أمام المحاكم الدولية", "المساعدة في إجراءات التنفيذ"]'::jsonb,
  '["Representation before civil, commercial, administrative and criminal courts", "Defense of State interests in arbitration procedures", "Intervention in constitutional disputes", "Representation before international courts", "Assistance in enforcement procedures"]'::jsonb,
  'Scale',
  'bg-primary/10 text-primary',
  1,
  (SELECT id FROM auth.users WHERE email ILIKE '%admin%' LIMIT 1)
),
(
  'conseil',
  'Conseil et assistance juridique',
  'المشورة والمساعدة القانونية',
  'Legal Advice and Assistance',
  'Avis juridiques, prévention des litiges, sécurisation des contrats et conventions publiques.',
  'الآراء القانونية، الوقاية من النزاعات، تأمين العقود والاتفاقيات العامة.',
  'Legal opinions, dispute prevention, securing public contracts and agreements.',
  '<h3>Mission de conseil aux administrations publiques</h3><p>L''AJE fournit un appui juridique aux ministères et organismes publics pour prévenir les litiges et sécuriser leurs actes.</p><h4>Services de conseil</h4><ul><li>Avis juridiques sur les projets de textes</li><li>Revue et validation des contrats publics</li><li>Conseil en marchés publics</li><li>Formation juridique des agents publics</li></ul>',
  '<h3>مهمة تقديم المشورة للإدارات العامة</h3><p>توفر وكالة الدولة القضائية الدعم القانوني للوزارات والهيئات العامة لمنع النزاعات وتأمين إجراءاتها.</p><h4>خدمات المشورة</h4><ul><li>الآراء القانونية حول مشاريع النصوص</li><li>مراجعة والتحقق من العقود العامة</li><li>المشورة في الصفقات العمومية</li><li>التدريب القانوني للموظفين العموميين</li></ul>',
  '<h3>Advisory Mission to Public Administrations</h3><p>The AJE provides legal support to ministries and public bodies to prevent disputes and secure their actions.</p><h4>Advisory Services</h4><ul><li>Legal opinions on draft texts</li><li>Review and validation of public contracts</li><li>Public procurement advice</li><li>Legal training for public officials</li></ul>',
  '["Avis juridiques sur les projets de lois et décrets", "Assistance dans la rédaction des contrats publics", "Conseil en marchés publics et PPP", "Formation juridique des agents", "Veille juridique et diffusion"]'::jsonb,
  '["الآراء القانونية حول مشاريع القوانين والمراسيم", "المساعدة في صياغة العقود العامة", "المشورة في الصفقات العمومية والشراكات", "التدريب القانوني للموظفين", "اليقظة القانونية والنشر"]'::jsonb,
  '["Legal opinions on draft laws and decrees", "Assistance in drafting public contracts", "Public procurement and PPP advice", "Legal training for staff", "Legal watch and dissemination"]'::jsonb,
  'Users',
  'bg-accent/10 text-accent',
  2,
  (SELECT id FROM auth.users WHERE email ILIKE '%admin%' LIMIT 1)
),
(
  'contentieux',
  'Recouvrement de créance contentieuse',
  'استرداد الديون المتنازع عليها',
  'Contentious Debt Recovery',
  'Assurer le recouvrement effectif des créances de l''État par des actions contentieuses et suivi rigoureux des procédures d''exécution.',
  'ضمان الاسترداد الفعلي لديون الدولة من خلال الإجراءات القضائية والمتابعة الصارمة لإجراءات التنفيذ.',
  'Ensuring effective recovery of State debts through contentious actions and rigorous monitoring of enforcement procedures.',
  '<h3>Mission de recouvrement des créances de l''État</h3><p>L''AJE coordonne et supervise l''ensemble du contentieux de recouvrement impliquant l''État du Tchad.</p><h4>Actions de recouvrement</h4><ul><li>Identification et évaluation des créances</li><li>Procédures de mise en demeure</li><li>Actions contentieuses de recouvrement</li><li>Suivi des procédures d''exécution</li></ul>',
  '<h3>مهمة استرداد ديون الدولة</h3><p>تنسق وكالة الدولة القضائية وتشرف على جميع نزاعات الاسترداد التي تشمل دولة تشاد.</p><h4>إجراءات الاسترداد</h4><ul><li>تحديد وتقييم الديون</li><li>إجراءات الإنذار</li><li>الإجراءات القضائية للاسترداد</li><li>متابعة إجراءات التنفيذ</li></ul>',
  '<h3>State Debt Recovery Mission</h3><p>The AJE coordinates and supervises all recovery litigation involving the State of Chad.</p><h4>Recovery Actions</h4><ul><li>Identification and evaluation of debts</li><li>Formal notice procedures</li><li>Contentious recovery actions</li><li>Monitoring enforcement procedures</li></ul>',
  '["Centralisation de tous les dossiers contentieux", "Suivi statistique et analyse des tendances", "Coordination avec les avocats externes", "Gestion des procédures d''urgence", "Exécution des décisions favorables"]'::jsonb,
  '["مركزية جميع ملفات النزاعات", "المتابعة الإحصائية وتحليل الاتجاهات", "التنسيق مع المحامين الخارجيين", "إدارة الإجراءات العاجلة", "تنفيذ القرارات المواتية"]'::jsonb,
  '["Centralization of all litigation files", "Statistical monitoring and trend analysis", "Coordination with external lawyers", "Management of urgent procedures", "Execution of favorable decisions"]'::jsonb,
  'FileText',
  'bg-secondary/50 text-foreground',
  3,
  (SELECT id FROM auth.users WHERE email ILIKE '%admin%' LIMIT 1)
)
ON CONFLICT (code) DO NOTHING;

-- Commentaire
COMMENT ON TABLE missions_principales IS 'Missions principales de l''AJE avec support multilingue complet (FR/AR/EN)';
