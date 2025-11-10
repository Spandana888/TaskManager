
import './src/i18n/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppTabs from './src/navigation/AppTabs';


export default function App() {
  return(
    <AuthProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </AuthProvider>
  )
}

