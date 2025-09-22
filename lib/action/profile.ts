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

