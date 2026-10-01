import { PageFrame } from '@/components/page-frame';
import { SignUpFlow } from '@/domain/auth/components/sign-up-flow';

export default function SignUpPage() {
  return (
    <PageFrame>
      <SignUpFlow />
    </PageFrame>
  );
}
