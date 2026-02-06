import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { register as registerUser, login } from '@/services/auth.service'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { atomAuth } from '@/stores/auth'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

interface AuthForm {
  username?: string
  email: string
  password: string
}

function RouteComponent() {
  const navigate = useNavigate()
  const [,setAuth] = useAtom(atomAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthForm>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: AuthForm) => {
    try {
      setIsLoading(true)
      if (isSignUp) {
        await registerUser({
          username: data.username!,
          email: data.email,
          password: data.password
        })
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
        setIsSignUp(false)
        reset()
        return
      }
      const response = await login({
        email: data.email,
        password: data.password,
      })
      setAuth({
        user: response.user,
        token: response.accessToken
      })
      toast.success('Đăng nhập thành công!')
      navigate({ to: '/' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">
            {isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Đăng ký để bắt đầu' : 'Chào mừng quay lại'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                placeholder="Nhập username"
                {...register('username', { 
                  required: isSignUp ? 'Username là bắt buộc' : false
                })}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email"
              {...register('email', { 
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register('password', { 
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading 
              ? (isSignUp ? 'Đang đăng ký...' : 'Đang đăng nhập...') 
              : (isSignUp ? 'Đăng ký' : 'Đăng nhập')
            }
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              reset()
            }}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  )
}
