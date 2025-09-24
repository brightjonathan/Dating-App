'use server'

import { createClient } from "../superbase/server";

//getting the user for useability
export const getCurrentUserProfile = async()=>{
    const superbase = await createClient();
    
    const {data: {user}} = await superbase.auth.getUser();

    if (!user) {
        return null;
    }

    const {data: profile, error} = await superbase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();


    if (error) {
        console.log('Error fetching profiles:', error);
        return null;        
    };

    return profile;
};



export const uploadProfilePhoto = async(file: File)=> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(fileName);
  return { success: true, url: publicUrl };
}