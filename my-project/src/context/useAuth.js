import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // ✅ adjust path

export const useAuth = () => useContext(AuthContext);
