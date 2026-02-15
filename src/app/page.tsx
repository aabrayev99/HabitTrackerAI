'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Spacer
} from "@heroui/react";
import NextLink from 'next/link';
import InlineChat from '@/components/chat/inline-chat';

export default function Home() {
  return (
    <div className="min-h-screen light text-foreground bg-background">
      {/* Header / Navbar */}
      <Navbar maxWidth="xl" position="sticky">
        <NavbarBrand>
          <NextLink href="/" className="font-bold text-inherit text-xl flex items-center gap-2">
            🎯 Трекер Привычек
          </NextLink>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {/* Menu items if any */}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link as={NextLink} href="/auth/signin">Войти</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={NextLink} href="/auth/signup" color="primary" variant="flat">
              Регистрация
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        <section className="flex flex-col items-center justify-center py-20 text-center space-y-8">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Создавайте полезные <span className="text-primary">привычки</span> с&nbsp;ИИ-помощником
            </h1>
            <p className="text-lg md:text-xl text-default-500 max-w-2xl mx-auto">
              Отслеживайте свой прогресс, получайте персональные советы от искусственного интеллекта
              и формируйте привычки, которые изменят вашу жизнь к лучшему.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                as={NextLink}
                href="/auth/signup"
                color="primary"
                size="lg"
                className="font-semibold shadow-lg shadow-indigo-500/20"
              >
                Начать бесплатно
              </Button>
              <Button
                as={NextLink}
                href="/auth/signin"
                variant="bordered"
                color="primary"
                size="lg"
              >
                Уже есть аккаунт
              </Button>
            </div>
          </div>
        </section>

        <Divider className="my-10" />

        {/* Features */}
        <section className="py-12">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-wider text-sm mb-2">Возможности</h2>
            <p className="text-3xl font-bold">Всё необходимое для формирования привычек</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-4">
              <CardHeader className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary text-2xl">📊</div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">Отслеживание прогресса</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-default-500">
                  Ведите учёт выполнения привычек, следите за своими "стриками" и анализируйте прогресс.
                </p>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary text-2xl">🤖</div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">ИИ-консультант</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-default-500">
                  Получайте персональные советы, мотивацию и рекомендации новых привычек от ИИ.
                </p>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary text-2xl">📱</div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">Простота использования</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-default-500">
                  Интуитивный интерфейс, работающий на всех устройствах. Отмечайте привычки одним кликом.
                </p>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary text-2xl">📈</div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">Аналитика и статистика</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-default-500">
                  Подробная статистика выполнения, графики прогресса и insights для улучшения результатов.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Inline AI Consultant Section */}
        <section className="py-16">
          <Card className="bg-primary-50 dark:bg-primary-900/20 border-none shadow-none">
            <CardBody className="p-8 md:p-12 items-center text-center">
              <h2 className="text-2xl font-bold mb-6">Попробуйте ИИ-консультанта прямо сейчас</h2>
              <div className="w-full max-w-2xl bg-background rounded-xl shadow-sm p-2">
                <InlineChat />
              </div>
            </CardBody>
          </Card>
        </section>
      </main>

      <footer className="w-full flex items-center justify-center py-8 text-default-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Трекер Привычек. Все права защищены.</p>
      </footer>
    </div>
  )
}
