import { CompanyAccount } from '../types';
import { INITIAL_COMPANIES } from '../data/mockData';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const STORAGE_KEY = 'premier_pms_companies_v3';

export function getStoredCompanies(): CompanyAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read stored companies from localStorage:', e);
  }
  return INITIAL_COMPANIES;
}

export async function saveCompanyToStorage(company: CompanyAccount): Promise<CompanyAccount[]> {
  const current = getStoredCompanies();
  const index = current.findIndex(c => c.companyId.toUpperCase() === company.companyId.toUpperCase());
  let updated: CompanyAccount[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = company;
  } else {
    updated = [company, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save companies to localStorage:', e);
  }

  // Also sync to Firestore
  try {
    await setDoc(doc(db, 'companies', company.companyId), {
      ...company,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Note: Firestore company sync note:', e);
  }

  return updated;
}

export function validateCompanyAndCode(companyIdInput: string, registrationCodeInput: string): {
  isValid: boolean;
  company?: CompanyAccount;
  errorMessage?: string;
} {
  const cleanId = (companyIdInput || '').trim().toUpperCase();
  const cleanCode = (registrationCodeInput || '').trim().toUpperCase();

  if (!cleanId) {
    return { isValid: false, errorMessage: 'Please enter your assigned Company Number (e.g. CMP-8002).' };
  }
  if (!cleanCode) {
    return { isValid: false, errorMessage: 'Please enter the practice Registration Security Code provided by your Application Owner team.' };
  }

  const companies = getStoredCompanies();
  const found = companies.find(c => c.companyId.toUpperCase() === cleanId);

  if (!found) {
    return { 
      isValid: false, 
      errorMessage: `Company Number "${cleanId}" was not found in the application registry. Please contact your Application Owner team.` 
    };
  }

  const expectedCode = (found.registrationCode || '').trim().toUpperCase();
  if (cleanCode !== expectedCode) {
    return { 
      isValid: false, 
      company: found,
      errorMessage: `Invalid Security Code for ${found.companyName} (${cleanId}). Please verify the registration code issued by your Application Owner team.` 
    };
  }

  return {
    isValid: true,
    company: found
  };
}

export interface RegisteredUserProfile {
  id: string;
  userNumber: string;
  companyId: string;
  companyName: string;
  name: string;
  email: string;
  title: string;
  role: any;
  avatar: string;
  npiNumber: string;
  isLoggedIn: boolean;
  phone?: string;
  taxIdEin?: string;
  category?: string;
}

const USERS_STORAGE_KEY = 'premier_pms_users_v3';

export function getStoredUsers(): RegisteredUserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read stored users from localStorage:', e);
  }
  return [];
}

export async function saveUserToStorage(user: RegisteredUserProfile): Promise<RegisteredUserProfile[]> {
  const current = getStoredUsers();
  const index = current.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase() || u.id === user.id);
  let updated: RegisteredUserProfile[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = user;
  } else {
    updated = [user, ...current];
  }

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save user to localStorage:', e);
  }

  try {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Firestore user sync note:', e);
  }

  return updated;
}
