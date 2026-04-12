import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from '../components/LoginCard';
import { useIsAuthenticated } from '../hooks/useAuth';

export default function LoginPage() {
  const isAuthed = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) navigate('/dashboard', { replace: true });
  }, [isAuthed, navigate]);

  return <LoginCard />;
}
