import UserNavigation from '@/components/user/UserNavigation';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <UserNavigation />
      <main>{children}</main>
    </div>
  );
}
