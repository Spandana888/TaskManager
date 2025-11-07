import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { role, loading, signIn, signOut } = useAuthContext();
  return { role, loading, signIn, signOut };
};