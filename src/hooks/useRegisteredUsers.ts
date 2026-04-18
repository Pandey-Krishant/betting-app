 'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/betting';

export const useRegisteredUsers = () => {
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('registeredUsers');
      if (data) {
        setRegisteredUsers(JSON.parse(data));
      }
    }
  }, []);

  const addUser = (user: User) => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const newUsers = [...users, user];
      localStorage.setItem('registeredUsers', JSON.stringify(newUsers));
      setRegisteredUsers(newUsers);
    }
  };

  const getTotalRegistered = () => registeredUsers.length;
  const getNew24h = () => registeredUsers.filter(u => {
    if (!u.createdAt) return false;
    const hours = (Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60);
    return hours < 24;
  }).length;

  return { registeredUsers, addUser, getTotalRegistered, getNew24h };
};

