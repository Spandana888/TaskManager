import React, { Component, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../utlis/EmailValidation";
import { useTranslation } from "react-i18next";
import { Button } from '@rneui/themed';
import mockData from "../mock/data.json"

export default function SignIn() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, loading } = useAuth();
  const handleSignIn = async () => {
    setError(null);
    if (!email) {
      return setError(t("emailRequired"));
    }
    if (!isValidEmail) {
      return setError(t("Invalid email format"));
    }

    const userExists = mockData.users.some(
      (user: { email: string }) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!userExists) {
      return setError(t("emailNotFound"));
    }

    try {
      setIsSubmitting(true);
      signIn(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('taskManager')}</Text>
      <Text style = {styles.subTitle}> {t('signIn')} </Text>
      <TextInput
        style={styles.input}
        placeholder={t('emailPlaceholder')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          console.log("Typing:", text); 
          setEmail(text);
        }}
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={t('signIn')}
        onPress={handleSignIn}
        disabled={isSubmitting}
        color={"success"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 200 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle : {
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
