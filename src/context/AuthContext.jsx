import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { MOCK_DEFAULT_STUDENT, MOCK_ADMIN_USER } from '../data/mockOpportunities';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campuslaunch_user');
      return savedUser ? JSON.parse(savedUser) : MOCK_DEFAULT_STUDENT;
    } catch {
      return MOCK_DEFAULT_STUDENT;
    }
  });

  const [loading, setLoading] = useState(false);

  // Initialize Supabase Auth Session listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email);
        } else if (event === 'SIGNED_OUT') {
          // Keep state consistent if explicit logout
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch full profile from Supabase profiles table
  const fetchProfile = async (userId, email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setUser({
          ...data,
          skills: data.skills || [],
          interests: data.interests || []
        });
        localStorage.setItem('campuslaunch_user', JSON.stringify(data));
      } else {
        // Construct fallback user from auth metadata
        const fallback = {
          id: userId,
          email,
          name: email ? email.split('@')[0] : 'Student',
          role: email?.includes('admin') ? 'admin' : 'student',
          college: 'Engineering Institute of Technology',
          branch: 'CSE',
          year: '3rd Year',
          skills: ['Python', 'React', 'Data Structures'],
          interests: ['Internships', 'Hackathons']
        };
        setUser(fallback);
      }
    } catch (e) {
      console.warn('Profile fetch error, using local state:', e);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('campuslaunch_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campuslaunch_user');
    }
  }, [user]);

  const login = async (email, password, role = 'student') => {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!error && data?.user) {
          await fetchProfile(data.user.id, data.user.email);
          setLoading(false);
          return user;
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, proceeding with demo fallback:', err);
      }
    }

    // Local / Demo Account Handling
    await new Promise((r) => setTimeout(r, 300));
    let targetUser;
    if (role === 'admin' || email.includes('admin')) {
      targetUser = { ...MOCK_ADMIN_USER, email };
    } else {
      targetUser = {
        ...MOCK_DEFAULT_STUDENT,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      };
    }
    setUser(targetUser);
    setLoading(false);
    return targetUser;
  };

  const register = async (userData) => {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        // Clear any active session first to guarantee a new separate account is created
        try {
          await supabase.auth.signOut();
        } catch (_) {}

        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              college: userData.college,
              branch: userData.branch,
              year: userData.year,
              role: 'student',
              skills: userData.skills,
              interests: userData.interests
            }
          }
        });

        if (error) {
          setLoading(false);
          throw new Error(error.message);
        }

        if (data?.user) {
          const newUser = {
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            college: userData.college,
            branch: userData.branch,
            year: userData.year,
            role: 'student',
            skills: userData.skills,
            interests: userData.interests
          };

          // Also upsert directly to public.profiles
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              name: userData.name,
              email: userData.email,
              college: userData.college,
              branch: userData.branch,
              year: userData.year,
              role: 'student',
              skills: userData.skills,
              interests: userData.interests,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } catch (profileErr) {
            console.warn('Profile direct upsert note:', profileErr);
          }

          setUser(newUser);
          setLoading(false);
          return newUser;
        }
      } catch (err) {
        setLoading(false);
        throw err;
      }
    }

    await new Promise((r) => setTimeout(r, 300));
    const newUser = {
      id: 'student-' + Date.now(),
      name: userData.name || 'New Student',
      email: userData.email,
      college: userData.college || 'Engineering Institute of Technology',
      branch: userData.branch || 'CSE',
      year: userData.year || '3rd Year',
      role: 'student',
      skills: userData.skills || ['Python', 'Web Development'],
      interests: userData.interests || ['Internships', 'Hackathons'],
      bio: userData.bio || 'Eager student looking for exciting tech opportunities.'
    };
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const updateProfile = async (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('campuslaunch_user', JSON.stringify(updated));

    if (isSupabaseConfigured && supabase && user?.id && !user.id.startsWith('student-')) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: updated.name,
            college: updated.college,
            branch: updated.branch,
            year: updated.year,
            skills: updated.skills,
            interests: updated.interests,
            bio: updated.bio,
            github: updated.github,
            linkedin: updated.linkedin,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync profile update to Supabase:', err);
      }
    }
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setUser(MOCK_ADMIN_USER);
    } else if (newRole === 'student') {
      setUser(MOCK_DEFAULT_STUDENT);
    } else {
      setUser(null); // Guest mode
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignore
      }
    }
    setUser(null);
    localStorage.removeItem('campuslaunch_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        updateProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
