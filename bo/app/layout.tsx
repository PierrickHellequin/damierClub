export const metadata = { title: 'Damier Club', description: 'Portail membres' };

import './globals.css';
import 'antd/dist/reset.css';
import ClientRoot from '../components/ClientRoot';
import LayoutShell from '../components/LayoutShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClientRoot>
          <LayoutShell>{children}</LayoutShell>
        </ClientRoot>
      </body>
    </html>
  );
}
