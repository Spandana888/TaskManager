import { useAuth } from "../hooks/useAuth";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
//import { Button } from '@rneui/themed';
import { Button } from "../../.rnstorybook/stories/Button"
import { useTranslation } from "react-i18next";

export default function SignOut(){
    const { signOut } = useAuth()
    const { t } = useTranslation()
    return(
         <View style= {styles.container}>
           <Text style={styles.title}>{t("signOutSuccess")}</Text>
            <Text style={styles.subTitle}>{t("signInWelcomeMessage")}</Text>
             <Button
                label = {t("signIn")}
                onPress={signOut}
              />
         </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 200 },
  subTitle : {
    fontSize: 22, 
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});