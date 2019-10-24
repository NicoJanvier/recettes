import React from 'react'
import useForm from "react-hook-form";
import { TextField, Button, Container } from '@material-ui/core';
import { useUserState } from '../contexts/user';



const Login = () => {
  const { register, errors, handleSubmit, formState } = useForm();
  const { authenticate, isLoading } = useUserState();

  const onSubmit = ({ username: email, password }) => {
    authenticate({ email, password });
  }
  if (isLoading) return null;
  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="on" >
        <TextField
          name="username"
          type="email"
          label="Email"
          required
          fullWidth
          inputRef={register({ required: true })}
          error={!!errors.email}
        />
        <TextField
          name="password"
          type="password"
          label="Mot de Passe"
          required
          fullWidth
          inputRef={register({ required: true })}
          error={!!errors.password}
        />
        <Button fullWidth type="submit" disabled={!formState.isValid}>Sign in</Button>
      </form>
    </Container>
  )
}

export default Login
