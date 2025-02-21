import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

const LOCAL_STORAGE_KEY = "news&blogs_currUser";

export const AuthProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Failed to parse cached user:", err);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        setCurrUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const signup = async (name, email, password, image, icon) => {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Update profile with name
      await updateProfile(user, {
        displayName: name,
      });

      // 3. Add user data to Firestore - Use user.uid as document ID
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        image: image || icon,
      });

      // 4. Update local state
      setCurrUser(user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));

      return <Navigate to="/" />;
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrUser(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Clear app-specific local storage data
  const clearAppStorage = useCallback(() => {
    const appKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("news&blogs_")
    );
    appKeys.forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currUser,
        login,
        signup,
        logout,
        error,
        isLoading,
        clearAppStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within AuthProvider");
  }
  return context;
};
