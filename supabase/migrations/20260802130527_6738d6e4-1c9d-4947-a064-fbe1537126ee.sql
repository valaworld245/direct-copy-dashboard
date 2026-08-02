
-- MARKETPLACE
CREATE TABLE public.marketplace_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_email text,
  country text,
  status text NOT NULL DEFAULT 'active',
  rating numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES public.marketplace_vendors(id) ON DELETE SET NULL,
  title text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  views int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  buyer_name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AFFILIATE
CREATE TABLE public.affiliate_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  affiliate_code text NOT NULL UNIQUE,
  email text,
  tier text NOT NULL DEFAULT 'bronze',
  status text NOT NULL DEFAULT 'active',
  clicks int NOT NULL DEFAULT 0,
  signups int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RESELLER
CREATE TABLE public.reseller_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  reseller_code text NOT NULL UNIQUE,
  masked_email text,
  region text,
  status text NOT NULL DEFAULT 'active',
  kyc_status text NOT NULL DEFAULT 'pending',
  commission_rate numeric NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.reseller_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  product text,
  value numeric NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.reseller_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  method text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- FRANCHISE
CREATE TABLE public.franchise_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  franchise_code text NOT NULL UNIQUE,
  territory text,
  owner_name text,
  status text NOT NULL DEFAULT 'active',
  monthly_target numeric NOT NULL DEFAULT 0,
  monthly_revenue numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.franchise_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  city text,
  value numeric NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- INFLUENCER
CREATE TABLE public.influencer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  handle text NOT NULL,
  platform text NOT NULL DEFAULT 'instagram',
  followers int NOT NULL DEFAULT 0,
  engagement_rate numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.influencer_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  budget numeric NOT NULL DEFAULT 0,
  conversions int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'running',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- SEO
CREATE TABLE public.seo_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  owner_team text,
  health_score int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.seo_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  position int NOT NULL DEFAULT 0,
  volume int NOT NULL DEFAULT 0,
  intent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS + RLS
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'marketplace_vendors','marketplace_listings','marketplace_orders',
    'affiliate_partners','affiliate_commissions',
    'reseller_accounts','reseller_leads','reseller_payouts',
    'franchise_accounts','franchise_leads',
    'influencer_profiles','influencer_campaigns',
    'seo_projects','seo_keywords'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "auth_read_%1$s" ON public.%1$I FOR SELECT TO authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "auth_write_%1$s" ON public.%1$I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- SEED
INSERT INTO public.marketplace_vendors (id, name, contact_email, country, status, rating) VALUES
 ('11111111-1111-4111-8111-000000000001','Nova Retail Systems','vendor1@softwarevala.com','India','active',4.7),
 ('11111111-1111-4111-8111-000000000002','BlueOcean SaaS','vendor2@softwarevala.com','UAE','active',4.4),
 ('11111111-1111-4111-8111-000000000003','Skyline EdTech','vendor3@softwarevala.com','Singapore','pending',4.1);

INSERT INTO public.marketplace_listings (id, vendor_id, title, category, price, status, views) VALUES
 ('22222222-2222-4222-8222-000000000001','11111111-1111-4111-8111-000000000001','Retail POS Pro','POS',49999,'published',1820),
 ('22222222-2222-4222-8222-000000000002','11111111-1111-4111-8111-000000000002','HRM Cloud Suite','HRM',89999,'published',960),
 ('22222222-2222-4222-8222-000000000003','11111111-1111-4111-8111-000000000003','School ERP Lite','Education',34999,'review',540),
 ('22222222-2222-4222-8222-000000000004','11111111-1111-4111-8111-000000000001','Restaurant POS Max','POS',74999,'published',1310);

INSERT INTO public.marketplace_orders (listing_id, buyer_name, amount, status) VALUES
 ('22222222-2222-4222-8222-000000000001','Sharma Retail Pvt Ltd',49999,'paid'),
 ('22222222-2222-4222-8222-000000000002','Gulf Logistics FZE',89999,'paid'),
 ('22222222-2222-4222-8222-000000000004','Curry House Group',74999,'pending'),
 ('22222222-2222-4222-8222-000000000001','Metro Mart',49999,'refunded');

INSERT INTO public.affiliate_partners (id, name, affiliate_code, email, tier, status, clicks, signups) VALUES
 ('33333333-3333-4333-8333-000000000001','Rahul Verma','AFF-RV01','rahul@partners.io','gold','active',12400,318),
 ('33333333-3333-4333-8333-000000000002','TechBlog Media','AFF-TBM2','media@techblog.com','silver','active',7300,142),
 ('33333333-3333-4333-8333-000000000003','Anita Singh','AFF-AS03','anita@partners.io','bronze','pending',1900,21);

INSERT INTO public.affiliate_commissions (partner_id, amount, status, reference) VALUES
 ('33333333-3333-4333-8333-000000000001',48200,'approved','ORD-9021'),
 ('33333333-3333-4333-8333-000000000001',15600,'pending','ORD-9044'),
 ('33333333-3333-4333-8333-000000000002',21300,'paid','ORD-8890'),
 ('33333333-3333-4333-8333-000000000003',3400,'pending','ORD-9101');

INSERT INTO public.reseller_accounts (id, name, reseller_code, masked_email, region, status, kyc_status, commission_rate) VALUES
 ('44444444-4444-4444-8444-000000000001','Mehta Solutions','RS-MEH01','me***@mehta.in','North India','active','verified',22),
 ('44444444-4444-4444-8444-000000000002','Coastal IT Partners','RS-CIP02','co***@coastal.in','South India','active','pending',20),
 ('44444444-4444-4444-8444-000000000003','Desert Tech LLC','RS-DTL03','de***@desert.ae','Middle East','suspended','verified',18);

INSERT INTO public.reseller_leads (reseller_id, client_name, product, value, stage) VALUES
 ('44444444-4444-4444-8444-000000000001','Grand Bazaar','Retail POS Pro',49999,'won'),
 ('44444444-4444-4444-8444-000000000001','Sunrise Clinic','HMS Suite',120000,'negotiation'),
 ('44444444-4444-4444-8444-000000000002','Ocean Foods','Restaurant POS Max',74999,'new'),
 ('44444444-4444-4444-8444-000000000003','Dune Motors','CRM Pro',65000,'lost');

INSERT INTO public.reseller_payouts (reseller_id, amount, status, method) VALUES
 ('44444444-4444-4444-8444-000000000001',110000,'paid','bank'),
 ('44444444-4444-4444-8444-000000000001',24500,'pending','upi'),
 ('44444444-4444-4444-8444-000000000002',18000,'pending','bank');

INSERT INTO public.franchise_accounts (id, name, franchise_code, territory, owner_name, status, monthly_target, monthly_revenue) VALUES
 ('55555555-5555-4555-8555-000000000001','Vala Delhi NCR','FR-DEL01','Delhi NCR','Karan Malhotra','active',1500000,1320000),
 ('55555555-5555-4555-8555-000000000002','Vala Bengaluru','FR-BLR02','Karnataka','Divya Rao','active',1200000,1410000),
 ('55555555-5555-4555-8555-000000000003','Vala Dubai','FR-DXB03','UAE','Omar Haddad','pending',900000,240000);

INSERT INTO public.franchise_leads (franchise_id, client_name, city, value, stage) VALUES
 ('55555555-5555-4555-8555-000000000001','Nirvana Hotels','Gurugram',260000,'negotiation'),
 ('55555555-5555-4555-8555-000000000002','GreenLeaf Schools','Bengaluru',180000,'won'),
 ('55555555-5555-4555-8555-000000000003','Marina Retail','Dubai',310000,'new');

INSERT INTO public.influencer_profiles (id, name, handle, platform, followers, engagement_rate, status) VALUES
 ('66666666-6666-4666-8666-000000000001','Priya Kapoor','@priyabuilds','instagram',420000,4.8,'active'),
 ('66666666-6666-4666-8666-000000000002','CodeWithArjun','@codewitharjun','youtube',180000,6.2,'active'),
 ('66666666-6666-4666-8666-000000000003','Sara Ali','@saratech','linkedin',96000,3.1,'paused');

INSERT INTO public.influencer_campaigns (influencer_id, title, budget, conversions, status) VALUES
 ('66666666-6666-4666-8666-000000000001','POS Launch Reels',250000,184,'running'),
 ('66666666-6666-4666-8666-000000000002','Dev Tools Review',180000,262,'completed'),
 ('66666666-6666-4666-8666-000000000003','B2B Thought Series',90000,41,'paused');

INSERT INTO public.seo_projects (id, domain, owner_team, health_score, status) VALUES
 ('77777777-7777-4777-8777-000000000001','softwarevala.com','Growth',86,'active'),
 ('77777777-7777-4777-8777-000000000002','pos.softwarevala.com','Product',72,'active'),
 ('77777777-7777-4777-8777-000000000003','careers.softwarevala.com','HR',64,'audit');

INSERT INTO public.seo_keywords (project_id, keyword, position, volume, intent) VALUES
 ('77777777-7777-4777-8777-000000000001','billing software india',4,22000,'commercial'),
 ('77777777-7777-4777-8777-000000000001','erp for small business',11,14800,'commercial'),
 ('77777777-7777-4777-8777-000000000002','restaurant pos software',6,9600,'transactional'),
 ('77777777-7777-4777-8777-000000000002','retail pos billing',18,7400,'commercial'),
 ('77777777-7777-4777-8777-000000000003','software jobs remote',27,31000,'informational');
