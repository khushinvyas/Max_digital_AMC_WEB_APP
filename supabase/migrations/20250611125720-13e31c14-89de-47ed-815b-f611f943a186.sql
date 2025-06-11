-- Create enum for AMC types
CREATE TYPE public.amc_type AS ENUM ('A', 'B', 'C');

-- Create enum for customer status
CREATE TYPE public.customer_status AS ENUM ('active', 'proposed', 'expired', 'suspended', 'cancelled');

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amc_start_date DATE NOT NULL,
  amc_end_date DATE NOT NULL,
  amc_type amc_type NOT NULL,
  amc_amount DECIMAL(10,2) NOT NULL,
  product_description TEXT,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  invoice_amount DECIMAL(10,2) NOT NULL,
  status customer_status NOT NULL DEFAULT 'proposed',
  next_service_date DATE,
  last_service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT DEFAULT 'MAX Digital & Services',
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers table
CREATE POLICY "Users can view their own customers" 
  ON public.customers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
  ON public.customers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
  ON public.customers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint on invoice numbers per user
CREATE UNIQUE INDEX customers_invoice_number_user_id_idx ON public.customers (invoice_number, user_id);
