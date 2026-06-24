// Ambient type declarations for packages not yet fully installed
// These silence IDE errors and will be superseded once node_modules is complete

declare module 'react' {
  export * from 'react';
  export default React;
  const React: any;
  export function useState<T>(init: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(init: T): { current: T };
  export function useContext<T>(ctx: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export type ReactNode = any;
  export type Context<T> = any;
  namespace React {
    type ReactNode = any;
    type Context<T> = any;
  }
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const Alert: any;
  export const ActivityIndicator: any;
  export const KeyboardAvoidingView: any;
  export const Platform: any;
  export const Modal: any;
  export const Animated: any;
  export const Dimensions: any;
  export const FlatList: any;
  export const Image: any;
  export const Pressable: any;
  export const ImageBackground: any;
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module '@expo/vector-icons' {
  export const Ionicons: any;
  export const MaterialIcons: any;
  export const FontAwesome: any;
  export const AntDesign: any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaView: any;
  export const SafeAreaProvider: any;
  export function useSafeAreaInsets(): any;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  export default AsyncStorage;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export function useNavigation(): any;
  export function useRoute(): any;
}

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator(): any;
  export type NativeStackNavigationProp<T, K extends keyof T = keyof T> = any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator(): any;
}

declare module 'expo-status-bar' {
  export const StatusBar: any;
}

declare module 'expo-camera' {
  export const Camera: any;
  export const CameraView: any;
}

declare module 'expo-barcode-scanner' {
  export const BarCodeScanner: any;
}
