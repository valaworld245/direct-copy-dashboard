CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  owner TEXT,
  lifetime_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_contacts auth all" ON public.crm_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_crm_contacts_updated BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'qualification',
  amount NUMERIC NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 0,
  expected_close DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_deals TO authenticated;
GRANT ALL ON public.crm_deals TO service_role;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_deals auth all" ON public.crm_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_crm_deals_updated BEFORE UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  country TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads auth all" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer TEXT NOT NULL,
  product TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders auth all" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'unpaid',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices auth all" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer TEXT NOT NULL,
  plan TEXT NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  renews_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions auth all" ON public.subscriptions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL UNIQUE,
  product TEXT NOT NULL,
  customer TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  license_type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'active',
  expires_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.licenses TO authenticated;
GRANT ALL ON public.licenses TO service_role;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "licenses auth all" ON public.licenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_licenses_updated BEFORE UPDATE ON public.licenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  requester TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_tickets auth all" ON public.support_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_support_tickets_updated BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  product TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'requested',
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_requests auth all" ON public.demo_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_demo_requests_updated BEFORE UPDATE ON public.demo_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  spend NUMERIC NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_campaigns TO authenticated;
GRANT ALL ON public.marketing_campaigns TO service_role;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "marketing_campaigns auth all" ON public.marketing_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_marketing_campaigns_updated BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.crm_contacts (company, contact_name, email, phone, stage, owner, lifetime_value) VALUES
 ('Nova Retail Pvt Ltd','Anil Verma','anil@novaretail.in','+91 98110 44521','customer','Priya Sharma',480000),
 ('BlueWave Logistics','Sara Khan','sara@bluewave.co','+91 99870 11234','negotiation','Rahul Nair',260000),
 ('Sunrise Clinics','Dr. Meera Iyer','meera@sunriseclinics.in','+91 98450 77123','qualified','Priya Sharma',150000),
 ('Orbit EdTech','Vikram Rao','vikram@orbitedtech.com','+91 90000 22110','new','Aman Gupta',0),
 ('GreenLeaf Foods','Nisha Patel','nisha@greenleaf.in','+91 91234 88990','customer','Rahul Nair',720000);

INSERT INTO public.crm_deals (contact_id, title, stage, amount, probability, expected_close)
SELECT id, company || ' — ERP Rollout', 'proposal', 350000, 60, CURRENT_DATE + 21 FROM public.crm_contacts WHERE company = 'Nova Retail Pvt Ltd';
INSERT INTO public.crm_deals (contact_id, title, stage, amount, probability, expected_close)
SELECT id, company || ' — Fleet Tracking', 'negotiation', 180000, 45, CURRENT_DATE + 14 FROM public.crm_contacts WHERE company = 'BlueWave Logistics';
INSERT INTO public.crm_deals (contact_id, title, stage, amount, probability, expected_close)
SELECT id, company || ' — Clinic Suite', 'qualification', 95000, 25, CURRENT_DATE + 40 FROM public.crm_contacts WHERE company = 'Sunrise Clinics';
INSERT INTO public.crm_deals (contact_id, title, stage, amount, probability, expected_close)
SELECT id, company || ' — Annual Renewal', 'closed_won', 240000, 100, CURRENT_DATE - 5 FROM public.crm_contacts WHERE company = 'GreenLeaf Foods';

INSERT INTO public.leads (full_name, email, phone, source, country, score, status, assigned_to) VALUES
 ('Karan Mehta','karan.mehta@gmail.com','+91 98200 33445','website','India',82,'qualified','Priya Sharma'),
 ('Emily Carter','emily.carter@outlook.com','+1 415 555 0132','google_ads','United States',67,'contacted','Aman Gupta'),
 ('Mohammed Aziz','m.aziz@zohomail.com','+971 50 221 8890','referral','UAE',91,'qualified','Rahul Nair'),
 ('Linh Nguyen','linh.nguyen@vnmail.com','+84 90 112 3344','instagram','Vietnam',44,'new','Unassigned'),
 ('Tanvi Joshi','tanvi.joshi@yahoo.in','+91 99991 20302','whatsapp','India',58,'contacted','Priya Sharma'),
 ('David Cohen','david@cohenlabs.io','+972 52 445 1122','linkedin','Israel',73,'nurturing','Aman Gupta');

INSERT INTO public.orders (order_number, customer, product, amount, payment_status, status) VALUES
 ('SV-ORD-1001','Nova Retail Pvt Ltd','Vala ERP — Growth',350000,'paid','delivered'),
 ('SV-ORD-1002','GreenLeaf Foods','Vala CRM — Pro',240000,'paid','delivered'),
 ('SV-ORD-1003','BlueWave Logistics','Fleet Tracker Add-on',180000,'partial','processing'),
 ('SV-ORD-1004','Sunrise Clinics','Clinic Suite — Starter',95000,'pending','processing'),
 ('SV-ORD-1005','Orbit EdTech','LMS Module',60000,'pending','on_hold');

INSERT INTO public.invoices (invoice_number, customer, amount, tax, status, due_date) VALUES
 ('SV-INV-2001','Nova Retail Pvt Ltd',350000,63000,'paid',CURRENT_DATE - 12),
 ('SV-INV-2002','GreenLeaf Foods',240000,43200,'paid',CURRENT_DATE - 4),
 ('SV-INV-2003','BlueWave Logistics',180000,32400,'partial',CURRENT_DATE + 6),
 ('SV-INV-2004','Sunrise Clinics',95000,17100,'unpaid',CURRENT_DATE + 15),
 ('SV-INV-2005','Orbit EdTech',60000,10800,'overdue',CURRENT_DATE - 3);

INSERT INTO public.subscriptions (customer, plan, billing_cycle, amount, status, renews_on) VALUES
 ('Nova Retail Pvt Ltd','ERP Growth','yearly',350000,'active',CURRENT_DATE + 180),
 ('GreenLeaf Foods','CRM Pro','yearly',240000,'active',CURRENT_DATE + 320),
 ('BlueWave Logistics','Fleet Standard','monthly',15000,'active',CURRENT_DATE + 12),
 ('Sunrise Clinics','Clinic Starter','monthly',7900,'trialing',CURRENT_DATE + 5),
 ('Orbit EdTech','LMS Basic','monthly',5000,'past_due',CURRENT_DATE - 2);

INSERT INTO public.licenses (license_key, product, customer, seats, license_type, status, expires_on) VALUES
 ('SV-ERP-NOVA-4471','Vala ERP','Nova Retail Pvt Ltd',50,'enterprise','active',CURRENT_DATE + 180),
 ('SV-CRM-GRLF-8823','Vala CRM','GreenLeaf Foods',25,'business','active',CURRENT_DATE + 320),
 ('SV-FLT-BLUE-1290','Fleet Tracker','BlueWave Logistics',10,'standard','active',CURRENT_DATE + 12),
 ('SV-CLN-SUNR-6612','Clinic Suite','Sunrise Clinics',5,'trial','trial',CURRENT_DATE + 5),
 ('SV-LMS-ORBT-3345','Vala LMS','Orbit EdTech',15,'standard','suspended',CURRENT_DATE - 2);

INSERT INTO public.support_tickets (ticket_number, subject, requester, priority, status, assigned_agent) VALUES
 ('SV-TCK-3001','Invoice PDF not generating','Anil Verma','high','open','Sneha Rao'),
 ('SV-TCK-3002','Add 10 more seats to CRM plan','Nisha Patel','medium','in_progress','Sneha Rao'),
 ('SV-TCK-3003','GPS sync delay on fleet module','Sara Khan','urgent','in_progress','Imran Ali'),
 ('SV-TCK-3004','Trial extension request','Dr. Meera Iyer','low','resolved','Imran Ali'),
 ('SV-TCK-3005','License suspended after payment','Vikram Rao','urgent','open','Sneha Rao');

INSERT INTO public.demo_requests (company, contact_name, product, scheduled_at, status, outcome) VALUES
 ('Orbit EdTech','Vikram Rao','Vala LMS', now() + interval '2 days','scheduled',NULL),
 ('Sunrise Clinics','Dr. Meera Iyer','Clinic Suite', now() - interval '3 days','completed','converted to trial'),
 ('Metro Builders','Rohit Sinha','Vala ERP', now() + interval '5 days','scheduled',NULL),
 ('Cafe Aroma Chain','Pooja Desai','POS Suite', now() - interval '8 days','completed','needs pricing revision'),
 ('Skyline Travels','Arjun Bhatia','Booking Engine', NULL,'requested',NULL);

INSERT INTO public.marketing_campaigns (name, channel, budget, spend, leads, conversions, status) VALUES
 ('Q3 ERP Push','google_ads',300000,214500,412,38,'active'),
 ('Clinic Suite Launch','meta_ads',150000,132000,268,21,'active'),
 ('LinkedIn ABM — Logistics','linkedin',200000,88000,96,12,'active'),
 ('Festive Retail Offer','whatsapp',80000,80000,540,64,'completed'),
 ('SEO Content Engine','organic',120000,54000,310,29,'active');