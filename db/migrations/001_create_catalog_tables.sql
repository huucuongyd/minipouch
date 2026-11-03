-- NuBeNa catalog schema. Applied only via `npm run db:migrate` (no auto-sync).

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_label_nonempty CHECK (length(trim(label)) > 0)
);

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  category_id text NOT NULL REFERENCES categories (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  description text NOT NULL DEFAULT '',
  cover_image text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_name_nonempty CHECK (length(trim(name)) > 0)
);

CREATE INDEX products_category_id_idx ON products (category_id);
CREATE INDEX products_sort_order_idx ON products (sort_order, id);

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TABLE product_images (
  id bigserial PRIMARY KEY,
  product_id text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_images_url_nonempty CHECK (length(trim(url)) > 0),
  CONSTRAINT product_images_product_url_unique UNIQUE (product_id, url)
);

CREATE INDEX product_images_product_id_idx ON product_images (product_id, sort_order, id);

CREATE TABLE site_socials (
  platform text PRIMARY KEY,
  url text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_socials_platform_nonempty CHECK (length(trim(platform)) > 0)
);

CREATE TRIGGER site_socials_set_updated_at
BEFORE UPDATE ON site_socials
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();
