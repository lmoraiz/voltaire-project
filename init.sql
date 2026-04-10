CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL,
  category TEXT NOT NULL
);

INSERT INTO products (name, price, stock, category)
VALUES
  ('Selle Enfant 100cm', 125.00, 5, 'Selles'),
  ('Selle Club Adulte 160cm', 850.00, 3, 'Selles'),
  ('Selle de Dressage Amortie', 1450.00, 2, 'Selles'),
  ('Étrier Métal Étoile 55cm', 45.00, 20, 'Étriers'),
  ('Étrier en Bois Vernis', 38.00, 15, 'Étriers'),
  ('Étrier Avion en Aluminium', 60.00, 10, 'Étriers'),
  ('Sangle de Sanglement (Double)', 15.00, 50, 'Accessoires'),
  ('Bec de Selle en Cuir', 22.00, 30, 'Accessoires'),
  ('Couvre-selle en Velours', 35.00, 25, 'Accessoires')
ON CONFLICT (name) DO NOTHING;