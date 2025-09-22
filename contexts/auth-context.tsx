"use client";

import { createClient } from "@/lib/superbase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode })=>{

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const superbase = createClient();
  const router = useRouter();

  useEffect(()=>{

    const checkUser = async()=>{
      try {
        const {data: { session } } = await superbase.auth.getSession();

        setUser(session?.user ?? null);
        console.log(session?.user);

        const { data: { subscription }} = superbase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();

      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };

    checkUser();

  }, []);


  const signOut = async () => {
  try {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) return; // cancel if user clicks "Cancel"

    await superbase.auth.signOut();
    router.push("/auth");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};


   return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
};


export const useAuth =()=> {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
