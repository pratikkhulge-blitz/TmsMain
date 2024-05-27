// LoginForm.tsx
import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6" action="#">
      <div className='text-left'>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your email</label>
        <Input type="email" placeholder="name@company.com" onChange={onChange} />
      </div>
      <div className='text-left'>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Password</label>
        <Input type="password" placeholder="••••••••" onChange={onChange} />
      </div>
      <Button type="submit">Sign in</Button>
    </form>
  );
};

export default LoginForm;
