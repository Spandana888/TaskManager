import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { email, role, loading, signIn, signOut } = useAuthContext();
  return { email: email , role, loading, signIn, signOut };
};