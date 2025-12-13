-- Create table for gift receivers
CREATE TABLE public.gift_receivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  selected_box INTEGER NOT NULL,
  share_count INTEGER NOT NULL DEFAULT 0,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_receivers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for checking if device already participated)
CREATE POLICY "Allow public read access" 
ON public.gift_receivers 
FOR SELECT 
USING (true);

-- Allow anyone to insert (for new participants)
CREATE POLICY "Allow public insert" 
ON public.gift_receivers 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update their own record by device_id
CREATE POLICY "Allow public update by device_id" 
ON public.gift_receivers 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gift_receivers_updated_at
BEFORE UPDATE ON public.gift_receivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();