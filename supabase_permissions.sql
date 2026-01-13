-- 1. Habilitar eliminación para administradores en la tabla 'profiles'
-- Esto soluciona el error "No se pudo eliminar"
CREATE POLICY "Admins can delete profiles" 
ON public.profiles
FOR DELETE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. (Opcional pero recomendado) Eliminar también la cuenta de acceso (Auth)
-- Si no ejecutas esto, el usuario se borra de la lista pero podría seguir logueándose.
-- Copia y ejecuta esto también:

CREATE OR REPLACE FUNCTION public.handle_delete_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_profile_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_delete_user();
