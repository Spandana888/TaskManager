import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Role = "ROLE_MEMBER" | "ROLE_ADMIN" | null;

type AuthContextType = {
    email: string | null;
    role: Role;
    loading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    email: null,
    role: null,
    loading: true,
    signIn: async() => { },
    signOut: async () => { },
});

type AuthProviderProps = {
  children: ReactNode;  // ✅ define children type
};

const STORAGE_ROLE_KEY = '@user_role';
const STORAGE_EMAIL_KEY = '@user_email';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(null)
    const [loading, setLoading] = useState(true);

     // Check stored session on app start
  useEffect(() => {
    (async () => {
      try {
        const savedRole = await AsyncStorage.getItem(STORAGE_ROLE_KEY);
        const savedEmail = await AsyncStorage.getItem(STORAGE_EMAIL_KEY);
        if (savedRole) setRole(savedRole as Role);
        if (savedEmail) setEmail(savedEmail);
      } catch (err) {
        console.warn('Error loading auth state', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

   const signIn = async (email: string) => {
    const lowerEmail =  email.toLowerCase();
    const userRole = lowerEmail.includes('.admin') ? 'ROLE_ADMIN' : 'ROLE_MEMBER';
    setRole(userRole);
    setEmail(email);
    await AsyncStorage.setItem(STORAGE_ROLE_KEY, userRole);
    await AsyncStorage.setItem(STORAGE_EMAIL_KEY, email);
  };

  const signOut = async () => {
    setEmail(null)
    setRole(null);
    await AsyncStorage.multiRemove([STORAGE_EMAIL_KEY, STORAGE_ROLE_KEY]);
  };

    return (
        <AuthContext.Provider value={{ role, email, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuthContext = () => useContext(AuthContext);
