import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Дополнительная логика, если необходимо
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/habits/:path*', '/chat/:path*']
}