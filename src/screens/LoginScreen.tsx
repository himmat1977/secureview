import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Input, Button } from '../components/common';
import { theme } from '../theme';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

// Eye icon component (simplified SVG representation)
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={{ fontSize: 20, color: theme.colors.textSecondary }}>
    {visible ? '👁️' : '👁️‍🗨️'}
  </Text>
);

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: email,
        password: password,
      });

      // Handle successful login
      console.log('Login response:', JSON.stringify(response, null, 2));

      // The API might return token in different formats, check all possibilities
      const token = response.token ||
                    response.access_token ||
                    response.data?.token ||
                    response.data?.access_token ||
                    (typeof response === 'string' ? response : null);

      console.log('Extracted token:', token ? 'Token found' : 'No token found');

      if (token) {
        // Use auth context to login - this will automatically trigger navigation
        await login(token, response.user || response.data?.user);
      } else {
        Alert.alert('Error', 'No authentication token received. Please check the API response in logs.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert('Forgot Password', 'This feature will be implemented next');
  };

  const handleContactSupport = () => {
    // TODO: Navigate to support screen or open email
    Alert.alert('Contact Support', 'Support contact will be implemented');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoIcon}>🛡️</Text>
              </View>
            </View>
            <Text style={styles.title}>SecureView</Text>
            <Text style={styles.subtitle}>Access your security cameras</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              rightIcon={<EyeIcon visible={showPassword} />}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Button
              title="Sign in"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInButton}
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help? </Text>
            <TouchableOpacity onPress={handleContactSupport} activeOpacity={0.7}>
              <Text style={styles.contactSupportText}>Contact support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl'],
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#5FBB97',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  signInButton: {
    marginTop: theme.spacing.lg,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.base,
    color: '#5FBB97',
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  contactSupportText: {
    fontSize: theme.typography.fontSize.base,
    color: '#5FBB97',
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
