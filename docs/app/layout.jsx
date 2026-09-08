import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    template: '%s | SheraTutor Documentation',
    default: 'SheraTutor Documentation Portal',
  },
  description: 'Enterprise Documentation & AI Engineering Portal for SheraTutor (শেরাটউটর)',
  applicationName: 'SheraTutor Docs',
  icons: {
    icon: '/Sheratutor/assets/icon-badge.svg',
  },
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/Sheratutor/assets/icon-badge.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Layout
          navbar={
            <Navbar
              logo={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <img src="/Sheratutor/assets/icon-badge.svg" alt="SheraTutor Logo" width="28" height="28" />
                  <span>SheraTutor <span style={{ opacity: 0.65, fontWeight: 'normal', fontSize: '0.9rem' }}>Docs</span></span>
                </div>
              }
              projectLink="https://github.com/CodeStorm-Hub/Sheratutor"
            />
          }
          footer={
            <Footer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center', width: '100%', fontSize: '0.85rem' }}>
                <div>© {new Date().getFullYear()} SheraTutor (শেরাটউটর). Built for Bangladesh Secondary & Higher Secondary Education.</div>
                <div style={{ opacity: 0.7 }}>Powered by Nextra v4 & Next.js 16 App Router. Deployed on GitHub Pages.</div>
              </div>
            </Footer>
          }
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/CodeStorm-Hub/Sheratutor/tree/docs/docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
