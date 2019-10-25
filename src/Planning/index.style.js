import styled from 'styled-components';
import { Grid, Typography, Fab, Dialog, Container, Button } from '@material-ui/core';
import { AppBarWrapper } from '../List/index.style'

const ContainerWrapper = styled(Container)`
  padding-left: ${({ theme }) => theme.spacing(3)}px;
  padding-right: ${({ theme }) => theme.spacing(3)}px;
  > div {
    margin-top: 0;
  }
`
const BeforeButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: -${({ theme }) => theme.spacing(1)}px;
`
const GridRow = styled(Grid)`
  border-radius: ${({ theme }) => theme.radius.m};
  border: 2px dashed lightgrey;
`
const DateText = styled(Typography)`
  display: inline-block;
  &:not(:last-child) {
    padding-right: ${({ theme }) => theme.spacing(1)}px;
  }
`
const AddBtnCard = styled(Grid)`
  display: flex;
  justify-content: flex-end;
`
const RecipeCardWrapper = styled(Grid)`
  width: 100%;
  position: relative;
  &:hover {
    & .MuiCard-root {
      background-color: "rgba(0, 0, 0, 0.01)"
    }
  }
`
const DialogWrapper = styled(Dialog)`
  .paper {
    height: 100%;
  }
  .content {
    padding: 0;
    background-color: ${({ theme }) => theme.palette.grey[50]};
  }
  .dividers {
    border-top: none;
  }
  ${AppBarWrapper} {
    top: 0;
  }
`

export {
  GridRow,
  BeforeButton,
  DateText,
  AddBtnCard,
  RecipeCardWrapper,
  DialogWrapper,
  ContainerWrapper,
}