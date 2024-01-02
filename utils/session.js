
// components/withAuth.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();// Check if the user is authenticated

    React.useEffect(() => {
      if (!session) {
        router.push('/login'); // Redirect to login page if not authenticated
      }
    }, [session, router]);

    if (!session) {
      return <div>Redirecting...</div>; // You can show a loading indicator here
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;

