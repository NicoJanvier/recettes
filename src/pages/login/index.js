import React from 'react'
import { AppBar, LinearProgress, Container, Toolbar } from '@material-ui/core'
import { useUserState } from '../../contexts/user'
import Login from '../../Login'
import { BoxNextAppBar, Title } from '../../HeaderBar/index.style'

const LoginPage = () => {
  const { authenticate, isLoading } = useUserState();
  return (
    <>
      <AppBar>
        <Toolbar>
          <Title variant="h6" component="h1" noWrap>Mes Recettes</Title>
        </Toolbar>
      </AppBar>
      {isLoading && <LinearProgress color="secondary" />}
      <BoxNextAppBar>
        <Container>
          <Login {...{authenticate}}/>
        </Container>
      </BoxNextAppBar>
    </>
  )
}

export default LoginPage
