import { PageFrame } from '@/components/page-frame';
import { LoginForm } from '@/domain/auth/components/login-form';

export default function LoginPage() {
  return (
    <PageFrame>
      <LoginForm />
    </PageFrame>
  );
}
