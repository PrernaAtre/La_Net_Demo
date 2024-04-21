import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated:()=>{};
  login : () => void;
  logout : () => void;
  // setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// const AuthContext = createContext<AuthContextType>({
//   isLoggedIn: false,
//   setIsLoggedIn: () => {},
// });
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const login_user = localStorage.getItem('user');
    if (login_user) {
      const parsedResponse = JSON.parse(login_user); //what's probleam?
      if (parsedResponse.email) {
        setIsAuthenticated(true);
      }
    }
  }, [isAuthenticated]); //dependency ma  

  
  const login = () =>{
      setIsAuthenticated(true);
  }

  const logout = () =>{
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{isAuthenticated ,login, logout}}>
      {children}
    </AuthContext.Provider>
  ); 
}

// export const AuthProvider : React.FC = ()=> {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    
//     // Check if user is logged in when the component mounts
//     useEffect(() => {
      
//       if (login_user._id) {
//         setIsLoggedIn(true);
//       }
//     }, []);
//     return (
//         <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//           {children}
//         </AuthContext.Provider>
//       );
// }
// export const useAuth = () => useContext(AuthContext);