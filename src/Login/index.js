import React from 'react'
import styled from 'styled-components';
import useForm from "react-hook-form";
import { TextField, Button, Container, Avatar, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useUserState } from '../contexts/user';

const LockedAvatar = styled(Avatar)`
  margin: ${({ theme }) => theme.spacing(1)}px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
`
const Paper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)}px;
`

const StyledButton = styled(Button)`
  margin: ${({ theme }) => theme.spacing(2)}px 0;
`

const Login = () => {
  const { register, errors, handleSubmit, formState } = useForm();
  const { authenticate, isLoading } = useUserState();

  const onSubmit = ({ username: email, password }) => {
    authenticate({ email, password });
  }
  if (isLoading) return null;
  return (
    <Container>
      <Paper>
        <LockedAvatar>
          <LockOutlinedIcon />
        </LockedAvatar>
        <Typography component="h1" variant="h6">Sign in</Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
        >
          <TextField
            name="username"
            type="email"
            label="Addresse email"
            required
            inputRef={register({ required: true })}
            error={!!errors.email}
            variant="outlined"
            fullWidth
            autoFocus
            autoComplete="email"
            margin="normal"
          />
          <TextField
            name="password"
            type="password"
            label="Mot de Passe"
            required
            inputRef={register({ required: true })}
            error={!!errors.password}
            variant="outlined"
            fullWidth
            autoComplete="password"
            margin="normal"
          />
          <StyledButton
            fullWidth
            type="submit"
            disabled={!formState.isValid}
            variant="contained"
            color="primary"
          >
            Sign in
          </StyledButton>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
