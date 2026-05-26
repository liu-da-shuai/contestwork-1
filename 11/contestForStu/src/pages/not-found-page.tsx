import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="md3-card p-6">
      <h1 className="text-2xl font-semibold text-card-foreground">页面不存在</h1>
      <p className="mt-2 text-sm text-muted-foreground">请返回首页继续访问系统功能。</p>
      <Link
        to="/"
        className="md3-button-filled mt-5 inline-flex"
      >
        返回首页
      </Link>
    </section>
  )
}
